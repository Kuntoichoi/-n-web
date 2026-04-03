"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Something went wrong");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase">Forgive Pattern</h1>
          <p className="mt-2 text-sm tracking-wide text-brand-gray">
            Enter your email to receive a password recovery link.
          </p>
        </div>
        
        {success ? (
          <div className="rounded-none border border-green-200 bg-green-50 p-6 text-center">
            <h3 className="text-sm font-medium text-green-800">Check your inbox</h3>
            <p className="mt-2 text-xs text-green-700">
              We've sent a password reset link to {email}.
            </p>
            <Link href="/login" className="mt-6 block text-xs underline font-medium text-brand-black uppercase tracking-widest hover:text-brand-gray">
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Send Recovery Email
              </Button>
            </div>
          </form>
        )}

        {!success && (
          <p className="text-center text-xs tracking-widest text-brand-gray uppercase">
            Remembered your password?{" "}
            <Link href="/login" className="font-bold tracking-widest text-brand-black hover:underline uppercase">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
