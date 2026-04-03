"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase">Sign In</h1>
          <p className="mt-2 text-sm tracking-wide text-brand-gray">
            Welcome back to your curated closet.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-none border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border-brand-black text-brand-black focus:ring-brand-black"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs tracking-widest text-brand-gray uppercase">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="text-xs tracking-widest text-brand-gray underline uppercase hover:text-brand-black">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </div>
        </form>

        <p className="text-center text-xs tracking-widest text-brand-gray uppercase">
          Not a member?{" "}
          <Link href="/register" className="font-bold tracking-widest text-brand-black hover:underline uppercase">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
