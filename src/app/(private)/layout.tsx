import type { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  // Authentication check logic can go here. 
  // For example: if (!user) redirect('/login');
  
  return (
    <>
      {children}
    </>
  );
}
