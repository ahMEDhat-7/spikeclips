"use client";

import { useMemo, useEffect, useId } from "react";
import { Caption, CAPTION_FONTS } from "@/domain/entities/caption";
import { FPS } from "@/lib/constants";

interface CaptionOverlayProps {
  caption: Caption;
  sceneElapsed: number;
  containerWidth: number;
  containerHeight: number;
}

function getPositionStyle(position: Caption["position"], containerHeight: number) {
  const padding = containerHeight * 0.08;
  switch (position) {
    case "top":
      return { top: padding, left: 0, right: 0 };
    case "bottom":
      return { bottom: padding, left: 0, right: 0 };
    default:
      return { top: "50%", left: 0, right: 0, transform: "translateY(-50%)" };
  }
}

function getTextStyleStyles(caption: Caption): React.CSSProperties {
  const { textStyle, strokeWidth, shadowRadius, color } = caption;
  const strokeColor = color === "#000000" ? "#FFFFFF" : "#000000";

  switch (textStyle) {
    case "outlined":
      return {
        WebkitTextStroke: `${strokeWidth || 2}px ${strokeColor}`,
        paintOrder: "stroke fill",
      };
    case "shadow":
      return {
        textShadow: `2px 2px 4px rgba(0,0,0,0.8), 0 0 ${shadowRadius || 8}px rgba(0,0,0,0.5)`,
      };
    case "neon":
      return {
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
      };
    default:
      return strokeWidth > 0
        ? { WebkitTextStroke: `${strokeWidth}px ${strokeColor}`, paintOrder: "stroke fill" }
        : shadowRadius > 0
        ? { textShadow: `0 0 ${shadowRadius}px rgba(0,0,0,0.5)` }
        : {};
  }
}

function getAnimationKeyframes(animation: Caption["animation"]): React.CSSProperties {
  switch (animation) {
    case "fade":
      return { animation: "captionFadeIn 0.3s ease-out forwards" };
    case "slide":
      return { animation: "captionSlideIn 0.3s ease-out forwards" };
    case "pop":
      return { animation: "captionPopIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards" };
    default:
      return {};
  }
}

export function CaptionOverlay({
  caption,
  sceneElapsed,
  containerWidth,
  containerHeight,
}: CaptionOverlayProps) {
  const styleId = useId();
  const captionStart = caption.startFrame / FPS;
  const captionEnd = caption.endFrame / FPS;

  const isVisible = sceneElapsed >= captionStart && sceneElapsed <= captionEnd;

  useEffect(() => {
    if (!isVisible) return;
    const style = document.createElement("style");
    style.id = `caption-anim-${styleId}`;
    style.textContent = `
      @keyframes captionFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes captionSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes captionPopIn {
        from { opacity: 0; transform: scale(0.5); }
        70% { opacity: 1; transform: scale(1.1); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [isVisible, styleId]);

  const positionStyle = useMemo(
    () => getPositionStyle(caption.position, containerHeight),
    [caption.position, containerHeight]
  );

  const textStyleStyles = useMemo(() => getTextStyleStyles(caption), [caption]);
  const animStyle = useMemo(() => getAnimationKeyframes(caption.animation), [caption.animation]);

  const fontSize = Math.min(caption.size * 0.5, containerWidth * 0.07);
  const fontFamily = CAPTION_FONTS[caption.font].cssFamily;

  const words = caption.text.split(" ");

  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        padding: `${containerHeight * 0.08}px ${containerWidth * 0.05}px`,
      }}
    >
      <div
        className="text-center leading-tight break-words"
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          color: caption.color,
          opacity: caption.opacity,
          textAlign: caption.textAlign,
          maxWidth: "100%",
          wordBreak: "break-word",
          backgroundColor: caption.backgroundEnabled ? caption.backgroundColor : "transparent",
          padding: caption.backgroundEnabled ? "4px 12px" : undefined,
          borderRadius: caption.backgroundEnabled ? "4px" : undefined,
          ...positionStyle,
          ...textStyleStyles,
          ...animStyle,
        }}
      >
        {caption.animation === "pop" && words.length > 1
          ? words.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  animation: `captionPopIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${i * 0.08}s forwards`,
                  opacity: 0,
                  marginRight: i < words.length - 1 ? "0.3em" : 0,
                }}
              >
                {word}
              </span>
            ))
          : caption.text}
      </div>
    </div>
  );
}
