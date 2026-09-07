"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCrmContentApi } from "@/lib/api";

type CrmSection = "privacyPolicy" | "termsOfService" | "helpCenter";

interface CrmViewerProps {
  section: CrmSection;
  title: string;
}

export function CrmViewer({ section, title }: CrmViewerProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const normalizeSection = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      const parts = [val.general, val.passengers, val.drivers].filter(
        (p) => p && typeof p === "string" && p.trim() !== ""
      );
      if (parts.length === 0) return "";
      return Array.from(new Set(parts)).join("<br/><br/>");
    }
    return "";
  };

  useEffect(() => {
    getCrmContentApi().then((res) => {
      if (res.success && res.data) {
        setContent(normalizeSection(res.data[section]));
      }
      setLoading(false);
    });
  }, [section]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-16">
      {/* Brand Logo Header */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
        <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image
            src="/desklogo.png"
            alt="FIKI Transit Logo"
            width={180}
            height={50}
            className="h-10 w-auto object-contain md:h-12"
            priority
          />
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-[#0b2b58] transition-colors md:text-sm"
        >
          ← Return to Home
        </Link>
      </div>

      <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#0b2b58] md:text-4xl">{title}</h1>

      {/* Content Container */}
      <div className="rounded-2xl border border-[#e1e5ea] bg-white p-6 md:p-10 shadow-sm min-h-[400px] w-full overflow-hidden">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ) : (
          <div 
            className="prose prose-slate max-w-none prose-headings:text-[#0b2b58] prose-a:text-[#173d76] prose-p:break-words prose-p:whitespace-pre-wrap break-words w-full overflow-hidden text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content || "<p>No content available for this section.</p>" }}
          />
        )}
      </div>
    </div>
  );
}
