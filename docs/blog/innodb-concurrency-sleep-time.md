---
title: Understanding MySQL InnoDB Concurrency and Sleep Time using eBPF
summary: A deep dive into how InnoDB handles concurrency and the role of sleep time in managing contention.
lang: en-US
date: 2026-01-21
head:
  - - meta
    - name: keywords
      content: mysql innodb concurrency sleep ebpf
tags:
  - InnoDB
  - MySQL
  - Database
  - Concurrency
  - eBPF
---

::: warning This article assumes that the reader is already aware of MySQL and eBPF.
:::

InnoDB is the default storage engine for MySQL. Each SQL statement is executed in the form of transactions inside InnoDB. InnoDB uses OS threads to execute these transactions. In a multi-core environment (CPU), multiple queries can execute simultaneously.

Too many queries at a time can result in too many context switches and this itself becomes a problem. This is avoided by setting a concurrency limit to InnoDB.

## InnoDB Concurrency

InnoDB concurrency is set using the [`innodb_thread_concurrency`](https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_thread_concurrency) parameter. This defines the maximum number of threads permitted inside InnoDB.

Assume, `innodb_thread_concurrency` is set to 1 (for ease of explaining). When two query from different transactions tries to enter innodb for execution, only one is permitted and the other is put to sleep for sometime.

How long does it sleep? The duration is controlled by the [`innodb_thread_sleep_delay`](https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_thread_sleep_delay) parameter, which defaults to `10ms`. If Query-1 takes more time to execute, Query-2's execution is delayed by sleeping which indirectly affects the response time of the query.

Analyzing the time a query spends waiting to enter InnoDB can provide valuable insights into its execution. This helps determine whether the query's slowness is due to its own complexity or the concurrency limits imposed by InnoDB.

## Using eBPF to Analyze InnoDB Sleep Time

To analyze the sleep time incurred due to InnoDB concurrency limits, we can use eBPF to trace the relevant functions in the MySQL server process.

The function responsible for putting threads to sleep when they cannot enter InnoDB is `srv_conc_enter_innodb()` under `storage/innobase/srv/srv0conc.cc`. Measuring the entry and exit time of this method will give us visibility into the sleep duration.

```c :no-collapsed-lines title="innodb_concurrency_sleep_time.bpf.c"
SEC("uprobe/_Z21srv_conc_enter_innodbP14row_prebuilt_t")
int uprobe_srv_conc_enter_innodb(struct pt_regs *ctx) {
    __u32 tid = bpf_get_current_pid_tgid();

    __u64 current_time = bpf_ktime_get_ns();
    bpf_map_update_elem(&tid_vs_conc_time, &current_time, BPF_ANY)

    return 0;
}

SEC("uretprobe/_Z21srv_conc_enter_innodbP14row_prebuilt_t")
int uretprobe_srv_conc_enter_innodb(struct pt_regs *ctx) {
    __u32 tid = bpf_get_current_pid_tgid();

    __u64 *start_time = bpf_map_lookup_elem(&tid_vs_conc_time, &tid);
    if (start_time) {
        __u64 end_time = bpf_ktime_get_ns();
        __u64 sleep_duration = end_time - *start_time;

        bpf_map_delete_elem(&tid_vs_conc_time, &tid);

        // Store or process the sleep_duration as needed.
        // For now, we just print it.
        bpf_printk("Thread %d slept for %llu ns\n", tid, sleep_duration);
    }

    return 0;
}
```

The above eBPF program attaches uprobes to the entry and return of the `srv_conc_enter_innodb` function. It records the time when a thread attempts to enter InnoDB and calculates the sleep duration when it exits. I'll cover on how to attach uprobes in a different post.

Combining this sleep time data with query execution metrics can help identify if a query's performance issues are due to InnoDB concurrency limits or other factors.

::: tip Raw execution time = Total execution time - InnoDB concurrency sleep time - Lock wait time
:::

> **Note:** The above code is a simplified example. In a production scenario, you would need to handle more complexities, such as managing the storage of sleep durations and correlating them with specific queries.

Thank you for reading! See you in next post.
