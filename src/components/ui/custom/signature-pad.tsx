"use client";

import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SignaturePadProps {
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export function SignaturePad({ className, value, onChange }: SignaturePadProps) {
  const padRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (value && padRef.current && padRef.current.isEmpty()) {
      try {
        padRef.current.fromDataURL(value);
      } catch (err: unknown) {
        // Safe catch block per rules
        console.error("Signature parse error:", err instanceof Error ? err.message : err);
      }
    }
  }, [value]);

  const clear = () => {
    if (padRef.current) {
      padRef.current.clear();
      onChange?.("");
    }
  };

  const handleEnd = () => {
    if (padRef.current) {
      const dataUrl = padRef.current.isEmpty() ? "" : padRef.current.toDataURL();
      onChange?.(dataUrl);
    }
  };

  return (
    <div className={cn("relative w-full h-32 border border-input rounded-md bg-transparent overflow-hidden touch-none", className)}>
      <SignatureCanvas
        ref={padRef}
        penColor="currentColor"
        canvasProps={{
          className: "w-full h-full absolute inset-0 cursor-crosshair",
        }}
        clearOnResize={false}
        onEnd={handleEnd}
      />

      {/* Clear Button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          type="button"
          onClick={clear}
          className="text-muted-foreground border border-input rounded-full size-5 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors bg-background"
          title="Clear Signature"
        >
          <X className="size-3" />
        </button>
      </div>

      {/* Signature line */}
      <div className="absolute inset-x-4 bottom-6 border-b border-dashed border-input pointer-events-none"></div>
    </div>
  );
}
