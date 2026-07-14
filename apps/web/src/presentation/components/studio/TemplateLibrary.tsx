"use client";

import { useState } from "react";
import { EditTemplate, TemplateCategory } from "@/domain/entities/template";
import { TEMPLATES } from "@/domain/data/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Grid3x3, Columns, Eye, Repeat } from "lucide-react";

const CATEGORY_ICONS: Record<TemplateCategory, React.ElementType> = {
  kinetic: Sparkles,
  collage: Grid3x3,
  split: Columns,
  pov: Eye,
  loop: Repeat,
};

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  kinetic: "Kinetic",
  collage: "Collage",
  split: "Split",
  pov: "POV",
  loop: "Loop",
};

const CATEGORY_ICONS_MAP: Record<TemplateCategory | "all", React.ElementType> = {
  all: Sparkles,
  ...CATEGORY_ICONS,
};

interface TemplateLibraryProps {
  selectedTemplate: EditTemplate | null;
  onSelect: (template: EditTemplate | null) => void;
}

export function TemplateLibrary({ selectedTemplate, onSelect }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");

  const filteredTemplates =
    activeCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const categories: (TemplateCategory | "all")[] = [
    "all",
    "kinetic",
    "collage",
    "split",
    "pov",
    "loop",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Editing Templates</h2>
        <p className="text-sm text-muted-foreground">
          Choose a template to define the visual style and editing pattern for your clip.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS_MAP[cat];
          return (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="shrink-0 capitalize"
              onClick={() => setActiveCategory(cat)}
            >
              <Icon className="h-3.5 w-3.5 mr-1" />
              {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredTemplates.map((template) => {
          const Icon = CATEGORY_ICONS[template.category];
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => onSelect(isSelected ? null : template)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(isSelected ? null : template);
                }
              }}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {template.config.textAnimation.charAt(0).toUpperCase() + template.config.textAnimation.slice(1)} text
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {template.config.transitionIn.charAt(0).toUpperCase() + template.config.transitionIn.slice(1)} in
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {template.config.layout}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
