import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const navigationLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function HomeHeader() {
  return (
    <header className="container-md min-h-16 flex items-center justify-between max-h-16">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={24}
          height={24}
          suppressHydrationWarning
        />
      </div>
      <div className="flex items-center gap-8">
        {navigationLinks.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button>Get Started</Button>
      </div>
    </header>
  );
}
