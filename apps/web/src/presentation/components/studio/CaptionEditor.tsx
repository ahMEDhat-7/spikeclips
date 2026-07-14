"use client";

import { Caption, CAPTION_FONTS, CAPTION_COLORS } from "@/domain/entities/caption";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Type } from "lucide-react";

interface CaptionEditorProps {
  captions: Caption[];
  onAdd: (caption?: Partial<Caption>) => void;
  onUpdate: (id: string, updates: Partial<Caption>) => void;
  onRemove: (id: string) => void;
}

export function CaptionEditor({ captions, onAdd, onUpdate, onRemove }: CaptionEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Captions</h2>
        </div>
        <Button size="sm" onClick={() => onAdd()}>
          <Plus className="h-4 w-4 mr-1" />
          Add Caption
        </Button>
      </div>

      {captions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Type className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No captions yet. Click &quot;Add Caption&quot; to start.
            </p>
          </CardContent>
        </Card>
      )}

      {captions.map((caption, index) => (
        <Card key={caption.id}>
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs">
                Caption {index + 1}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => onRemove(caption.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <Input
              value={caption.text}
              onChange={(e) => onUpdate(caption.id, { text: e.target.value })}
              placeholder="Enter caption text"
            />

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Preview</p>
              <p
                style={{
                  fontFamily: caption.font,
                  fontSize: `${Math.min(caption.size, 32)}px`,
                  color: caption.color,
                  textAlign: caption.position === "top" ? "left" : caption.position === "bottom" ? "right" : "center",
                }}
                className="leading-tight"
              >
                {caption.text || "Your caption here"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Font</label>
                <select
                  value={caption.font}
                  onChange={(e) => onUpdate(caption.id, { font: e.target.value as Caption["font"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  {CAPTION_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Size</label>
                <input
                  type="range"
                  min={16}
                  max={96}
                  value={caption.size}
                  onChange={(e) => onUpdate(caption.id, { size: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <span className="text-xs font-mono text-muted-foreground">{caption.size}px</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Color</label>
              <div className="flex gap-1.5">
                {CAPTION_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`h-6 w-6 rounded-full border-2 transition-all ${
                      caption.color === color
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdate(caption.id, { color })}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Position</label>
                <select
                  value={caption.position}
                  onChange={(e) => onUpdate(caption.id, { position: e.target.value as Caption["position"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Animation</label>
                <select
                  value={caption.animation}
                  onChange={(e) => onUpdate(caption.id, { animation: e.target.value as Caption["animation"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  <option value="pop">Pop</option>
                  <option value="slide">Slide</option>
                  <option value="fade">Fade</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
