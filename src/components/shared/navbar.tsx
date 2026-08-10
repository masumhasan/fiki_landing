'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Phone, Menu } from 'lucide-react'
import { CONTAINER_MAX_WIDTH } from '@/components/ui/custom/page-wrapper'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Our Service Area', href: '/service-area' },
  { name: 'Request A Ride', href: '/request-ride' },
  { name: 'Job Application Form', href: '/job-application' },
  { name: 'BID', href: '/bid' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header>
      <div className={`container mx-auto ${CONTAINER_MAX_WIDTH} flex h-20 items-center justify-between px-4 md:px-6`}>

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center">
            <Image src="/moblogo.png" alt="Fiki Transit Logo" width={200} height={50} className="object-contain" priority />
          </div>
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center">
            <Image src="/desklogo.png" alt="Fiki Transit Logo" width={90} height={28} className="object-contain" priority />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-md font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Phone Number (Desktop) & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <a href="tel:6087079076" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            <Phone className="h-4 w-4" />
            (608) 707-9076
          </a>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle mobile menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-87.5 flex flex-col p-6">
              <SheetHeader className="mb-2 border-b border-border pb-6 text-left flex items-start">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image src="/desklogo.png" alt="Fiki Transit Logo" width={160} height={45} className="object-contain" priority />
                </Link>
              </SheetHeader>

              <nav className="flex flex-col space-y-2 flex-1 mt-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "text-lg font-semibold transition-all hover:text-primary block py-3",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-border">
                <a
                  href="tel:6087079076"
                  className="flex items-center justify-center gap-2 w-full text-base font-bold text-primary bg-primary/10 py-4 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  (608) 707-9076
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
