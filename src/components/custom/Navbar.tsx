
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react'; // Using a generic building icon as a placeholder

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card text-card-foreground shadow-md px-4 py-3 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Placeholder Logo */}
          <div className="p-2 rounded-md bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <span className="self-center text-xl md:text-2xl font-semibold whitespace-nowrap text-primary">
            Seating Sage
          </span>
        </Link>
        <div className="text-sm md:text-base text-foreground/80 text-right">
          For GGSIPU and Affiliated Institutes
        </div>
      </div>
    </nav>
  );
}
