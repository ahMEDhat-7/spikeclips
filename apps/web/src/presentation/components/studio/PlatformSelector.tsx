"use client";

import { Platform, PLATFORMS } from "@/domain/entities/platform";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Youtube, Instagram, Music2, Check } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Youtube,
  Instagram,
  Music2,
};

interface PlatformSelectorProps {
  selected: Platform | null;
  onSelect: (platform: Platform) => void;
}

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold">Choose Platform</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {PLATFORMS.map((p) => {
          const Icon = ICONS[p.icon] ?? Music2;
          const isSelected = selected?.id === p.id;

          return (
            <Card
              key={p.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => onSelect(p)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(p);
                }
              }}
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in fade-in zoom-in duration-200">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {p.aspectRatio}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-mono">
                    max {p.maxDuration}s
                  </Badge>
                </div>

                {isSelected && (
                  <p className="text-[11px] text-primary font-medium">
                    This will crop your video to {p.aspectRatio}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
