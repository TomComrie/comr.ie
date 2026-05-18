import Sidebar from "./Sidebar";
import Search from "./Search";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-8 py-3 flex items-center gap-4">
          <Search />
        </header>
        <main className="flex-1 px-8 py-8">
          <div className="max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
