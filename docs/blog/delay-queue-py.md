---
lang: en-US
title: DelayQueue in Python
date: "2022-01-21"
---

## Queue

> From [Wikipedia](<https://en.wikipedia.org/wiki/Queue_(abstract_data_type)>), a queue is a [collection](<https://en.wikipedia.org/wiki/Collection_(abstract_data_type)>) of entities that are maintained in a sequence and can be modified by the addition of entities at one end of the sequence and the removal of entities from the other end of the sequence. By convention, the end of the sequence at which elements are added is called the back, tail, or rear of the queue, and the end at which elements are removed is called the head or front of the queue, analogously to the words used when people line up to wait for goods or services.

### Queue in Python

Most of the programming languages offer this queue implementation as its core part as its essential in many use cases.

The [queue](https://docs.python.org/3/library/queue.html#module-queue) module in python offers,

1. FIFO queue (First In First Out, simply known as Queue)
2. [LIFO Queue](https://docs.python.org/3/library/queue.html#queue.LifoQueue) (Last In First Out)
3. [PriorityQueue](https://docs.python.org/3/library/queue.html#queue.PriorityQueue)
4. SimpleQueue (also known as Unbounded FIFO Queue)

Queues can be found in various implementations of frameworks where you need to achieve a thread-safe implementation. i.e., multiple threads can consume from a single queue without causing deadlocks or any race conditions.

```python
from queue import Queue as FifoQueuefifo_queue = FifoQueue()
fifo_queue.put("an item")
fifo_queue.get()  # returns "an item" from queue
```

## DelayQueue

DelayQueue is **a specialized Priority Queue that orders elements based on their delay time**. It means only elements whose time has expired can be taken from the queue. DelayQueue head contains the element that has expired/going to expire in the least time.

DelayQueue’s are useful when it comes to scheduling tasks. Scheduled tasks are bound to wait until the time has come for them to execute. An example of a scheduled task would be reading a transaction table for the previous day at 00:00 and providing some insights to a business.

The internal implementation of DelayQueue uses a heap, which will sort the elements based on the nearest time of execution. Programming language like Java comes with DelayQueue implementation.

### DelayQueue in Python

The queue library in python doesn’t speak about delay queue and the PyPI search shows that there is only one delay queue implementation which also mentions that the project is in the beta stage and has not been updated for almost 6+years. Though the code works, the `queue.get` will return immediately with an item from the queue or with an exception. It is up to the developer to handle these cases.

The general intuition of DelayQueue (at least mine) is that the queue.get will wait until the time has come for an item to be popped out of the queue. So, I decided to write the exact [implementation](https://github.com/syogaraj/delayedqueue) of the above and published it as a [python package](https://pypi.org/project/delayedqueue/). I believe this will be useful for many who are in search of such implementations in the future.

```python
"""
Usage for https://github.com/syogaraj/delayedqueue
"""

from delayedqueue import DelayedQueue
delay_queue = DelayedQueue()
delay_queue.put("an item", 30)

delay_queue.get()
# Waits for 30seconds before returning "an item". If any other item is added via another thread and
# if the delay precedes of that item, then that item will be returned first.

```

Thank you for reading! See you in the next post.
