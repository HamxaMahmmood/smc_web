"use client";
import React, { useState, useRef, useEffect } from "react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  dir?: "ltr" | "rtl";
  clearAfterSelect?: boolean; // ← add this
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search or type...",
  allowCustom = true,
  dir = "ltr",
  clearAfterSelect = false, // ← add this
}: SearchableSelectProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (allowCustom) onChange(query);
        else {
          if (!options.includes(query)) setQuery(value);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value, options, allowCustom, onChange]);

const select = (opt: string) => {
  onChange(opt);
  setQuery(clearAfterSelect ? "" : opt);
  setOpen(false);
};

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) { setOpen(true); return; }
    if (e.key === "ArrowDown") { setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setHighlighted((h) => Math.max(h - 1, 0)); e.preventDefault(); }
    else if (e.key === "Enter") { if (filtered[highlighted]) select(filtered[highlighted]); e.preventDefault(); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        dir={dir}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); setHighlighted(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          width: "100%",
          padding: "9px 32px 9px 12px",
          border: "1.5px solid #c8d8f0",
          borderRadius: "7px",
          fontSize: "14px",
          outline: "none",
          background: "white",
          color: "#1a1a2e",
          textAlign: dir === "rtl" ? "right" : "left",
          boxSizing: "border-box",
        }}
      />
      <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af", fontSize: "12px" }}>▾</span>

      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          background: "white",
          border: "1.5px solid #c8d8f0",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 999,
          maxHeight: "220px",
          overflowY: "auto",
        }}>
          {filtered.map((opt, i) => (
            <div
              key={opt}
              onMouseDown={() => select(opt)}
              onMouseEnter={() => setHighlighted(i)}
              style={{
                padding: "9px 12px",
                fontSize: "13.5px",
                cursor: "pointer",
                background: i === highlighted ? "#e8f0fb" : "white",
                color: "#1a1a2e",
                borderBottom: i < filtered.length - 1 ? "1px solid #f0f4fa" : "none",
                textAlign: dir === "rtl" ? "right" : "left",
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}