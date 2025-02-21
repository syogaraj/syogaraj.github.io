---
lang: en-US
title: Socket statistics using netlink
excerpt: <p>Netlink provides the sock_diag subsystem for obtaining information about sockets from the kernel. Get to know about how to obtain such information using netlink programming.</p>
date: 2025-02-22
category:
  - linux
tags:
  - socket
  - statistics
  - network
  - netlink
---

## The `sock_diag` subsystem

The manpage of the [sock_diag(7)](https://man7.org/linux/man-pages/man7/sock_diag.7.html) provides a well-structured and beginner-friendly explanation of its functionality. It covers the purpose of sock_diag—a netlink-based interface for querying socket statistics efficiently—along with details on message structures, socket filtering, and example usage.
We will use python for this example.

::: info About sock_diag from the manpage

The sock_diag netlink subsystem provides a mechanism for obtaining
information about sockets of various address families from the
kernel. This subsystem can be used to obtain information about
individual sockets or request a list of sockets.

:::

```python
import socket

NETLINK_SOCK_DIAG = 4

sock = socket.socket(socket.AF_NETLINK, socket.SOCK_RAW, NETLINK_SOCK_DIAG)
sock.bind((0, 0))
```

## Netlink `sock_diag` request

All netlink header starts with a `struct nlmsghdr` which is of 16-bytes. Field `nlmsg_type` must be set to `SOCK_DIAG_BY_FAMILY`.

```c no-line-numbers title="Netlink message header"
struct nlmsghdr {
    __u32         nlmsg_len;   /* Length of message (including header) */
    __u16         nlmsg_type;  /* Message type */
    __u16         nlmsg_flags; /* Additional flags */
    __u32         nlmsg_seq;   /* Sequence number */
    __u32         nlmsg_pid;   /* Sending process PID */
};
```

::: note
If the `nlmsg_flags` field of the `struct nlmsghdr` header has the
`NLM_F_DUMP` flag set, it means that a list of sockets is being
requested; **otherwise it is a query about an individual socket.**
:::

_(note-to-self)_ Since we are going to query list of sockets, `nlmsg_flags` should contain `NLM_F_DUMP` flag.

### IPv4 and IPv6 Socket Request

sock_diag request for all address families contains a common part, `struct sock_diag_req`, followed by the actual request details.

```c no-line-numbers title="Common part for sock_diag request"
struct sock_diag_req {
    __u8 sdiag_family;      //AF_* Address Family
    __u8 sdiag_protocol;    // IPPROTO_* for AF_INET & AF_INET6. Otherwise, set to 0
};
```

For IPv4 and IPv6 sockets, the structures `inet_diag_req_v2` and `inet_diag_sockid` are utilized. For this example, we will assume to get the socket stats of listen sockets with a particular port.
Let's create a constructor method to assemble these structures.

```python :no-collapsed-lines
# (from enum <netinet/tcp.h>)
TCP_LISTEN = 10

def construct_inet_diag_req_v2():
    """
    struct inet_diag_req_v2 {
               __u8    sdiag_family;
               __u8    sdiag_protocol;  // this is struct sock_diag_req
               __u8    idiag_ext;
               __u8    pad;
               __u32   idiag_states;
               struct inet_diag_sockid id;
           };
    """
    return struct.pack(
        "BBBBI",  # Format string for inet_diag_req_v2 (simplified)
        socket.AF_INET | socket.AF_INET6,      # sdiag_family
        socket.IPPROTO_TCP,  # sdiag_protocol
        0,            # idiag_ext (no extensions for now)
        0,      # pad,
        1 << TCP_LISTEN,  # idiag_states (TCP_LISTEN)
    )

```

If needed, We can fill in additional filter details in the `inet_diag_sockid`. Since, our target is to query for a particular listening port, only the field `idiag_sport` is set.

```python :no-collapsed-lines
def construct_inet_diag_sockid(port: int):
    """
    struct inet_diag_sockid {
               __be16  idiag_sport;     // 1H
               __be16  idiag_dport;     // 1H
               __be32  idiag_src[4];    // 4I
               __be32  idiag_dst[4];    // 4I
               __u32   idiag_if;        // 1I
               __u32   idiag_cookie[2]; // 2I
           };
    """
    return struct.pack(
        "2H11I",      # Format string for inet_diag_id
        socket.htons(port),  # sport
        0,                  # dport
        0, 0, 0, 0,  # source ip
        0, 0, 0, 0,   # dest ip
        0,             # idiag_if (interface index)
        0xffffffff, 0xffffffff,         # idiag_cookie[2]
    )
```

### Sending the request

For sending the request, we must create the netlink message header `nlmsghdr` and append the payloads from `construct_inet_diag_req_v2` and `construct_inet_diag_sockid`.

```python title="netlink request" :no-collapsed-lines
def construct_nl_msg_header(payload_size: int):
    """
        struct nlmsghdr {
            __u32         nlmsg_len;   /* Length of message (including header) */
            __u16         nlmsg_type;  /* Message type */
            __u16         nlmsg_flags; /* Additional flags */
            __u32         nlmsg_seq;   /* Sequence number */
            __u32         nlmsg_pid;   /* Sending process PID */
        };
    """
    nlmsg_len = NLMSG_HDR_SIZE + payload_size

    return struct.pack(
        "IHHII",      # Format string for nlmsghdr
        nlmsg_len,    # nlmsg_len (calculated length)
        SOCK_DIAG_BY_FAMILY,  # nlmsg_type (SOCK_DIAG_BY_FAMILY)
        NLM_F_REQUEST | NLM_F_DUMP,  # nlmsg_flags (request and dump)
        1,            # nlmsg_seq (sequence number - arbitrary)
        os.getpid()   # nlmsg_pid (process ID)
    )

req_payload = construct_inet_diag_req_v2() + construct_inet_diag_sockid(ns.port)

# struct inet_diag_sockid + struct inet_diag_req_v2
req_payload_size = len(req_payload)

nl_request = construct_nl_msg_header(req_payload_size) + req_payload

```

We can then send the `nl_request` to our netlink socket and receive the response.

```python
sock.sendto(nl_request, (0,0))
```

## Netlink `sock_diag` Response

Like any other Netlink message, the first part consists of the `nlmsghdr`, which contains metadata about the response. The message should be parsed based on the `nl_msg_type`. The expected message types include:

- `NLMSG_ERROR` – Indicates an error in the request sent.
- `NLMSG_DONE` – Marks the end of the message.
- `SOCK_DIAG_BY_FAMILY` – The type we specified in the request.

Proper handling of these message types is essential to prevent errors in the program.

```python title="parser.py"
while True:
    response = sock.recv(4096)  # Receive buffer size

    if not response:
        break

    # parsing nlmsghdr.
    nl_header_len, msg_type, flags, seq, pid = struct.unpack(
        "IHHII", response[:NLMSG_HDR_SIZE])

    response = response[NLMSG_HDR_SIZE:]

    if msg_type == NLMSG_ERROR:
        error_code = struct.unpack(
            "i", response[NLMSG_HDR_SIZE: NLMSG_HDR_SIZE+4])
        print(f"Netlink error response received. {error_code}")
        break

    elif msg_type == SOCK_DIAG_BY_FAMILY:
        inet_diag_msg = parse_netlink_message(response)
        print(f"Parsed response: {inet_diag_msg}")

    elif msg_type == NLMSG_DONE:
        break  # No more messages expected for this request

```

### Parsing the Response

::: info From the man page,
The response to a query for IPv4 or IPv6 sockets is represented as
an array of,

```c title="sock_diag response"
struct inet_diag_msg {
    __u8    idiag_family;
    __u8    idiag_state;
    __u8    idiag_timer;
    __u8    idiag_retrans;

    struct inet_diag_sockid id;

    __u32   idiag_expires;
    __u32   idiag_rqueue;
    __u32   idiag_wqueue;
    __u32   idiag_uid;
    __u32   idiag_inode;
};
```

followed by netlink attributes.

:::

Each field explanation in the `inet_diag_msg` can be found in the man page. Let's parse the response with the above details.
I've used `namedtuple` to store the response to access it later in the main program.

```python title="sock_diag response parser" :no-collapsed-lines
NL_INET_DIAG_MSG = namedtuple('inet_diag_msg', [
                                   'family', 'state', 'timer', 'retrans', 'sport', 'dport', 'ifc', 'expires', 'rqueue', 'wqueue', 'uid', 'inode'])

def parse_netlink_message(response):
    """
    struct inet_diag_msg {
        __u8    idiag_family;
        __u8    idiag_state;
        __u8    idiag_timer;
        __u8    idiag_retrans;

        struct inet_diag_sockid id;

        __u32   idiag_expires;
        __u32   idiag_rqueue;
        __u32   idiag_wqueue;
        __u32   idiag_uid;
        __u32   idiag_inode;
    };
    """

    family, state, timer, retrans = struct.unpack("4B", response[:4])

    # struct inet_diag_sockid --> 48 bytes. ignoring source/dest ips and cookie
    sport, dport, _, _, _, _, _, _, _, _, ifc, c1, c2 = struct.unpack(
        "2H11I", response[4:52])

    expires, rqueue, wqueue, uid, inode = struct.unpack(
        "5I", response[52:72])

    return NL_INET_DIAG_MSG(family, state, timer, retrans, socket.ntohs(sport), dport, ifc, expires, rqueue, wqueue, uid, inode)
```

## Running the program

Putting it all together and Adding some additional `argparse` for beautification, we end up with the below code.

```python title="get_socket_stats.py"
import socket
import struct
import os
import argparse
import sys
import traceback
from collections import namedtuple

NETLINK_SOCK_DIAG = 4

# Message Type for socket diagnostics request
SOCK_DIAG_BY_FAMILY = 20  # From <linux/sock_diag.h>

# Netlink flags
NLM_F_REQUEST = 0x01

NLM_F_ROOT = 0x100
NLM_F_MATCH = 0x200
NLM_F_DUMP = (NLM_F_ROOT | NLM_F_MATCH)

# TCP_LISTEN state value (from enum <netinet/tcp.h>)
TCP_LISTEN = 10

NLMSG_HDR_SIZE = 16  # static Size of nlmsghdr

#  (from <linux/netlink.h>)
NLMSG_ERROR = 2
NLMSG_DONE = 3


NL_INET_DIAG_MSG = namedtuple('inet_diag_msg', [
                                   'family', 'state', 'timer', 'retrans', 'sport', 'dport', 'ifc', 'expires', 'rqueue', 'wqueue', 'uid', 'inode'])


def construct_inet_diag_req_v2():
    """
    struct inet_diag_req_v2 {
               __u8    sdiag_family;
               __u8    sdiag_protocol;  // this is struct sock_diag_req
               __u8    idiag_ext;
               __u8    pad;
               __u32   idiag_states;
               struct inet_diag_sockid id;
           };
    """
    return struct.pack(
        "BBBBI",  # Format string for inet_diag_req_v2 (simplified)
        socket.AF_INET | socket.AF_INET6,      # sdiag_family
        socket.IPPROTO_TCP,  # sdiag_protocol
        0,            # idiag_ext (no extensions for now)
        0,      # pad,
        1 << TCP_LISTEN,  # idiag_states (TCP_LISTEN)
    )


def construct_inet_diag_sockid(port: int):
    """
    struct inet_diag_sockid {
               __be16  idiag_sport;     // 1H
               __be16  idiag_dport;     // 1H
               __be32  idiag_src[4];    // 4I
               __be32  idiag_dst[4];    // 4I
               __u32   idiag_if;        // 1I
               __u32   idiag_cookie[2]; // 2I
           };
    """
    return struct.pack(
        "2H11I",      # Format string for inet_diag_id
        socket.htons(port),  # sport
        0,                  # dport
        0, 0, 0, 0,  # source ip
        0, 0, 0, 0,   # dest ip
        0,             # idiag_if (interface index)
        0xffffffff, 0xffffffff,         # idiag_cookie[2]
    )


def construct_nl_msg_header(payload_size: int):
    """
        struct nlmsghdr {
            __u32         nlmsg_len;   /* Length of message (including header) */
            __u16         nlmsg_type;  /* Message type */
            __u16         nlmsg_flags; /* Additional flags */
            __u32         nlmsg_seq;   /* Sequence number */
            __u32         nlmsg_pid;   /* Sending process PID */
        };
    """
    nlmsg_len = NLMSG_HDR_SIZE + payload_size

    return struct.pack(
        "IHHII",      # Format string for nlmsghdr
        nlmsg_len,    # nlmsg_len (calculated length)
        SOCK_DIAG_BY_FAMILY,  # nlmsg_type (SOCK_DIAG_BY_FAMILY)
        NLM_F_REQUEST | NLM_F_DUMP,  # nlmsg_flags (request and dump)
        1,            # nlmsg_seq (sequence number - arbitrary)
        os.getpid()   # nlmsg_pid (process ID)
    )


def parse_netlink_message(response):
    """
    struct inet_diag_msg {
        __u8    idiag_family;  // B
        __u8    idiag_state;   // B
        __u8    idiag_timer;   // B
        __u8    idiag_retrans; // B

        struct inet_diag_sockid id;  // =HH4I4ILLL

        __u32   idiag_expires;  // L
        __u32   idiag_rqueue;   // L
        __u32   idiag_wqueue;
        __u32   idiag_uid;
        __u32   idiag_inode;
    };
    """

    family, state, timer, retrans = struct.unpack("4B", response[:4])

    # struct inet_diag_sockid --> 48 bytes. ignoring source/dest ips and cookie
    sport, dport, _, _, _, _, _, _, _, _, ifc, c1, c2 = struct.unpack(
        "2H11I", response[4:52])

    expires, rqueue, wqueue, uid, inode = struct.unpack(
        "5I", response[52:72])

    return NL_INET_DIAG_MSG(family, state, timer, retrans, socket.ntohs(sport), dport, ifc, expires, rqueue, wqueue, uid, inode)


def construct_nl_request(ns):
    req_payload = construct_inet_diag_req_v2() + construct_inet_diag_sockid(ns.port)

    # struct inet_diag_sockid + struct inet_diag_req_v2
    req_payload_size = len(req_payload)

    return construct_nl_msg_header(req_payload_size) + req_payload


parser = argparse.ArgumentParser()
parser.add_argument("-p", "--port", dest="port", type=int,
                    required=True, help="listen port to get the socket stats")

if __name__ == "__main__":

    ns = parser.parse_args(sys.argv[1:])

    sock = socket.socket(socket.AF_NETLINK, socket.SOCK_RAW, NETLINK_SOCK_DIAG)
    sock.bind((0, 0))

    nl_request = construct_nl_request(ns)

    try:
        sock.sendto(nl_request, (0, 0))
        sock.settimeout(5.0)

        while True:
            response = sock.recv(4096)

            if not response:
                break

            nl_header_len, msg_type, flags, seq, pid = struct.unpack(
                "IHHII", response[:NLMSG_HDR_SIZE])

            response = response[NLMSG_HDR_SIZE:]

            if msg_type == NLMSG_ERROR:
                error_code = struct.unpack(
                    "i", response[NLMSG_HDR_SIZE: NLMSG_HDR_SIZE+4])
                print(f"Netlink error response received. {error_code}")
                break

            elif msg_type == SOCK_DIAG_BY_FAMILY:
                inet_diag_msg = parse_netlink_message(response)
                print(inet_diag_msg)
                print(f"Backlog for port {inet_diag_msg.sport}: {inet_diag_msg.rqueue}")

            elif msg_type == NLMSG_DONE:
                break  # No more messages expected for this request
    except:
        print(traceback.format_exc())
    finally:
        sock.close()
```

```shell
root@me:/# python3 get_socket_stats.py -p 8081
Parsed response: inet_diag_msg(family=10, state=10, timer=0, retrans=0, sport=8081, dport=0, ifc=0, expires=0, rqueue=0, wqueue=4096, uid=0, inode=2313434)
```

Thank you for reading! See you in the next post.
