"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { status } = useSession();
  const router = useRouter();

  // 🚀 Inline redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OWNER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      setSuccess("🎉 Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 sm:px-6">
      <form
        onSubmit={handleRegister}
        className="p-6 sm:p-8 w-full max-w-sm sm:max-w-md border rounded-2xl shadow-xl bg-white space-y-5"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800">
          Create an Account 🚀
        </h2>
        <p className="text-center text-gray-500 text-sm sm:text-base">
          Join us and start managing your events
        </p>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-700 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-700 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-700"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="OWNER">🎤 Event Owner</option>
            <option value="STAFF">👨‍💼 Staff</option>
            <option value="ADMIN">🛡️ Admin</option>
          </select>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center font-medium">
            {success}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full sm:w-auto sm:min-w-40 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
        >
          Register
        </button>

        {/* Extra */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}


