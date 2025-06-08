
"use client";

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card text-card-foreground shadow-top-md px-4 py-4 md:px-6">
      <div className="container mx-auto text-center md:flex md:justify-between md:items-center">
        <p className="text-sm text-foreground/80 mb-2 md:mb-0">
          Crafted with ❤️ by:
        </p>
        <div className="flex flex-col md:flex-row md:space-x-6 justify-center items-center">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <span className="text-sm font-medium">Dibyanshu Jha</span>
            <Link href="https://www.linkedin.com/in/dibyanshu-jha/" target="_blank" rel="noopener noreferrer" aria-label="Dibyanshu Jha LinkedIn">
              <Linkedin className="h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
            </Link>
            <Link href="https://github.com/Dibyanshujha9" target="_blank" rel="noopener noreferrer" aria-label="Dibyanshu Jha GitHub">
              <Github className="h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Hrittick Roy</span>
            <Link href="https://www.linkedin.com/in/hrittick-roy/" target="_blank" rel="noopener noreferrer" aria-label="Hrittick Roy LinkedIn">
              <Linkedin className="h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
            </Link>
            <Link href="https://github.com/quantam665" target="_blank" rel="noopener noreferrer" aria-label="Hrittick Roy GitHub">
              <Github className="h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
