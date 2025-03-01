---
title: "eBPF: Using LPM Trie map to filter packets"
date: 2025-03-01
category:
  - linux
  - ebpf
  - network
tags:
  - LPM Trie
  - Trie
  - maps
  - filter
  - packets
  - firewall
  - ebpf
excerpt: <p>Ever since the advent of ebpf, various use-cases have sprung up where ebpf can be used. One such example is a packet-filter that leverages ebpf to provide more security, customisable and with less performance overhead. Lets understand how to build our own packet filter using LPM map.</p>
---

::: warning This article assumes that the reader is already aware of ebpf.
:::

Since its inception, eBPF has enabled a variety of use cases. Initially, eBPF was primarily focused on the network stack, which led to the development of the Express Data Path (XDP). One example is a packet filter that uses eBPF-XDP to deliver enhanced security, greater customization, and lower performance overhead.

Few use-cases of XDP include,

- Pre-stack processing like filtering to support DDoS mitigation
- Forwarding, load balancing and etc.,

We will mainly focus on **packet filter** for this article. The [xdp-filter](https://github.com/xdp-project/xdp-tools/tree/main/xdp-filter) from the `xdp-project` provides an example of implementing a packet filter using the xdp technology.

## LPM Trie

`LPM` - Longest Prefix Match. As the name suggests, a key will be matched based on the maximum prefix length match. In other words, the key is compared to various prefixes, and the prefix that best (i.e., most specifically) matches the key is chosen.

### Why LPM Trie map?

The `xdp-filter` example uses a `PerCPU-Hash` map to look up IP entries for filtering. In a production environment with multiple VLAN segments, filtering communication between VLANs by explicitly listing all IPs is impractical. Adding a large number of IPs would consume excessive memory for the map itself.

This is where `LPM-Trie` map shines. Instead of listing down all IPs, we can just mention the VLAN cidr bit as the prefix length for matching. Consider a VLAN segment `192.168.10.0/24`, this can be expressed as,

- Prefix length : 24
- Address/Data : 192.168.10.0

When a lookup for `192.168.10.10` is done, the key `192.168.10.0/24` will match and we can proceed filtering the traffic. Unlike, percpu-hash which uses a full IPv4 length, using LPM-Trie we can hold huge IP addresses in a single key.

### Defining the LPM Map

We will use the [`BPF_MAP_TYPE_LPM_TRIE`](https://docs.kernel.org/bpf/map_lpm_trie.html) type when declaring the map type.

::: caution `BPF_F_NO_PREALLOC` flag
When creating a map of type `BPF_MAP_TYPE_LPM_TRIE`, you **must** set the `BPF_F_NO_PREALLOC` flag.
:::

```c title="LPM Map definition"
struct lpm_key{
    __u32 prefixlen;
    __u32 data;
}

struct {
        __uint(type, BPF_MAP_TYPE_LPM_TRIE);
        __type(key, struct lpm_key);
        __type(value, __u32);
        __uint(map_flags, BPF_F_NO_PREALLOC);
        __uint(max_entries, 255);
} lpm_map SEC(".maps");

```

The above is as defined in the kernel docs of BPF LPM Trie map. But, what if we want to filter both IPv4 and IPv6 IPs? We can have two separate keys and maps to filter them when parsing the packet using xdp. That's kind of ugly. Let's redefine the `lpm_key` to accomodate both IPv4 and IPv6 addresses. An IPv6 address is 128-bits. Hence, we define a `struct ip` to be of 128 bits (4 x 32).

```c :no-collapsed-lines
struct ip {
    __u32 ip[4];  //IPv6 is 128 bits.
}

struct lpm_key {
    __u32 prefixlen;
    struct ip addr;
}
```

#### But, how to define IPv4 addresses?

In case of IPv4 addresses, we can represent an IPv4 address as IPv6 mapped address.

| IPv4          | IPv6-mapped                             |
| ------------- | --------------------------------------- |
| 192.168.10.10 | 0000:0000:0000:0000:0000:ffff:c0a8:0a0a |

Notice, that the IPv4 address sits at the last in hex-notation and the before places are filled with `00` and `ff`'s? We will do the same when defining our struct for IPv4 addresses. i.e.,

```c :no-line-numbers title="v4 to v6-mapped"
ip[0] --> 0             // 0000:0000
ip[1] --> 0             // 0000:0000
ip[2] --> 0x0000ffff    // 0000:ffff
ip[3] --> 3232238090    // c0a8:0a0a
```

### Populating the LPM Map

When populating our LPM map, be aware that our LPM key now supports both IPv4 and IPv6 address. Our `prefixlen` should reflect the same. For IPv4 addresses, the first 3 indicies of our ip array is constant. Our prefix len for IPv4 addresses can be calculated as `constant` + `CIDR bit`. Ex: The prefixlen for `192.168.10.0/24` is **120**.

- Constant (3-places): 3 \* 32 = 96
- CIDR bit : 24

### Querying the LPM Map

When querying the `lpm_map`, the prefixlen should be calculated as highlighted below. Handling of IPv4 address is highlighted in the below code.

::: code-tabs

@tab lpm_packet_filer.bpf.c

```c {7-10,14-15} title="filter.bpf.c"
SEC("xdp")
int packet_filter(struct xdp_md *ctx) {
    __u32 action = XDP_DROP; // default action
    // Ethernet, IP, Protocol header parsing...

    struct ip addr = {};
    if (eth_type == ETH_P_IP) {    // IPv4 address
        addr.ip[2] = bpf_htonl(0x0000ffff);
        addr.ip[3] = iphdr->saddr;   // iphdr --> struct iphdr
    }

    struct lpm_key key = {};
    memset(&key, 0, sizeof(struct lpm_key));
    key.prefixlen = (sizeof(struct lpm_key) - 4) * 8; // remove 4 bytes used for prefixlen
    key.addr = addr;

    __u32 is_allowed = bpf_map_lookup_elem(&lpm_map, &key);
    if (is_allowed) {
        action = XDP_PASS;
    }

    return action;

}
```

@tab map_defs.h

```c title="map_defs.h"
struct ip {
    __u32 ip[4];  //IPv6 is 128 bits.
}

struct lpm_key {
    __u32 prefixlen;
    struct ip addr;
}

struct {
        __uint(type, BPF_MAP_TYPE_LPM_TRIE);
        __type(key, struct lpm_key);
        __type(value, __u32);
        __uint(map_flags, BPF_F_NO_PREALLOC);
        __uint(max_entries, 255);
} lpm_map SEC(".maps");

```

:::

Thank you for reading! See you in the next post.
