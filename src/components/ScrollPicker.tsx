"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface ScrollPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ROW = 40;
const VISIBLE = 5;
const PAD = 2;

export default function ScrollPicker({
  items,
  value,
  onChange,
  className = "",
}: ScrollPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [centerIdx, setCenterIdx] = useState(() =>
    Math.max(0, items.indexOf(value))
  );

  const scrollTo = useCallback((idx: number, smooth: boolean) => {
    ref.current?.scrollTo({
      top: idx * ROW,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const i = items.indexOf(value);
    if (i >= 0) {
      setCenterIdx(i);
      scrollTo(i, false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    const i = items.indexOf(value);
    const target = i >= 0 ? i : 0;
    setCenterIdx(target);
    scrollTo(target, false);
  }, [items]); // eslint-disable-line

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const i = Math.round(ref.current.scrollTop / ROW);
    setCenterIdx(Math.max(0, Math.min(i, items.length - 1)));

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!ref.current) return;
      const snapped = Math.round(ref.current.scrollTop / ROW);
      const c = Math.max(0, Math.min(snapped, items.length - 1));
      scrollTo(c, true);
      setCenterIdx(c);
      if (items[c] !== value) onChange(items[c]);
    }, 80);
  }, [items, value, onChange, scrollTo]);

  const colH = VISIBLE * ROW;

  return (
    <div
      className={className}
      style={{ height: colH, position: "relative", overflow: "hidden" }}
    >
      {/* Fixed highlight bar */}
      <div
        style={{
          position: "absolute",
          left: 4,
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
          height: ROW + 4,
          background: "var(--paper-highlight)",
          border: "1.5px solid var(--sketch-border)",
          borderRadius: 6,
          boxShadow: "1px 2px 0 rgba(44,36,22,0.06)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Scrollable list */}
      <div
        ref={ref}
        className="no-scrollbar"
        style={{
          height: "100%",
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
        }}
        onScroll={handleScroll}
      >
        {Array.from({ length: PAD }).map((_, i) => (
          <div key={`t${i}`} style={{ height: ROW }} />
        ))}

        {items.map((item, idx) => {
          const dist = Math.abs(idx - centerIdx);
          const opacity = dist <= 2 ? (dist === 0 ? 1 : dist === 1 ? 0.5 : 0.2) : 0;
          const fontSize = dist === 0 ? 18 : dist === 1 ? 15 : 13;
          const fontWeight = dist === 0 ? 600 : 400;
          return (
            <div
              key={item}
              className="flex items-center justify-center cursor-pointer select-none num"
              style={{
                height: ROW,
                fontSize,
                fontWeight,
                opacity,
                color: "var(--ink)",
                transition: "opacity 0.1s, font-size 0.1s",
              }}
              onClick={() => {
                scrollTo(idx, true);
                onChange(item);
              }}
            >
              {item}
            </div>
          );
        })}

        {Array.from({ length: PAD }).map((_, i) => (
          <div key={`b${i}`} style={{ height: ROW }} />
        ))}
      </div>
    </div>
  );
}
