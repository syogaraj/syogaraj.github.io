---
title: "Understanding TCP Listen Sockets: Netstat vs. ss"
excerpt: <p>When a listen port bound process spawns a child process, netstat reports only one process whereas ss reports both parent and child processes in their outputs respectively. Let's understand how this is handled internally in netstat and ss.</p>
date: 2025-02-15
lang: en-US
category:
  - linux
  - network
tag:
  - netstat
  - ss
  - process
  - ports
---

Consider a web application serving on port 8080. Upon receiving a request, it will spawn a subprocess, execute something and returns the appropriate response.

`netstat` and `ss`: Both network utility tools report the network statistics such as connections, receive/send queue, listen ports etc., `ss` has preceded `netstat` in terms of perf/usage and netstat remains the classic one.

To list down the TCP listen sockets along with process name, use `netstat -ltnp` and `ss -lntp` command.

```shell {4} title="netstat output"
root@me:/# netstat -lntp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp6       0      0 :::8080                 :::*                    LISTEN      80/sh
tcp6       0      0 :::22                   :::*                    LISTEN      8/sshd: /usr/sbin/s
```

```shell {3} title="ss output"
root@me:/# ss -lntp
State              Recv-Q             Send-Q                          Local Address:Port                            Peer Address:Port             Process
LISTEN             0                  100                                         *:8080                                       *:*                 users:(("python3",pid=80,fd=37), ("sh",pid=81,fd=38))
LISTEN             0                  128                                      [::]:22                                      [::]:*                 users:(("sshd",pid=8,fd=4))
```

Check the `Program name/Process` column in the outputs and notice the difference? `netstat` gives the program name as `sh`, whereas `ss` reports both the `python` and `sh` process. To understand this difference, lets dive into the source code of the respective tools.

**netstat**: [net-tools/netstat.c](https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c) ,
**ss**: [iproute2/misc/ss.c](https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c)

## How `ss` report the processes

The main difference between netstat and ss is that, ss uses `netlink` to list the details which makes it efficient and performant when compared to netstat. If netlink is not available, it fallbacks to reading `/proc` to list the details.

`ss` - [main()](https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L5938) method parses the command-line arguments, sets relevant checks, flags etc., For the argument `-ltnp`, few flags and filters are set. If `-p` option is used, it invokes the `user_ent_hash_build()` method.

```c title="ss.c" {11-12}
...
 case 'p':
   show_processes++;
   break;
...
 case 'l':
   state_filter = (1 << SS_LISTEN) | (1 << SS_CLOSE);
   break;
...
...
 if (show_processes || show_threads || show_proc_ctx || show_sock_ctx)
  user_ent_hash_build();

```

### `user_ent_hash_build()` method

The [`user_ent_hash_build()`](https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L643) method,

- iterates the `/proc` directory,
- frames the path `/proc/pid` and
- calls the `user_ent_hash_build_task` method

The [`user_ent_hash_build_task()`](https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L550) method,

- reads fd details from `/proc/pid/fd` (sample output given below)
- checks for the pattern `"socket:["` in the fd.
- If matched, reads the `/proc/pid/stat`, gets the process name and calls `user_ent_add()` method.

```shell :no-line-numbers title="/proc/pid/fd"
root@me:/# ls -ot /proc/80/fd
lrwx------ 1 root 64 Feb 15 11:02 239 -> 'socket:[2327546]'
lrwx------ 1 root 64 Feb 15 11:02 240 -> 'socket:[2304828]'
lrwx------ 1 root 64 Feb 15 11:02 242 -> 'anon_inode:[eventpoll]'
...
```

```shell :no-line-numbers title="/proc/pid/stat"
root@10:/# cat /proc/80/stat
80 (python3) S 1 7 1 0 -1 4194560 243752 0 142 0 6139 1405 0 0 20 0 249 0 23051636 14670950400 199771 18446744073709551615 104903437819904 104903437823688 140724731611008 0 0 0 0 2 16800973 0 0 0 17 2 0 0 0 0 0 104903437831416 104903437832216 104904499953664 140724731613800 140724731615315 140724731615315 140724731617249 0
```

#### `user_ent_add()` method

The [`user_ent_add()`](https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L522) method calculates the hash based on the inode in the form of **linked list** (highlighted below). When printing the details, `user_ent_hash` is iterated and the `users` is printed with **all** the details available in the linked list.

```c {9-11} title="user_ent_add method"
static void user_ent_add(unsigned int ino, char *task,
     int pid, int tid, int fd,
     char *task_ctx,
     char *sock_ctx)
{
 struct user_ent *p, **pp;
 ...
 ...
 pp = &user_ent_hash[user_ent_hashfn(ino)];
 p->next = *pp;
 *pp = p;
}
```

## How `netstat` report the processes

Similar to `ss`, netstat starts off with the [main()](https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L2022) function, parsing the arguments, setting relevant checks, flags etc., We passed the argument `-lntp` to netstat, meaning `flag_tcp` will be enabled in the program. If `flag_tcp` is enabled, it starts a [for loop](https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L2304) and calls the `prg_cache_load()` method.

### `prg_cache_load()` method

The [`prg_cache_load()`](https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L398) method,

- iterates the `/proc` directory
- checks for permissions, frame `/proc/pid` and
- calls the `prg_cache_add` method

#### `prg_cache_add()` method

The [`prg_cache_add()`](https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L278) method,

- creates a hash for the inode
- checks if the given inode is already present in the `prg_hash`. `prg_hash` is the data-structure in which the details are stored.
- If present in the hash, it will not add the given inode.

This is basically assuming that there can be **only ONE process per port**. The comment in the source code also mentions the same (highlighted below). So, this is why `netstat` is unable to report multiple process per port.

```c {8-11} title='netstat.c'
static void prg_cache_add(unsigned long inode, char *name, const char *scon)
{
    unsigned hi = PRG_HASHIT(inode);
    struct prg_node **pnp,*pn;

    prg_cache_loaded = 2;
    for (pnp = prg_hash + hi; (pn = *pnp); pnp = &pn->next) {
        if (pn->inode == inode) {
            /* Some warning should be appropriate here
            as we got multiple processes for one i-node */
            return;
        }
    }
    ...
```

## Conclusion

The primary difference between netstat and ss is in how they handle process details:

- netstat uses a single entry per process, potentially missing additional processes associated with a port.
- ss uses a linked list to store multiple processes per port, offering a more comprehensive view.

Thank you for reading! See you in the next post.
