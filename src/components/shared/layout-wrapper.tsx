"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSplash = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isSplash && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isSplash && <Footer />}
    </>
  );
}
