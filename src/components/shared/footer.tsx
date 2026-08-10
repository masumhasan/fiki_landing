import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { CONTAINER_MAX_WIDTH } from "@/components/ui/custom/page-wrapper";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Our Service Area', href: '/service-area' },
  { name: 'Request A Ride', href: '/request-ride' },
  { name: 'Job Application Form', href: '/job-application' },
  { name: 'BID', href: '/bid' },
];

export default function Footer() {
  return (
    <footer className="bg-muted/30 w-full mt-auto pt-16 pb-8 border-t border-border/50">
      <div className={`container mx-auto ${CONTAINER_MAX_WIDTH} px-4 md:px-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-12 items-center">
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center md:items-start justify-center">
            <Link href="/">
              <Image src="/desklogo.png" alt="Fiki Transit Logo" width={180} height={50} className="object-contain" priority />
            </Link>
          </div>

          {/* Column 2: Information */}
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <h4 className="text-secondary font-bold text-sm tracking-wider uppercase mb-1">
              Information
            </h4>
            <div className="flex flex-col space-y-3">
              <a href="tel:6087079076" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 text-sm font-medium text-secondary hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                (608) 707-9076
              </a>
              <a href="mailto:reservations@fikitransit.com" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 text-sm font-medium text-secondary hover:text-primary transition-colors">
                <Mail className="w-5 h-5 text-primary" />
                reservations@fikitransit.com
              </a>
            </div>
          </div>

          {/* Column 3: Office Hours */}
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <h4 className="text-secondary font-bold text-sm tracking-wider uppercase mb-1">
              Office Hours
            </h4>
            <div className="flex flex-col space-y-3">
              <p className="text-sm font-medium text-secondary">
                Monday-Friday 08:00AM-05:00 PM
              </p>
              <p className="text-sm font-medium text-secondary">
                Saturday-Sunday Closed
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border mb-8" />

        {/* Navigation & Copyright */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <nav className="flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-4">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors hover:text-primary ${idx === 0 ? "text-primary" : "text-secondary"}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <p className="text-xs font-semibold text-secondary">
            © 2024, Fiki Transit. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
