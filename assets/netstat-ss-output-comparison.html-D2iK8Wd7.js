import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{a,h as e,o as t}from"./app-dowPD55j.js";const n={};function h(l,s){return t(),a("div",null,s[0]||(s[0]=[e(`<p>Consider a web application serving on port 8080. Upon receiving a request, it will spawn a subprocess, execute something and returns the appropriate response.</p><p><code>netstat</code> and <code>ss</code>: Both network utility tools report the network statistics such as connections, receive/send queue, listen ports etc., <code>ss</code> has preceded <code>netstat</code> in terms of perf/usage and netstat remains the classic one.</p><p>To list down the TCP listen sockets along with process name, use <code>netstat -ltnp</code> and <code>ss -lntp</code> command.</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="netstat output" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">root@me:/#</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> netstat</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -lntp</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Active</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Internet</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> connections</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (only </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">servers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Proto</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Recv-Q</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Send-Q</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Local</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Address</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">           Foreign</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Address</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">         State</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">       PID/Program</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> name</span></span>
<span class="line highlighted"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">tcp6</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">       0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">      0</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :::8080</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                 :::</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">*</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                    LISTEN</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">      80/sh</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">tcp6</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">       0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">      0</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :::22</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                   :::</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">*</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                    LISTEN</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">      8/sshd:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/sbin/s</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="ss output" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">root@me:/#</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ss</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -lntp</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">State</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">              Recv-Q</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">             Send-Q</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                          Local</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Address:Port</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                            Peer</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Address:Port</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">             Process</span></span>
<span class="line highlighted"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">LISTEN</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">             0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">                  100</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">                                         *</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">:8080</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">                                       *</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">:</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">*</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                 users:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">((</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">&quot;python3&quot;</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">,pid</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">=80,fd=37</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">,</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;sh&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,pid=81,fd=38))</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">LISTEN</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">             0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">                  128</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                                      [::]:22                                      [::]:*                 users:((</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;sshd&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">pid</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">8</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">,</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">fd</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">4</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">))</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Check the <code>Program name/Process</code> column in the outputs and notice the difference? <code>netstat</code> gives the program name as <code>sh</code>, whereas <code>ss</code> reports both the <code>python</code> and <code>sh</code> process. To understand this difference, lets dive into the source code of the respective tools.</p><p><strong>netstat</strong>: <a href="https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c" target="_blank" rel="noopener noreferrer">net-tools/netstat.c</a> , <strong>ss</strong>: <a href="https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c" target="_blank" rel="noopener noreferrer">iproute2/misc/ss.c</a></p><h2 id="how-ss-report-the-processes" tabindex="-1"><a class="header-anchor" href="#how-ss-report-the-processes"><span>How <code>ss</code> report the processes</span></a></h2><p>The main difference between netstat and ss is that, ss uses <code>netlink</code> to list the details which makes it efficient and performant when compared to netstat. If netlink is not available, it fallbacks to reading <code>/proc</code> to list the details.</p><p><code>ss</code> - <a href="https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L5938" target="_blank" rel="noopener noreferrer">main()</a> method parses the command-line arguments, sets relevant checks, flags etc., For the argument <code>-ltnp</code>, few flags and filters are set. If <code>-p</code> option is used, it invokes the <code>user_ent_hash_build()</code> method.</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" data-title="ss.c" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> case </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;p&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   show_processes</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">++</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   break</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> case </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;l&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   state_filter </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> &lt;&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> SS_LISTEN) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">|</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> &lt;&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> SS_CLOSE);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   break</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">...</span></span>
<span class="line highlighted"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (show_processes </span><span style="--shiki-light:#A626A4;--shiki-dark:#56B6C2;">||</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> show_threads </span><span style="--shiki-light:#A626A4;--shiki-dark:#56B6C2;">||</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> show_proc_ctx </span><span style="--shiki-light:#A626A4;--shiki-dark:#56B6C2;">||</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> show_sock_ctx)</span></span>
<span class="line highlighted"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  user_ent_hash_build</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="user-ent-hash-build-method" tabindex="-1"><a class="header-anchor" href="#user-ent-hash-build-method"><span><code>user_ent_hash_build()</code> method</span></a></h3><p>The <a href="https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L643" target="_blank" rel="noopener noreferrer"><code>user_ent_hash_build()</code></a> method,</p><ul><li>iterates the <code>/proc</code> directory,</li><li>frames the path <code>/proc/pid</code> and</li><li>calls the <code>user_ent_hash_build_task</code> method</li></ul><p>The <a href="https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L550" target="_blank" rel="noopener noreferrer"><code>user_ent_hash_build_task()</code></a> method,</p><ul><li>reads fd details from <code>/proc/pid/fd</code> (sample output given below)</li><li>checks for the pattern <code>&quot;socket:[&quot;</code> in the fd.</li><li>If matched, reads the <code>/proc/pid/stat</code>, gets the process name and calls <code>user_ent_add()</code> method.</li></ul><div class="language-shell" data-highlighter="shiki" data-ext="shell" data-title="/proc/pid/fd" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">root@me:/#</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ls</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -ot</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /proc/80/fd</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">lrwx------</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 64</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Feb</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 15</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 11:02</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 239</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> -&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;socket:[2327546]&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">lrwx------</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 64</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Feb</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 15</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 11:02</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 240</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> -&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;socket:[2304828]&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">lrwx------</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 64</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Feb</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 15</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 11:02</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 242</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> -&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;anon_inode:[eventpoll]&#39;</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">...</span></span></code></pre></div><div class="language-shell" data-highlighter="shiki" data-ext="shell" data-title="/proc/pid/stat" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">root@10:/#</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> cat</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /proc/80/stat</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">80</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (python3) S 1 7 1 0 -1 4194560 243752 0 142 0 6139 1405 0 0 20 0 249 0 23051636 14670950400 199771 18446744073709551615 104903437819904 104903437823688 140724731611008 0 0 0 0 2 16800973 0 0 0 17 2 0 0 0 0 0 104903437831416 104903437832216 104904499953664 140724731613800 140724731615315 140724731615315 140724731617249 0</span></span></code></pre></div><h4 id="user-ent-add-method" tabindex="-1"><a class="header-anchor" href="#user-ent-add-method"><span><code>user_ent_add()</code> method</span></a></h4><p>The <a href="https://github.com/iproute2/iproute2/blob/41710ace5e8fadff354f3dba67bf27ed3a3c5ae7/misc/ss.c#L522" target="_blank" rel="noopener noreferrer"><code>user_ent_add()</code></a> method calculates the hash based on the inode in the form of <strong>linked list</strong> (highlighted below). When printing the details, <code>user_ent_hash</code> is iterated and the <code>users</code> is printed with <strong>all</strong> the details available in the linked list.</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" data-title="user_ent_add method" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> user_ent_add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">unsigned</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> ino</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> char</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">task</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">     int</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> pid</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> tid</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> fd</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">     char</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">task_ctx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">     char</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">sock_ctx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> struct</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> user_ent </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">*</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">p, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">**</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pp;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> ...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> ...</span></span>
<span class="line highlighted"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> pp </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> &amp;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">user_ent_hash</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">user_ent_hashfn</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(ino)];</span></span>
<span class="line highlighted"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> p</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">-&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">next</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pp;</span></span>
<span class="line highlighted"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pp </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> p;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="how-netstat-report-the-processes" tabindex="-1"><a class="header-anchor" href="#how-netstat-report-the-processes"><span>How <code>netstat</code> report the processes</span></a></h2><p>Similar to <code>ss</code>, netstat starts off with the <a href="https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L2022" target="_blank" rel="noopener noreferrer">main()</a> function, parsing the arguments, setting relevant checks, flags etc., We passed the argument <code>-lntp</code> to netstat, meaning <code>flag_tcp</code> will be enabled in the program. If <code>flag_tcp</code> is enabled, it starts a <a href="https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L2304" target="_blank" rel="noopener noreferrer">for loop</a> and calls the <code>prg_cache_load()</code> method.</p><h3 id="prg-cache-load-method" tabindex="-1"><a class="header-anchor" href="#prg-cache-load-method"><span><code>prg_cache_load()</code> method</span></a></h3><p>The <a href="https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L398" target="_blank" rel="noopener noreferrer"><code>prg_cache_load()</code></a> method,</p><ul><li>iterates the <code>/proc</code> directory</li><li>checks for permissions, frame <code>/proc/pid</code> and</li><li>calls the <code>prg_cache_add</code> method</li></ul><h4 id="prg-cache-add-method" tabindex="-1"><a class="header-anchor" href="#prg-cache-add-method"><span><code>prg_cache_add()</code> method</span></a></h4><p>The <a href="https://github.com/ecki/net-tools/blob/9ee12437b677869ecd2e82415af891dd85ea96cc/netstat.c#L278" target="_blank" rel="noopener noreferrer"><code>prg_cache_add()</code></a> method,</p><ul><li>creates a hash for the inode</li><li>checks if the given inode is already present in the <code>prg_hash</code>. <code>prg_hash</code> is the data-structure in which the details are stored.</li><li>If present in the hash, it will not add the given inode.</li></ul><p>This is basically assuming that there can be <strong>only ONE process per port</strong>. The comment in the source code also mentions the same (highlighted below). So, this is why <code>netstat</code> is unable to report multiple process per port.</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" data-title="netstat.c" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> prg_cache_add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">unsigned</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> inode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> char</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> const</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> char</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">scon</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    unsigned</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> hi </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> PRG_HASHIT</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(inode);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    struct</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> prg_node </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">**</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pnp,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">*</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pn;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    prg_cache_loaded </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    for</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (pnp </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> prg_hash </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">+</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> hi; (pn </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> *</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pnp); pnp </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> &amp;</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">pn</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">-&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">next</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line highlighted"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">pn</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">-&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">inode</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> ==</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> inode) {</span></span>
<span class="line highlighted"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">            /* Some warning should be appropriate here</span></span>
<span class="line highlighted"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">            as we got multiple processes for one i-node */</span></span>
<span class="line highlighted"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion"><span>Conclusion</span></a></h2><p>The primary difference between netstat and ss is in how they handle process details:</p><ul><li>netstat uses a single entry per process, potentially missing additional processes associated with a port.</li><li>ss uses a linked list to store multiple processes per port, offering a more comprehensive view.</li></ul><p>Thank you for reading! See you in the next post.</p>`,35)]))}const r=i(n,[["render",h],["__file","netstat-ss-output-comparison.html.vue"]]),d=JSON.parse(`{"path":"/blog/netstat-ss-output-comparison.html","title":"Understanding TCP Listen Sockets: Netstat vs. ss","lang":"en-US","frontmatter":{"title":"Understanding TCP Listen Sockets: Netstat vs. ss","excerpt":"<p>When a listen port bound process spawns a child process, netstat reports only one process whereas ss reports both parent and child processes in their outputs respectively. Let's understand how this is handled internally in netstat and ss.</p>","date":"2025-02-15T00:00:00.000Z","lang":"en-US","category":["linux","network"],"tag":["netstat","ss","process","ports"],"description":"Consider a web application serving on port 8080. Upon receiving a request, it will spawn a subprocess, execute something and returns the appropriate response. netstat and ss: Bo...","head":[["meta",{"property":"og:url","content":"https://syogaraj.github.io/blog/netstat-ss-output-comparison.html"}],["meta",{"property":"og:site_name","content":"Yogaraj.S"}],["meta",{"property":"og:title","content":"Understanding TCP Listen Sockets: Netstat vs. ss"}],["meta",{"property":"og:description","content":"Consider a web application serving on port 8080. Upon receiving a request, it will spawn a subprocess, execute something and returns the appropriate response. netstat and ss: Bo..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-02-21T15:00:28.000Z"}],["meta",{"property":"article:tag","content":"netstat"}],["meta",{"property":"article:tag","content":"ss"}],["meta",{"property":"article:tag","content":"process"}],["meta",{"property":"article:tag","content":"ports"}],["meta",{"property":"article:published_time","content":"2025-02-15T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-02-21T15:00:28.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Understanding TCP Listen Sockets: Netstat vs. ss\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2025-02-15T00:00:00.000Z\\",\\"dateModified\\":\\"2025-02-21T15:00:28.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Yogaraj. S\\",\\"email\\":\\"yogarajsivaprakasam@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"How ss report the processes","slug":"how-ss-report-the-processes","link":"#how-ss-report-the-processes","children":[{"level":3,"title":"user_ent_hash_build() method","slug":"user-ent-hash-build-method","link":"#user-ent-hash-build-method","children":[]}]},{"level":2,"title":"How netstat report the processes","slug":"how-netstat-report-the-processes","link":"#how-netstat-report-the-processes","children":[{"level":3,"title":"prg_cache_load() method","slug":"prg-cache-load-method","link":"#prg-cache-load-method","children":[]}]},{"level":2,"title":"Conclusion","slug":"conclusion","link":"#conclusion","children":[]}],"git":{"createdTime":1739610965000,"updatedTime":1740150028000,"contributors":[{"name":"yogaraj.s","username":"yogaraj.s","email":"yogarajsivaprakasam@gmail.com","commits":2,"url":"https://github.com/yogaraj.s"}]},"readingTime":{"minutes":3.07,"words":920},"filePathRelative":"blog/netstat-ss-output-comparison.md","localizedDate":"February 15, 2025","autoDesc":true}`);export{r as comp,d as data};
