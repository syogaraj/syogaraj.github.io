---
date: "2022-06-19"
lang: en-US
title: ScheduledThreadPoolExecutor in Python
head:
  - - meta:
        - name: keywords
          content: python threadpool executor threadpoolexecutor scheduler
---

Similar to Java APIs provided in ScheduledThreadPoolExecutor, I’ve implemented the same in Python. Read further for a detailed explanation.

## Thread Pool

A thread pool is a design pattern in which multiple threads are maintained to perform the tasks submitted to it. Thread pools are used where multiple short-lived tasks need to be executed and also to increase the performance of the application.

### Benefits of using Thread Pool

Instead of maintaining a thread pool, we can also create a thread for each task as needed. The main benefit of using a thread pool is that we avoid the cost of creating and destroying the threads. From Wikipedia,

> 1. Creating too many threads wastes resources and costs time creating the unused threads.
> 2. Destroying too many threads requires more time later when creating them again.
> 3. Creating threads too slowly might result in poor client performance (long wait times).
> 4. Destroying threads too slowly may starve other processes of resources.

## ThreadPoolExecutor

A ThreadPoolExecutor is a kind of supervisor program using which the tasks are submitted to the thread pool. Each programming language has some kind of concurrency package where the thread pool executors are provided. For example, concurrency is provided by the `java.util.concurrent` package, whereas in Python, it’s provided by the `concurrent.futures` package.

When a task is submitted to a thread pool executor, a thread is assigned to execute the task and return the result. The number of threads in a thread pool is decided by the computational resource available in a computer.

## ScheduledThreadPoolExecutor

ScheduledThreadPoolExecutor is an executor service where the submitted tasks are executed with an initial delay and a periodic interval repeatedly.

ScheduledThreadPoolExecutor comes in handy when we need to run a particular task repeatedly at a specific interval. Example: Checking the replication of a component every 10 minutes and triggering a mail if there is slowness or failure.

The implementation of a ScheduledThreadPoolExecutor is simply done by extending the `ThreadPoolExecutor` and by maintaining a [delay queue](/blog/delay-queue-py.html) to provide the tasks based on the interval. Most languages provide the [ScheduledThreadPoolExecutor](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html) as a part of their concurrency package. Java provides the ScheduledThreadPoolExecutor in its concurrency package by default. Java provides two methods to execute the task periodically.

1. [scheduleAtFixedRate](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html#scheduleAtFixedRate-java.lang.Runnable-long-long-java.util.concurrent.TimeUnit-) — Creates and executes a periodic action that becomes enabled first after the given initial delay, and subsequently with the given period; that is executions will commence after `initialDelay` then `initialDelay+period`, then `initialDelay + 2 \* period`, and so on.
2. [scheduleWithFixedDelay](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html#scheduleWithFixedDelay-java.lang.Runnable-long-long-java.util.concurrent.TimeUnit-) — Creates and executes a periodic action that becomes enabled first after the given initial delay, and subsequently with the given delay between the termination of one execution and the commencement of the next.

### ScheduledThreadPoolExecutor in Python

Python provides two different modules, `sched` and `concurrent.futures` and it is in the hands of the user to implement the ScheduledThreadPoolExecutor. Though there are packages that provide scheduling in Python, there is no implementation as close to the one provided by Java. So, I’ve implemented the same with the APIs to closely resemble the ones in Java.

The Python package for ScheduledThreadPoolExecutor is published in [PyPI](https://pypi.org/project/scheduled-thread-pool-executor/) as well. You can install it using `pip install scheduled-thread-pool-executor` . It provides the three main methods `schedule, schedule_at_fixed_rate, schedule_at_fixed_delay` similar to the one in Java. I believe this will be useful for many who are in search of such implementations in the future.

```python
"""
Usage
"""

from scheduled_thread_pool_executor import ScheduledThreadPoolExecutor
scheduled_executor = ScheduledThreadPoolExecutor(max_workers=5)
scheduled_executor.schedule(task, 0)  # equals to schedule once, where task is a callable
scheduled_executor.schedule_at_fixed_rate(task, 0, 5)  # schedule immediately and run periodically for every 5 secs
scheduled_executor.schedule_at_fixed_delay(task, 5, 10)  # schedule after 5secs (initial delay) and run periodically for every 10secs
```

Thank you for reading! See you in the next post.
