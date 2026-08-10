import { ReactNode } from "react";

interface SectionCardProps {
  number: string;
  title: string;
  children: ReactNode;
}

export function SectionCard({ number, title, children }: SectionCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-xs border border-border flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-action text-action-foreground font-medium text-lg">
          {number}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
