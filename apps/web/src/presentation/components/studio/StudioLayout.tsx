"use client";

import { ReactNode } from "react";

interface StudioLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right?: ReactNode;
  bottom?: ReactNode;
  toolbar: ReactNode;
}

export function StudioLayout({ left, center, right, bottom, toolbar }: StudioLayoutProps) {
  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground">
      {toolbar}

      <div className="flex flex-1 overflow-hidden">
        <aside
          role="navigation"
          aria-label="Studio tools"
          className="w-14 shrink-0 border-r bg-background overflow-y-auto"
        >
          {left}
        </aside>

        <main role="main" className="flex-1 flex overflow-hidden min-w-0">
          <div className="flex-1 flex flex-col overflow-y-auto min-w-0 h-full">
            {center}
          </div>

          {right && (
            <aside
              role="complementary"
              aria-label="Properties"
              className="w-72 shrink-0 border-l bg-background overflow-y-auto p-3 hidden lg:block"
            >
              {right}
            </aside>
          )}
        </main>
      </div>

      {bottom && <div className="shrink-0 border-t bg-background">{bottom}</div>}
    </div>
  );
}
