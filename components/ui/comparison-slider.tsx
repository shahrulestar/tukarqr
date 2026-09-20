"use client";

import { DragDropVerticalIcon, Icon } from "@/components/ui/icon";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  defaultPosition?: number;
  className?: string;
}

export function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  defaultPosition = 50,
  className,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const afterImgRef = useRef<HTMLImageElement>(null);
  const beforeImgRef = useRef<HTMLImageElement>(null);
  const isReady = beforeLoaded && afterLoaded;

  useEffect(() => {
    setBeforeLoaded(false);
    setAfterLoaded(false);
  }, [beforeSrc, afterSrc]);

  useEffect(() => {
    if (afterImgRef.current?.complete) setAfterLoaded(true);
    if (beforeImgRef.current?.complete) setBeforeLoaded(true);
  }, [beforeSrc, afterSrc]);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition(Math.round((x / rect.width) * 100));
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    function onPointerMove(e: PointerEvent) {
      updateFromClientX(e.clientX);
    }

    function onPointerUp() {
      setIsDragging(false);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, updateFromClientX]);

  function handleContainerPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!isReady || e.button !== 0) return;
    setIsDragging(true);
    updateFromClientX(e.clientX);
  }

  return (
    <Card className={cn("gap-0 py-0", className)} size="sm">
      <CardContent className="p-0">
        <div
          ref={containerRef}
          role="img"
          aria-label={`${beforeAlt}. ${afterAlt}. Seret untuk bandingkan.`}
          aria-busy={!isReady}
          className={cn(
            "relative w-full touch-none select-none overflow-hidden rounded-xl bg-muted aspect-square",
            isReady && isDragging && "cursor-ew-resize"
          )}
          onPointerDown={handleContainerPointerDown}
          onContextMenu={(e) => e.preventDefault()}
        >
          {!isReady && (
            <Skeleton className="absolute inset-0 size-full rounded-xl bg-foreground/10" />
          )}

          <img
            ref={afterImgRef}
            src={afterSrc}
            alt=""
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onLoad={() => setAfterLoaded(true)}
            onError={() => setAfterLoaded(true)}
            className={cn(
              "block size-full object-contain object-center",
              !isReady && "invisible"
            )}
          />

          <div
            className={cn(
              "absolute inset-0 overflow-hidden",
              !isReady && "invisible"
            )}
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              ref={beforeImgRef}
              src={beforeSrc}
              alt=""
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onLoad={() => setBeforeLoaded(true)}
              onError={() => setBeforeLoaded(true)}
              className="size-full object-contain object-center"
            />
          </div>

          {isReady && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2"
                style={{ left: `${position}%` }}
                aria-hidden
              >
                <Separator
                  orientation="vertical"
                  decorative
                  className="h-full w-0.5 bg-[#E6007E] shadow-sm"
                />
              </div>

              <div
                className="pointer-events-none absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${position}%` }}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 border-[#E6007E] bg-[#E6007E] text-white shadow-md transition-transform",
                    isDragging && "scale-105"
                  )}
                >
                  <Icon
                    icon={DragDropVerticalIcon}
                    size={20}
                    className="text-white"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
