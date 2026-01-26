"use client";

import { useState } from "react";
import { loginAdmin } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleAlert, LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)

    if (!password) {
      setError("Password is required");
      setIsSubmitting(false);
      return;
    }
    const res = await loginAdmin(password);

    
    
    if (res.success) {
      window.location.href = "/admin";
    } else {
      setError(res.error || "Login failed");
      setIsSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-left">Administrator Access</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-destructive font-extrabold flex flex-row gap-1 items-center w-full truncate">
              <CircleAlert className="size-4" />
              {error}
            </p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="size-5 animate-spin" /> : "Sign In"}</Button>
        </form>
      </div>
    </div>
  );
}