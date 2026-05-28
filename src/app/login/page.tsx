"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-paper">
        <div className="max-w-sm w-full text-center animate-fade-up">
          {/* Checkmark sketch */}
          <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#1E8449"
                strokeWidth="2"
                strokeDasharray="4 3"
                filter="url(#sketchy)"
              />
              <path
                d="M14 24l7 7 13-14"
                stroke="#1E8449"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#sketchy)"
              />
            </svg>
          </div>
          <h1 className="text-title mb-2 text-ink">查看邮箱</h1>
          <p className="text-caption text-ink-faint leading-relaxed">
            已发送登录链接到
            <br />
            <span className="text-ink font-medium">{email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-paper">
      <div className="max-w-sm w-full animate-sketch-in">
        <form onSubmit={handleLogin} className="sketch-card p-6 space-y-4">
          <input
            type="email"
            placeholder="输入邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="sketch-input w-full px-4 py-3 text-body text-ink placeholder:text-ink-faint bg-paper-highlight"
          />
          <button
            type="submit"
            disabled={loading}
            className="sketch-button-accent w-full py-3 text-body font-medium disabled:opacity-40"
          >
            {loading ? "发送中..." : "发送登录链接"}
          </button>
          {error && (
            <p className="text-caption text-expense text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
