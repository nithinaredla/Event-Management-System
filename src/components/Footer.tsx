"use client";

import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 px-30 flex items-center justify-between">
      {/* Left side - Name */}
      <p className="text-lg font-semibold">Nithin Aredla</p>

      {/* Right side - Links */}
      <div className="flex space-x-6">
        <a
          href="https://github.com/nithinaredla"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:text-gray-300 text-lg"
        >
          <Github size={28} />
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/nithinaredla/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:text-gray-300 text-lg"
        >
          <Linkedin size={28} />
          <span>LinkedIn</span>
        </a>
      </div>
    </footer>
  );
}


