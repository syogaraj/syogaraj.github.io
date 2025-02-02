---
title: "Identifying network interface link flap using netlink"
description: "A detailed explanation on how to identify link flap using netlink"
lang: en-US
date: "2025-01-26"
head:
  - - meta
    - name: keywords
      content: interface flap netlink research linux
---

# Identifying network interface link flap using netlink

## Network interface link

A network interface link is a connection between a network interface and another network interface or node. A network interface is the point of connection between a device and a network.

## What is a link flap?

Link flap is a condition where a communications link alternates between up and down states.

### Cause

Link flap can be caused by end station reboots, power-saving features, incorrect duplex configuration or marginal connections, faulty transceivers or ports, and signal integrity issues on the link.

### Effect

Link flapping on an interface causes **increased latency**, **network instability** and even **application downtime**, which everyone wants to avoid.

### Downside

Most of the time, a link flap is identified only after it starts causing noticeable issues, often leading to prolonged downtime or performance degradation. Debugging usually spans multiple teams—Application, Operations, and Infrastructure—since each initially assumes the problem lies within their own domain. By the time the root cause is identified as a link flap, the issue may have persisted for hours, damaging the application's reputation and user trust.

## Identifying a link flap

### Link status

To get the interface link status, we can make use of the `ip link` command and look for the `state` in the ouptut.

```bash :no-line-numbers /state UP/ /state UNKNOWN/
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
3: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DORMANT group default qlen 1000
    link/ether d4:54:8b:c4:7b:dd brd ff:ff:ff:ff:ff:ff
```

When the `state` of the network interface changes between `UP` and `DOWN`, we have a flap.

### ip monitor

The [ip-monitor](https://man7.org/linux/man-pages/man8/ip-monitor.8.html) utility provided in Linux continuously monitors the state of devices, addresses, routes and dumps the event.

To monitor only the link status,

```bash :no-line-numbers title="terminal-1"
$ ip monitor link

```

From another terminal, we will make the `wlp0s20f3` status as down.

```bash :no-line-numbers title="terminal-2"
$ sudo ip link set wlp0s20f3 down
```

We received some event print in terminal-1.

```bash :no-line-numbers title="terminal-1"
$ ip monitor link

3: wlp0s20f3: <BROADCAST,MULTICAST,UP>
    link/ether
3: wlp0s20f3: <BROADCAST,MULTICAST> mtu 1500 qdisc noqueue state DOWN group default
    link/ether d4:54:8b:c4:7b:dd brd ff:ff:ff:ff:ff:ff
```

The status of the interface can be made `UP` again by,

```bash :no-line-numbers title="terminal-2"
$ sudo ip link set wlp0s20f3 up
```

```bash :no-line-numbers title='terminal-1' :collapsed-lines=5
# ip monitor link (output contd.)
3: wlp0s20f3: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether d4:54:8b:c4:7b:dd brd ff:ff:ff:ff:ff:ff
3: wlp0s20f3: <NO-CARRIER,BROADCAST,MULTICAST,UP>
    link/ether
3: wlp0s20f3: <NO-CARRIER,BROADCAST,MULTICAST,UP,LOWER_UP>
    link/ether
3: wlp0s20f3: <NO-CARRIER,BROADCAST,MULTICAST,UP,LOWER_UP>
    link/ether
3: wlp0s20f3: <NO-CARRIER,BROADCAST,MULTICAST,UP,LOWER_UP>
    link/ether
3: wlp0s20f3: <NO-CARRIER,BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state DORMANT group default
    link/ether d4:54:8b:c4:7b:dd brd ff:ff:ff:ff:ff:ff
3: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether d4:54:8b:c4:7b:dd brd ff:ff:ff:ff:ff:ff
3: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP>
    link/ether
3: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP>
    link/ether
^C
```

We can identify the interface in which the flap occurs by parsing the output. In this case, it will be `wlp0s20f3`.

> One should NOT determine the interface flap with just one up/down event. It can be caused because of maintenance as well.
> Ideally, if there are multiple up/down events within a certain period of time, we can consider it as a flap.

The man page of `ip-monitor` mentions that it opens `RTNETLINK`, listens on it and dumps the state changes. We will explore more about `netlink` in the next section.

### Netlink

One of the reason that led to explore netlink was, the output provided by the `ip monitor` command. It looks like a dump as stated in the manpage.

Netlink is a powerful communication mechanism in the Linux kernel that allows interaction between the kernel and user-space applications. Originally introduced as a replacement for the traditional ioctl system calls, Netlink provides a more flexible, efficient, and extensible interface for exchanging messages between these two layers.

Netlink is implemented as a socket-based IPC (Inter-Process Communication) mechanism and is widely used in networking, system monitoring, and kernel configuration tasks.

#### Advantages of Netlink

1. Netlink messages have a structured format with headers (nlmsghdr) that describe the payload, making parsing efficient.
2. Applications open a Netlink socket and send/receive messages using standard socket APIs (e.g., socket(), send(), recv()).
3. Async notifications: the kernel can proactively notify user-space processes about specific events.
   and much more

#### Implementation

The implementation example uses `python` for listening to netlink events. Netlink socket uses the `AF_NETLINK` address family and supports multiple protocol types such as `NETLINK_ROUTE`, `NETLINK_FIREWALL` and etc.,

```python
# NOTE: The values of RTM_* are defined in rtnetlink.h

# Create a netlink socket
sock = socket.socket(socket.AF_NETLINK, socket.SOCK_RAW, NETLINK_ROUTE)

# Bind the socket to the desired group to get the notification
sock.bind((0, RTM_NEWLINK | RTM_DELLINK))
```

Once bound, we can start to receive the message and parse it. I had mentioned that netlink messages have a structured format that makes the parsing easier and efficient. Let's take a look at the message structure.

<CaptionedImage src="/images/blog/interface-flap-netlink/msg_structure.png" caption="Netlink message structure"></CaptionedImage>

The first 32bit (4bytes) represents the message length followed by the type `RTM_*` link (16bit). In our case, it will be either `RTM_NEWLINK` or `RTM_DELLINK`. We will use python [struct](https://docs.python.org/3/library/struct.html) package to parse the netlink message. A quick refresh on the [format characters](https://docs.python.org/3/library/struct.html#format-characters). We will ignore the sequence number and port as it goes beyond the scope of this blog.

```python title="parser.py"
nlmsg_len, nlmsg_type, flags = struct.unpack("IHH", data[:8])

# sequence numbers = 4bytes, port = 4bytes.
# We read the length, type, flags from the first 8 bytes.
# Remaining is the payload.
payload = data[16:]

```

All netlink link messages share a common header (`struct ifinfomsg`) which is appended after the netlink header (`struct nlmsghdr`).The meaning of each field may differ depending on the message type. A struct ifinfomsg is defined in `<linux/rtnetlink.h>` to represent the header.

```c title="struct ifinfomsg"
struct ifinfomsg {
    unsigned char   ifi_family;
    unsigned char   __ifi_pad;
    unsigned short  ifi_type;       /* ARPHRD_* */
    int     ifi_index;      /* Link index   */
    unsigned    ifi_flags;      /* IFF_* flags  */
    unsigned    ifi_change;     /* IFF_* change mask */
};
```

```python title="parser.py"
ifi_family, ifi_pad, ifi_type, ifi_index, ifi_flags, ifi_change = struct.unpack("BBhiII", payload[:16])

# from if.h
IFF_UP =  1 << 0
IFF_RUNNING = 1 << 6
IFA_INTERFACE = 3

event = 'down'
if (ifi_flags & IFF_UP) and (ifi_flags & IFF_RUNNING):
    # Interface is considered up, if and only if its UP and RUNNING.
    # Some interfaces may be just added, we don't need that for now.
    event = 'up'
attrs = parse_attributes(payload[16:])

interface = attrs[IFA_INTERFACE].decode('utf-8').rstrip('\x00')
```

The `parse_attributes` is a method that will parse the remaining payload based on `TLV` (type, length, value) and returns a `dict` containing the `interface` in value.

```python title="parser.py"
def parse_attributes(data):
    """Parse TLV (type, length, value) attributes from the payload."""
    attrs = {}
    while len(data) >= 4:  # Minimum TLV header size
        rta_len, rta_type = struct.unpack("HH", data[:4])
        if rta_len < 4 or rta_len > len(data):
            break  # Malformed attribute
        value = data[4:rta_len]
        attrs[rta_type] = value
        data = data[rta_len:]  # Move to the next attribute
    return attrs
```

With `interface` and `nlmsg_type`, we can identify the flapping interface by storing the previous state of the interface received from netlink event.

```python
# we will store the previous states of the interface and its last event time for identifying the flap.
# eg: {
#   "wlp0s20f3": {"state": 'up', "timestamp": 1737887558000}
#   }
prev_states = {}

interface = ... # from prev code.
event = ... # from prev code.

if interface in prev_states and \
    prev_states[interface]['state'] != event and \
    (int(time.time()*1000) - prev_states[interface]['timestamp']) < 10*60*1000:
    # we received a state change for the interface within 10mins. So, this is a flap!
    # We can tweak the threshold as needed.
    print(f"Interface flap detected for {interface}")
```

Thank you for reading! See you in the next post.
