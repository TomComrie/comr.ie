import { Callout, CodeBlock, SectionHeading, SubHeading, T, Table } from "@/components/ContentComponents";

export default function PracticalLinuxBasicsContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="key">
        Treat this page as your worked-answer bank for Weeks 2 and 3. For every task, the safest exam structure is: state the goal, show the command or code, explain why it works, then show how you would verify it.
      </Callout>
      <p className="text-sm">
        Quick revision: <a href="/exam-cheatsheet#linux-cheatsheet" className="text-teal-600 hover:underline">Linux cheatsheet</a>.
      </p>

      <SectionHeading id="w2-file-apis">Week 2: File System API and Monitoring</SectionHeading>
      <p className="text-sm">
        The Week 2 practical tests three things together: understanding system calls, writing small C programs that use them correctly, and proving what the kernel did with <T>strace</T>.
      </p>

      <SubHeading id="w2-ex1">Exercise 1: write user input to output.txt</SubHeading>
      <p className="text-sm">
        You were asked to explain <T>open()</T>, <T>read()</T>, <T>write()</T>, and <T>close()</T>, then write a program that opens <T>output.txt</T> for writing, accepts a string from the user, writes it to the file, and closes the file.
      </p>
      <Table
        headers={["System call", "Purpose", "Exam wording"]}
        rows={[
          [<T key="a">open()</T>, "Opens a file and returns a file descriptor", "Creates a handle the process can use for later I/O"],
          [<T key="b">read()</T>, "Reads bytes from a file descriptor into memory", "Transfers data from kernel-managed file state into a user buffer"],
          [<T key="c">write()</T>, "Writes bytes from memory to a file descriptor", "Transfers data from the program buffer into the file"],
          [<T key="d">close()</T>, "Closes the descriptor and releases kernel resources", "Ends access to the open file and flushes state as needed"],
        ]}
      />
      <CodeBlock lang="ex1.c">
        {`#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(void) {
  char input[256];
  int fd = open("output.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);

  if (fd < 0) {
    perror("open");
    return 1;
  }

  printf("Enter some text: ");
  if (!fgets(input, sizeof(input), stdin)) {
    perror("fgets");
    close(fd);
    return 1;
  }

  if (write(fd, input, strlen(input)) < 0) {
    perror("write");
    close(fd);
    return 1;
  }

  close(fd);
  return 0;
}`}
      </CodeBlock>
      <CodeBlock lang="Compile and verify">
        {`gcc -Wall -Wextra -o ex1 ex1.c
./ex1
cat output.txt`}
      </CodeBlock>
      <Callout type="tip">
        Demonstration wording: "The program compiled without fatal errors, prompted for input, created output.txt, and the entered text was visible when inspected with cat output.txt."
      </Callout>

      <SubHeading id="w2-ex2">Exercise 2: read input.txt and explain the OFT</SubHeading>
      <p className="text-sm">
        The task is to open an existing file for reading, print it to the console, close it, and use <T>strace</T> to identify the system calls involved.
      </p>
      <CodeBlock lang="ex2.c">
        {`#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(void) {
  char buffer[128];
  ssize_t bytes_read;
  int fd = open("input.txt", O_RDONLY);

  if (fd < 0) {
    perror("open");
    return 1;
  }

  while ((bytes_read = read(fd, buffer, sizeof(buffer))) > 0) {
    if (write(STDOUT_FILENO, buffer, bytes_read) != bytes_read) {
      perror("write");
      close(fd);
      return 1;
    }
  }

  if (bytes_read < 0) {
    perror("read");
  }

  close(fd);
  return bytes_read < 0;
}`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`printf 'hello from input.txt\n' > input.txt
gcc -Wall -Wextra -o ex2 ex2.c
./ex2
strace ./ex2`}
      </CodeBlock>
      <p className="text-sm">
        What you expect to see in <T>strace</T>: opening of the file, repeated <T>read</T> calls, writes to standard output, and finally <T>close</T>. On many modern systems, the trace may show <T>openat()</T> rather than <T>open()</T> because the C library implements file opening through the newer interface.
      </p>
      <Callout type="key">
        Worked answer for "What is the Open File Table?": it is the kernel-side data structure that tracks open files. It stores information such as the current file offset, access mode, and a reference to the underlying file object or inode. The process only sees the small integer file descriptor; the OS maps that descriptor to the real open-file state.
      </Callout>

      <SubHeading id="w2-ex3">Exercise 3: copy source.txt to destination.txt</SubHeading>
      <CodeBlock lang="ex3.c">
        {`#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(void) {
  char buffer[256];
  ssize_t bytes_read;
  int src = open("source.txt", O_RDONLY);
  int dst = open("destination.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);

  if (src < 0 || dst < 0) {
    perror("open");
    return 1;
  }

  while ((bytes_read = read(src, buffer, sizeof(buffer))) > 0) {
    if (write(dst, buffer, bytes_read) != bytes_read) {
      perror("write");
      close(src);
      close(dst);
      return 1;
    }
  }

  if (bytes_read < 0) {
    perror("read");
  }

  close(src);
  close(dst);
  return bytes_read < 0;
}`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`printf 'copy me\n' > source.txt
gcc -Wall -Wextra -o ex3 ex3.c
./ex3
diff source.txt destination.txt
strace ./ex3`}
      </CodeBlock>
      <p className="text-sm">
        The worked explanation is: the program opens the source read-only, opens the destination write-only with create and truncate flags, repeatedly reads from one descriptor into a buffer, writes the same bytes to the other descriptor, and closes both descriptors at the end.
      </p>

      <SubHeading id="w2-ex4">Exercise 4: use stat on a file and directory</SubHeading>
      <CodeBlock lang="Commands">
        {`mkdir demo_dir
printf 'some text\n' > demo_file.txt
stat demo_dir
stat demo_file.txt`}
      </CodeBlock>
      <p className="text-sm">
        What you should say in an answer: <T>stat</T> prints file metadata such as size, inode number, permissions, number of hard links, owner, group, and access, modification, and change times. The command demonstrates that metadata exists separately from file content and is crucial in forensics.
      </p>

      <SubHeading id="w2-ex5">Exercise 5: write mystat.c</SubHeading>
      <p className="text-sm">
        You are implementing a very small version of <T>stat</T> by calling the <T>stat()</T> system interface from C and printing selected fields.
      </p>
      <CodeBlock lang="mystat.c">
        {`#include <stdio.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
  struct stat st;

  if (argc != 2) {
    fprintf(stderr, "Usage: %s <path>\n", argv[0]);
    return 1;
  }

  if (stat(argv[1], &st) != 0) {
    perror("stat");
    return 1;
  }

  printf("Size: %lld bytes\n", (long long) st.st_size);
  printf("Blocks: %lld\n", (long long) st.st_blocks);
  printf("Link count: %lld\n", (long long) st.st_nlink);
  return 0;
}`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`gcc -Wall -Wextra -o mystat mystat.c
./mystat demo_file.txt
strace ./mystat demo_file.txt`}
      </CodeBlock>
      <p className="text-sm">
        The answer point is that your program requests metadata from the OS rather than parsing the file manually. <T>strace</T> proves the metadata lookup happened.
      </p>

      <SubHeading id="w2-ex6">Exercise 6: write myls.c</SubHeading>
      <p className="text-sm">
        This exercise combines directory handling with metadata collection. The plain version prints filenames. The <T>-l</T> mode prints extra information using <T>stat()</T>.
      </p>
      <CodeBlock lang="myls.c">
        {`#include <dirent.h>
#include <pwd.h>
#include <grp.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>

static void print_mode(mode_t mode) {
  putchar(S_ISDIR(mode) ? 'd' : '-');
  putchar(mode & S_IRUSR ? 'r' : '-');
  putchar(mode & S_IWUSR ? 'w' : '-');
  putchar(mode & S_IXUSR ? 'x' : '-');
  putchar(mode & S_IRGRP ? 'r' : '-');
  putchar(mode & S_IWGRP ? 'w' : '-');
  putchar(mode & S_IXGRP ? 'x' : '-');
  putchar(mode & S_IROTH ? 'r' : '-');
  putchar(mode & S_IWOTH ? 'w' : '-');
  putchar(mode & S_IXOTH ? 'x' : '-');
}

int main(int argc, char *argv[]) {
  int long_mode = 0;
  const char *path = ".";
  DIR *dir;
  struct dirent *entry;

  if (argc >= 2 && strcmp(argv[1], "-l") == 0) {
    long_mode = 1;
    if (argc >= 3) path = argv[2];
  } else if (argc >= 2) {
    path = argv[1];
  }

  dir = opendir(path);
  if (!dir) {
    perror("opendir");
    return 1;
  }

  while ((entry = readdir(dir)) != NULL) {
    if (!long_mode) {
      printf("%s\n", entry->d_name);
    } else {
      char full_path[512];
      struct stat st;
      snprintf(full_path, sizeof(full_path), "%s/%s", path, entry->d_name);
      if (stat(full_path, &st) == 0) {
        print_mode(st.st_mode);
        printf(" %s %s %s\n",
          getpwuid(st.st_uid)->pw_name,
          getgrgid(st.st_gid)->gr_name,
          entry->d_name);
      }
    }
  }

  closedir(dir);
  return 0;
}`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`mkdir -p testdir/subdir
touch testdir/a.txt testdir/b.txt
gcc -Wall -Wextra -o myls myls.c
./myls testdir
./myls -l testdir`}
      </CodeBlock>

      <SectionHeading id="w3-permissions">Week 3: File Protection and Access Control</SectionHeading>
      <p className="text-sm">
        Week 3 is mostly command-line fluency. The strongest answers explain what the permission bits mean and then prove each change with <T>ls -l</T> plus a successful or failed action.
      </p>

      <SubHeading id="w3-ex1">Exercise 1: create example.txt and give owner rwx</SubHeading>
      <CodeBlock lang="Commands">
        {`touch ~/example.txt
ls -l ~/example.txt
chmod u+rwx ~/example.txt
ls -l ~/example.txt
echo 'hello' > ~/example.txt
cat ~/example.txt`}
      </CodeBlock>
      <p className="text-sm">
        Worked theory answer: the three main access types in Linux are read, write, and execute. These permissions are assigned separately to user, group, and others. For a regular file, read allows viewing contents, write allows modification, and execute allows the file to run as a program or script.
      </p>

      <SubHeading id="w3-ex2">Exercise 2: forbid any owner operation</SubHeading>
      <CodeBlock lang="Commands">
        {`chmod u-rwx ~/example.txt
ls -l ~/example.txt
cat ~/example.txt`}
      </CodeBlock>
      <p className="text-sm">
        The key verification is that the owner permission triplet becomes <T>---</T>. A failed read or write attempt demonstrates that the restriction is real.
      </p>

      <SubHeading id="w3-ex3">Exercise 3: directories and recursive permissions</SubHeading>
      <CodeBlock lang="Commands">
        {`mkdir ~/my_folder
ls -ld ~/my_folder
mkdir -p ~/my_folder/subfolder1/subfolder2
chmod -R ugo+rwX ~/my_folder
find ~/my_folder -maxdepth 2 -ls`}
      </CodeBlock>
      <p className="text-sm">
        Why this works: <T>mkdir -p</T> creates intermediate directories if they do not already exist. The recursive chmod applies permission changes to everything inside the tree. Using <T>X</T> instead of lowercase <T>x</T> is usually safer because it only adds execute where appropriate, especially on directories.
      </p>

      <SubHeading id="w3-ex4">Exercise 4: create myscript.sh, add user mike, change owner</SubHeading>
      <CodeBlock lang="myscript.sh">
        {`#!/bin/sh
echo "Hello, World!"`}
      </CodeBlock>
      <CodeBlock lang="Commands">
        {`chmod +x myscript.sh
./myscript.sh
sudo adduser mike
sudo chown mike:mike myscript.sh
ls -l myscript.sh`}
      </CodeBlock>
      <p className="text-sm">
        The worked explanation is: the shebang identifies the interpreter, <T>chmod +x</T> makes the script executable, <T>adduser</T> creates the new account, and <T>chown</T> changes file ownership to that user.
      </p>

      <SubHeading id="w3-ex5">Exercise 5: make readonlyfile.txt read-only</SubHeading>
      <CodeBlock lang="Commands">
        {`touch readonlyfile.txt
chmod a-w readonlyfile.txt
ls -l readonlyfile.txt
echo 'test' >> readonlyfile.txt
chmod u+w readonlyfile.txt
echo 'test' >> readonlyfile.txt
cat readonlyfile.txt`}
      </CodeBlock>
      <p className="text-sm">
        In a write-up, mention that <T>chmod a-w</T> removes the write bit from user, group, and others, making the file read-only for everyone.
      </p>

      <SubHeading id="w3-ex6">Exercise 6: create_and_restrict_10.sh</SubHeading>
      <CodeBlock lang="create_and_restrict_10.sh">
        {`#!/bin/sh
for i in $(seq 1 10); do
  touch "$HOME/file\${i}.txt"
done
chmod a-w "$HOME"/file*.txt`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`chmod +x create_and_restrict_10.sh
./create_and_restrict_10.sh
ls -l ~/file*.txt`}
      </CodeBlock>
      <p className="text-sm">
        The expected explanation is that the loop creates ten files and the final chmod removes write permission from all of them in one step.
      </p>

      <SubHeading id="w3-ex7">Exercise 7: create_files.sh with mixed permissions</SubHeading>
      <CodeBlock lang="create_files.sh">
        {`#!/bin/sh
for i in 1 2 3; do
  touch "$HOME/file_read_only_\${i}.txt"
  chmod a-w "$HOME/file_read_only_\${i}.txt"
done

for i in 4 5; do
  touch "$HOME/file_read_write_execute_\${i}.txt"
  chmod u+rwx "$HOME/file_read_write_execute_\${i}.txt"
done`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`chmod +x create_files.sh
./create_files.sh
ls -l ~/file_read_only_*.txt ~/file_read_write_execute_*.txt`}
      </CodeBlock>

      <SubHeading id="w3-ex8">Exercise 8: C program that writes a file then makes it read-only</SubHeading>
      <CodeBlock lang="ex8.c">
        {`#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

int main(void) {
  const char *text = "This file is now read-only.\n";
  int fd = open("c_created.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);

  if (fd < 0) {
    perror("open");
    return 1;
  }

  if (write(fd, text, strlen(text)) < 0) {
    perror("write");
    close(fd);
    return 1;
  }

  close(fd);

  if (chmod("c_created.txt", 0444) != 0) {
    perror("chmod");
    return 1;
  }

  return 0;
}`}
      </CodeBlock>
      <CodeBlock lang="Verification">
        {`gcc -Wall -Wextra -o ex8 ex8.c
./ex8
ls -l c_created.txt
strace ./ex8`}
      </CodeBlock>
      <Callout type="tip">
        The best exam answer style here is compact and explicit: "The program created the file, wrote content to it, changed mode to 0444, and verification with ls -l showed the file had become read-only. strace confirmed the open, write, close, and chmod operations."
      </Callout>

      <SectionHeading id="linux-probable-questions">Probable Exam Questions</SectionHeading>
      <p className="text-sm"><strong>Question:</strong> Explain the difference between a file descriptor and the Open File Table.</p>
      <p className="text-sm"><strong>Model answer:</strong> A file descriptor is the small integer used by a process to refer to an open file. The Open File Table is the operating system structure that stores the actual open-file state, such as current file offset, access mode, and a reference to the underlying inode or file object.</p>
      <p className="text-sm"><strong>Question:</strong> Why might <T>strace</T> show <T>openat()</T> rather than <T>open()</T>?</p>
      <p className="text-sm"><strong>Model answer:</strong> On modern Linux systems, the C library often implements file opening using the newer <T>openat()</T> interface internally, so tracing shows the underlying system call rather than the higher-level source-code function name.</p>
      <p className="text-sm"><strong>Question:</strong> What do read, write, and execute mean for directories?</p>
      <p className="text-sm"><strong>Model answer:</strong> Read allows listing directory contents, write allows creating or deleting entries within the directory, and execute allows traversal into the directory and access to entries if their names are known.</p>
      <p className="text-sm"><strong>Question:</strong> Why are <T>O_CREAT</T> and <T>O_TRUNC</T> used together in the file-writing exercises?</p>
      <p className="text-sm"><strong>Model answer:</strong> <T>O_CREAT</T> ensures the file is created if it does not already exist, while <T>O_TRUNC</T> clears any previous content if the file does exist. Together they ensure the output file starts in a known state.</p>
      <p className="text-sm"><strong>Question:</strong> Why is verification with <T>diff</T>, <T>cat</T>, or <T>ls -l</T> important in these practicals?</p>
      <p className="text-sm"><strong>Model answer:</strong> The commands prove the task outcome rather than merely showing the command syntax. <T>cat</T> proves content, <T>diff</T> proves copied files match exactly, and <T>ls -l</T> proves ownership or permission changes.</p>
      <p className="text-sm"><strong>Question:</strong> What fields from <T>struct stat</T> are most relevant in the Week 2 practical?</p>
      <p className="text-sm"><strong>Model answer:</strong> The key fields are <T>st_size</T> for file size, <T>st_blocks</T> for allocated blocks, and <T>st_nlink</T> for link count. These are the exact values requested by the lab for <T>mystat.c</T>.</p>
      <p className="text-sm"><strong>Question:</strong> Why might you prefer <T>chmod -R ugo+rwX</T> over <T>chmod -R 777</T> when explaining directory permissions?</p>
      <p className="text-sm"><strong>Model answer:</strong> The symbolic form shows which rights are being added and the uppercase <T>X</T> behaves more safely by only adding execute where appropriate, especially for directories, rather than forcing executable permission on every regular file.</p>
      <p className="text-sm"><strong>Question:</strong> Explain the difference between <T>chmod</T> and <T>chown</T>.</p>
      <p className="text-sm"><strong>Model answer:</strong> <T>chmod</T> changes permission bits such as read, write, and execute, while <T>chown</T> changes who owns the file. They control different parts of access control.</p>
      <p className="text-sm"><strong>Question:</strong> Why is <T>chmod 0444</T> a strong answer in the C permission-change exercise?</p>
      <p className="text-sm"><strong>Model answer:</strong> It expresses the exact resulting mode directly: read-only for owner, group, and others. It also shows you understand numeric permission notation rather than only symbolic forms.</p>

      <SectionHeading id="linux-common-mistakes">Common Mistakes and Lost Marks</SectionHeading>
      <Table
        headers={["Mistake", "Why marks are lost"]}
        rows={[
          ["Giving commands without explaining what they prove", "Practical questions usually expect verification, not just syntax"],
          ["Confusing file permissions with ownership", "chmod changes mode; chown changes owner"],
          ["Forgetting to close file descriptors in C examples", "Shows incomplete understanding of resource handling"],
          ["Using recursive execute bits carelessly", "Can indicate weak understanding of file vs directory semantics"],
          ["Saying strace proves source code logic", "It proves runtime system-call behavior, not every detail of program intent"],
          ["Omitting error handling in C examples", "Even basic checks like perror(open) show stronger systems-programming understanding"],
          ["Not distinguishing regular-file execute from directory execute", "This loses conceptual marks in permission questions"],
          ["Claiming ls alone proves write permission", "You need a successful or failed action to demonstrate practical effect"],
        ]}
      />
    </div>
  );
}
