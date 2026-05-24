"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (!error) setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-handdrawn p-8 max-w-sm w-full text-center">
          <h1 className="font-hand text-3xl mb-4">查看邮箱 ✉️</h1>
          <p className="text-gray-600 dark:text-gray-300">
            已发送登录链接到 <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-400 mt-2">点击邮件中的链接完成登录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card-handdrawn p-8 max-w-sm w-full">
        <h1 className="font-hand text-4xl text-center mb-2">Mono</h1>
        <p className="text-center text-gray-500 mb-8">简单记账，轻松生活</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="输入邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-expense"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-expense text-white font-medium hover:bg-expense-dark transition disabled:opacity-50"
          >
            {loading ? "发送中..." : "发送登录链接"}
          </button>
        </form>
      </div>
    </div>
  );
}
