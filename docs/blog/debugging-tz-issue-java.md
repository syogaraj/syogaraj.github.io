---
date: '2022-03-10'
lang: en-US
title: Debugging inconsistent timezone between Java & Linux
head:
    - - meta:
        - name: keywords
          content: java linux timezone timezone_difference debugging
---

# Debugging inconsistent timezone between Java & Linux

## Intro

Have you ever noticed that in some cases, Java will not take the time zone which is configured in a server? This has serious impacts if the server handles scheduling tasks and runs them periodically.

Before diving deep down, let’s understand what is a time zone?

> Time Zones are geographical world globe division of 15 degree each, starting at Greenwich, England. It’s a uniform standard time for legal, commercial and social purposes.

## The Issue

### Timezone difference between the system and java

While executing the below code, It will print the system time along with the timezone. I’ve added the output of the date command as well.
Java code to print the current date using `new Date()`

<CaptionedImage src="/images/blog/debugging-tz-issue-java/example-java-code.png" caption="Example code"></CaptionedImage>

<CaptionedImage src="/images/blog/debugging-tz-issue-java/example-code-output.png" caption="Output"></CaptionedImage>

<br/>

Even though the system timezone is configured as `PST`, java prints the timezone as `GMT`.

## Quick fix

1. Set `user.timezonein` the command line as `-Duser.timezone=America/Los_Angeles`
2. Set the environmental variable `TZ` to provide the timezone.

The above solutions will work, but to understand and fix it once for all, read further for the [actual fix](#actual-fix). (All required source code links are embedded in the method names)

<!-- <br/>

---

<br/> -->

## Detailed Explanation: The Why?

### Backtracking `toString()` method of `Date` class

In the example java code, we call `System.out.println` of `new Date()`. We know that java calls an object’s `.toString()` method internally to provide the string representation of an object. Let’s take a look at the `toString` method of the [Date class](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/java/util/Date.java#l999) in java.

![toString method of date class](/images/blog/debugging-tz-issue-java/date-class-tostring.png)

The timezone on Line:16is set by calling the `date.getZone()`. The variable date is initialized by calling the `normalize()` method.

![BaseCalendar.Date normalize method](/images/blog/debugging-tz-issue-java/normalize_method.png)

The timezone in `normalize` is set by calling the `TimeZone.getDefaultRef()` in `TimeZone.java` which then calls `setDefaultZone()` to get the system timezone.

![getDefaultRef](/images/blog/debugging-tz-issue-java/getDefaultRef.png)

![setDefaultZone method](/images/blog/debugging-tz-issue-java/setDefaultZone.png)

Now, let's break up and understand what the `setDefaultZone()` does.

1. It checks for the zone by checking the `user.timezone` property (which we didn’t set via the command line).
2. If the `user.timezone` property is `null`, it gets the `java.home` property and calls the `getSystemTimeZoneID()` which is a native method.
3. Any `NULL` values will set the timezone to default GMT. (So, this is why the timezone is set to GMT!)

![Java native method to get the system timezone](/images/blog/debugging-tz-issue-java/jni_call.png)

Ignoring the unwanted details, let’s focus on what the `findJavaTZ_md()` does.

![findJavaTZ_md method](/images/blog/debugging-tz-issue-java/findJavaTZ_md.png)

Now, we can understand why the quick search solutions mentioned to set values for `user.timezone` and `TZ`! In our case, we didn’t set the TZ environmental variable which means `TZ = NULL`.

It calls `getPlatformTimeZoneID()` if `TZ` is `NULL`. (We’re about to reach a conclusion in the next step! Hang on..)

![getPlatFormTimeZoneID method](/images/blog/debugging-tz-issue-java/getPlatFormTimeZoneID.png)

As the comment says, it will check for `/etc/timezone` file which contains the system timezone information. I checked in my Ubuntu machine for the file and it's straightforward.

![/etc/timezone example](/images/blog/debugging-tz-issue-java/timezone_cat.png)

If the file is not present, it checks `/etc/localtime` to obtain the timezone.

![lstat usage](/images/blog/debugging-tz-issue-java/lstat_usage.png)

Here’s what happens in the above code.

1. Get the file status of `/etc/localtime` using [lstat](https://linux.die.net/man/2/lstat64)
2. Check whether it's a symlink and read the symlink to obtain the timezone.

For `lstat` to work as expected, it's required to have the executable `x` permission on the file (as stated in the manpage of lstat). In my case, the `/etc/localtime` file doesn’t have the executable permission set. Hence, it returns `NULL` taking the default timezone of `GMT`.

<CaptionedImage src="/images/blog/debugging-tz-issue-java/localtime_without_exec.png" caption="/etc/localtime without executable permission"></CaptionedImage>

<br/>

---

<br/>

#### Obtaining Timezone via symlink

If the file has the required permission set, the output will be like the below one. After resolving the symlink, the zone info will be taken using the [getZoneName](https://hg.openjdk.java.net/jdk/jdk/file/f91999057a5a/src/java.base/unix/native/libjava/TimeZone_md.c#l81) method.

<CaptionedImage src="/images/blog/debugging-tz-issue-java/localtime_with_exec.png" caption="/etc/localtime with executable permission"></CaptionedImage>

<CaptionedImage src="/images/blog/debugging-tz-issue-java/get_zone_name.png" caption="getZoneName -- method"></CaptionedImage>

If the `/etc/localtimefile` is not a symlink, the `getPlatformTimeZoneID` method will try to open and read the file like `/etc/timezone`. As the last fallback, it will recursively iterate the `/usr/share/zoneinfodirectory` to find the timezone. When none of them works out, the timezone is set to `GMT` - the default!

---

### Actual Fix

I just had to create a symlink of `/etc/localtime` from `/usr/share/zoneinfo/America/Los_Angeles`.

<CaptionedImage src="/images/blog/debugging-tz-issue-java/symlink_creation.png" caption="Symlink creation for /etc/localtime"></CaptionedImage>

After setting the symlink, running the `DateExample` program yields the expected result.

### Final Output

![image showing expected result](/images/blog/debugging-tz-issue-java/final_output.png)

Thank you for reading! See you in the next post.
