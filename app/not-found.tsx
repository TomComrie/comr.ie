import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-200 mb-3">404</h1>
        <p className="text-slate-500 mb-5 text-sm">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-teal-600 hover:text-teal-700 text-sm font-medium hover:underline"
        >
          ← Back to notes
        </Link>
      </div>
    </div>
  );
}
