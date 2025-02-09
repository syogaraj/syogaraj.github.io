---
title: "Identifying IP bind/unbind on network interface using netlink"
description: "A detailed explanation on how to identify IP bind/unbind using netlink"
lang: en-US
date: 2025-02-08
category:
  - linux
tag:
  - netlink
  - python
head:
  - - meta
    - name: keywords
      content: interface bind netlink research linux unbind
star: true
excerpt: Internet Protocol (IP) addresses are essential, acting as unique identifiers for devices connected to a network. But, if a single IP binds to multiple machines, it can trigger a split-brain scenario. This means data is routed to multiple destinations making it hard to track data flow. Proactive monitoring of VIP bind unbind events is essential to detect and prevent such issues.
---

# IP bind/unbind on network interface using netlink

## IP Address

Internet Protocol (IP) addresses are essential, acting as unique identifiers for devices connected to a network. Think of them like postal addresses for the digital world, ensuring data is sent to the correct destination. Without IP addresses, devices couldn't find each other, making activities like sharing data, replication difficult.

## Virtual IP Address

In most distributed systems, people use a concept of virtual ip (VIP) where the application makes the call to virtual ip and the machine that bounds the virtual ip receives the data. Why is this important? Why can't we just send data to the respective machine?

**Machine IPs are fragile**: If a machine fails (disk crash, etc.), its IP goes down. Apps would need complex logic to find and switch to a new machine's IP. This logic must be repeated across all applications.

For the same case, If we use a virtual IP, the virtual IP shall instantly move on to the next available machine, making zero code change on the application and high availability.

## Split brain: When VIPs Go Wrong

Ok! VIP is awesome, but that brings it own set of problems. What happens if one VIP is bound to multiple machines? This is called **split-brain** where the data will be written to multiple destinations instead of a single one. The destination is decided based on the **ARP cache** of the machine. ARP caches are updated periodically making it harder to identify which data went where leading to eternal chaos.

To mitigate this risk, we need to monitor VIP bind and unbind events across machines to proactively detect any split-brain conditions. While robust failover mechanisms should ideally prevent these situations, it's crucial to identify and address them early to avoid data inconsistency. Lets dive into the implementation!

## Netlink

Netlink is a powerful communication mechanism in the Linux kernel that allows interaction between the kernel and user-space applications. Originally introduced as a replacement for the traditional ioctl system calls, Netlink provides a more flexible, efficient, and extensible interface for exchanging messages between these two layers.

Netlink is implemented as a socket-based IPC (Inter-Process Communication) mechanism and is widely used in networking, system monitoring, and kernel configuration tasks. For those new to netlink, this [blog post](/blog/interface-flap-netlink.html#netlink) offers a quick/concise introduction. I highly recommend reviewing it if you’re encountering netlink for the first time.

### Implementation

As referred in the other blog, we will be using `python` for listening to netlink events.

```python
# NOTE: The values of RTM_* are defined in rtnetlink.h

# Create a netlink socket
sock = socket.socket(socket.AF_NETLINK, socket.SOCK_RAW, NETLINK_ROUTE)

# Bind the socket to the desired group to get the notification
sock.bind((0, RTM_NEWADDR | RTM_DELADDR))

```

Once bound, we can start to receive the message and parse it. As said in the other blog, netlink messages have a structured format. (refer below)

<CaptionedImage src="/images/blog/interface-flap-netlink/msg_structure.png" caption="Netlink message structure"></CaptionedImage>

The first 32bit (4bytes) represents the message length followed by the type `RTM_*` link (16bit). In our case, it will be either `RTM_NEWADDR` or `RTM_DELADDR`. We will use python [struct](https://docs.python.org/3/library/struct.html) package to parse the netlink message. A quick refresh on the [format characters](https://docs.python.org/3/library/struct.html#format-characters).

```python title="parser.py"
nlmsg_len, nlmsg_type, flags = struct.unpack("IHH", data[:8])

# sequence numbers = 4bytes, port = 4bytes.
# We read the length, type, flags from the first 8 bytes.
# Remaining is the payload.
payload = data[16:]

```

If the message type is of `RTM_NEWADDR`, a new IP is bound to an interface. else, a IP is unbound from an interface. The message received will have the below `struct ifaddrmsg` header.

```c
struct ifaddrmsg {
    __u8        ifa_family;
    __u8        ifa_prefixlen;  /* The prefix length        */
    __u8        ifa_flags;  /* Flags            */
    __u8        ifa_scope;  /* Address scope        */
    __u32       ifa_index;  /* Link index           */
};
```

We will parse the header using the `struct.unpack` method, followed by parsing the payload using the `parse_attributes` method used in the other blog.

```python title="parser.py"
ifa_family, ifa_prefixlen, ifa_flags, ifa_scope, ifa_index = struct.unpack("BBBBI", payload[:8])

attrs = parse_attributes(payload[8:])  # first 8 bytes is message header.
```

`parse_attributes` method returns a `dict` containing the details such as,

1. Address
2. Local
3. Interface
4. Netmask

We will represent this in a value-object class for easier understanding.

```python
class IFA:
    ADDRESS = 1
    LOCAL = 2
    INTERFACE = 3
    NETMASK = 4
```

```python title="parser.py"
# parser.py contd.

event_type = "IP bind" if nlmsg_type == RTM_NEWADDR else "IP Unbind"
ip_addr = socket.inet_ntoa(attrs[IFA.ADDRESS])
interface = attrs[IFA.INTERFACE].decode('utf-8')
netmask = socket.inet_ntoa(attrs[IFA.NETMASK])

print(f'{event_type} on {interface} with IP [{ip_addr}] and netmask [{netmask}]')
```

Commands to simulate IP bind/unbind:

```shell
# To bind the IP
$ sudo ifconfig wlp0s20f3:ip 192.168.1.230 netmask 255.255.255.0

# To unbind the IP
$ sudo ifconfig wlp0s20f3:ip down
```

Sample output:

```shell
$ python3 monitor_ip_events.py
Listening for IP bind/unbind events...

IP bind on wlp0s20f3:ip with IP [192.168.1.230] and netmask [192.168.1.255]
IP Unbind on wlp0s20f3:ip with ip [192.168.1.230] and netmask [192.168.1.255]
```

Thank you for reading! See you in the next post.
