"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div
          className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          EventEase
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Dashboard
          </Link>

          {!session ? (
            <>
              <Link
                href="/login"
                className="relative font-medium text-gray-700 hover:text-blue-600 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="relative font-medium text-gray-700 hover:text-blue-600 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
