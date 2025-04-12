
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  noContainer?: boolean;
}

const PageLayout = ({ children, className, noContainer = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn("flex-1 pt-24 pb-10", !noContainer && "container", className)}>
        {children}
      </main>
      <footer className="py-6 border-t bg-white dark:bg-mindmend-dark">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MindMend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
