"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EditTemplate,
  TemplateCategory,
  TemplateCategoryFilter,
  TEXT_ANIMATIONS,
  TRANSITIONS,
  LAYOUTS,
  TEXT_STYLES,
  TEMPLATE_CATEGORIES,
} from "@/domain/entities/template";
import { TEMPLATES } from "@/domain/data/templates";
import { Check, Sparkles, Sliders, Zap, ArrowRightLeft, LayoutGrid, Type } from "lucide-react";

interface TemplateLibraryProps {
  selectedTemplate: EditTemplate | null;
  onSelect: (template: EditTemplate | null) => void;
}

const CATEGORY_ICONS: Record<TemplateCategory, string> = {
  kinetic: "⚡",
  collage: "📸",
  split: "✂️",
  pov: "👁️",
  loop: "🔄",
};

function TemplatePreviewCard({ template }: { template: EditTemplate }) {
  const config = template.config;
  const hasLines = config.layout.includes("split");
  const hasGrid = config.layout === "grid";

  return (
    <div className="relative w-full aspect-[9/16] bg-gradient-to-b from-gray-800 to-gray-900 rounded overflow-hidden">
      {hasGrid && (
        <div className="absolute inset-2 grid grid-cols-2 gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700/50 rounded-sm" />
          ))}
        </div>
      )}
      {hasLines && !hasGrid && config.layout === "split-horizontal" && (
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
      )}
      {hasLines && !hasGrid && config.layout === "split-vertical" && (
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
      )}
      {config.overlayEffects?.includes("vignette") && (
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)"
        }} />
      )}
      {config.overlayEffects?.includes("pov-label") && (
        <div className="absolute top-2 left-0 right-0 text-center">
          <span className="inline-block px-1.5 py-0.5 bg-black/60 rounded text-white text-[7px] font-bold uppercase">
            POV:
          </span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 text-center">
        <span className="text-white text-[8px] font-bold drop-shadow-lg">
          {config.textStyle === "outlined" ? "TEXT" : config.textStyle === "neon" ? "GLOW" : "BOLD"}
        </span>
      </div>
      {config.textAnimation === "pop" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-primary/60 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
}

export function TemplateLibrary({
  selectedTemplate,
  onSelect,
}: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryFilter>("all");
  const [showCustomize, setShowCustomize] = useState(false);

  const filtered = activeCategory === "all"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelect = (template: EditTemplate) => {
    if (selectedTemplate?.id === template.id) {
      onSelect(null);
    } else {
      onSelect(template);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Templates</h2>
          <p className="text-[10px] text-muted-foreground">
            {selectedTemplate ? `Selected: ${selectedTemplate.name}` : "Choose a template style"}
          </p>
        </div>
        {selectedTemplate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomize(!showCustomize)}
            className="h-7 px-2 text-xs"
          >
            <Sliders className="h-3 w-3 mr-1" />
            {showCustomize ? "Hide" : "Customize"}
          </Button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {showCustomize && selectedTemplate && (
        <Card className="border-primary/30">
          <CardContent className="p-2.5 space-y-2">
            <div className="text-[10px] font-medium text-muted-foreground uppercase">
              Template Config
            </div>
            <div className="space-y-1.5">
              <div className="space-y-0.5">
                <label className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5" /> Text Animation
                </label>
                <div className="flex flex-wrap gap-0.5">
                  {TEXT_ANIMATIONS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() =>
                        onSelect({ ...selectedTemplate, config: { ...selectedTemplate.config, textAnimation: a.id } })
                      }
                      className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                        selectedTemplate.config.textAnimation === a.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-0.5">
                <label className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <ArrowRightLeft className="h-2.5 w-2.5" /> Transition In
                </label>
                <div className="flex flex-wrap gap-0.5">
                  {TRANSITIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() =>
                        onSelect({ ...selectedTemplate, config: { ...selectedTemplate.config, transitionIn: t.id } })
                      }
                      className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                        selectedTemplate.config.transitionIn === t.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-0.5">
                <label className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <LayoutGrid className="h-2.5 w-2.5" /> Layout
                </label>
                <div className="flex flex-wrap gap-0.5">
                  {LAYOUTS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() =>
                        onSelect({ ...selectedTemplate, config: { ...selectedTemplate.config, layout: l.id } })
                      }
                      className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                        selectedTemplate.config.layout === l.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-0.5">
                <label className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <Type className="h-2.5 w-2.5" /> Text Style
                </label>
                <div className="flex flex-wrap gap-0.5">
                  {TEXT_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        onSelect({ ...selectedTemplate, config: { ...selectedTemplate.config, textStyle: s.id } })
                      }
                      className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                        selectedTemplate.config.textStyle === s.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filtered.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? "border-primary ring-1 ring-primary/20"
                  : "hover:border-muted-foreground/30"
              }`}
              onClick={() => handleSelect(template)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(template);
                }
              }}
            >
              <div className="relative">
                <TemplatePreviewCard template={template} />
                {isSelected && (
                  <div className="absolute top-1 right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className="absolute top-1 left-1">
                  <span className="text-[8px] bg-black/60 text-white px-1 py-0.5 rounded">
                    {CATEGORY_ICONS[template.category]}
                  </span>
                </div>
              </div>
              <CardContent className="p-2 space-y-0.5">
                <p className="text-[11px] font-medium leading-tight truncate">{template.name}</p>
                <div className="flex flex-wrap gap-0.5">
                  <span className="text-[8px] px-1 py-0 rounded bg-muted text-muted-foreground">
                    {template.config.textAnimation}
                  </span>
                  <span className="text-[8px] px-1 py-0 rounded bg-muted text-muted-foreground">
                    {template.config.layout}
                  </span>
                  <span className="text-[8px] px-1 py-0 rounded bg-muted text-muted-foreground">
                    {template.config.textStyle}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTemplate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-2.5">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-medium">{selectedTemplate.name}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-2">
                  {selectedTemplate.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
