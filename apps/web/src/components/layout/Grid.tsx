import * as React from "react";
import { cn } from "@/lib/utils";

type Columns = 1 | 2 | 3 | 4 | 6 | 12;
type Gap = 2 | 3 | 4 | 6 | 8;

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: Columns;
  gap?: Gap;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
}

const columnStyles: Record<Columns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-12",
};

const gapStyles: Record<Gap, string> = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

const alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyStyles = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

function Grid({
  columns = 3,
  gap = 4,
  align = "stretch",
  justify = "start",
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        columnStyles[columns],
        gapStyles[gap],
        alignStyles[align],
        justifyStyles[justify],
        className
      )}
      {...props}
    />
  );
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: Columns;
  start?: number;
  end?: number;
}

function GridItem({
  span,
  start,
  end,
  className,
  ...props
}: GridItemProps) {
  const spanStyle = span
    ? { gridColumn: `span ${span} / span ${span}` }
    : {};

  const startEndStyle =
    start && end
      ? { gridColumn: `${start} / ${end}` }
      : start
        ? { gridColumn: `start ${start}` }
        : end
          ? { gridColumn: `end ${end}` }
          : {};

  return (
    <div
      className={cn(className)}
      style={{ ...spanStyle, ...startEndStyle }}
      {...props}
    />
  );
}

export { Grid, GridItem };
