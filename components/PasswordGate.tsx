"use client";
import { useState, useEffect } from "react";

const PASSWORD = process.env.NEXT_PUBLIC_NOTES_PASSWORD ?? "ehac2026";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("notes_auth") === "true");
  }, []);

  if (authed === null) return null;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 w-full max-w-sm">
          <div className="mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">EHAC Notes</h1>
            <p className="text-slate-400 text-sm mt-1">Enter password to access</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input === PASSWORD) {
                localStorage.setItem("notes_auth", "true");
                setAuthed(true);
              } else {
                setError(true);
                setShaking(true);
                setInput("");
                setTimeout(() => setShaking(false), 500);
              }
            }}
          >
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm mb-3 outline-none transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono ${
                error
                  ? "border-red-300 bg-red-50 focus:ring-red-400"
                  : "border-slate-200 bg-white"
              } ${shaking ? "animate-pulse" : ""}`}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
                <span>✕</span> Incorrect password
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Access Notes
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
