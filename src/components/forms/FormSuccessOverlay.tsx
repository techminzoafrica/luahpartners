"use client";

import { type CSSProperties, useEffect, useId } from "react";

export type FormSuccessOverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  caption: string;
};

type ConfettiPiece =
  | {
      kind: "rect";
      w: number;
      h: number;
      rx: number;
      color: string;
      tx: number;
      ty: number;
      rot: number;
    }
  | {
      kind: "circle";
      r: number;
      color: string;
      tx: number;
      ty: number;
      rot: number;
    };

const confettiPieces: ConfettiPiece[] = [
  { kind: "rect", w: 9, h: 4, rx: 1.5, color: "#B08D4F", tx: -36, ty: -42, rot: -28 },
  { kind: "circle", r: 3.5, color: "#10B981", tx: 6, ty: -52, rot: 0 },
  { kind: "rect", w: 10, h: 4, rx: 1.5, color: "#F59E0B", tx: 40, ty: -34, rot: 35 },
  { kind: "circle", r: 3, color: "#0F2137", tx: 54, ty: -10, rot: 0 },
  { kind: "rect", w: 9, h: 4, rx: 1.5, color: "#34D399", tx: 48, ty: 20, rot: -24 },
  { kind: "rect", w: 6, h: 6, rx: 1, color: "#B08D4F", tx: 34, ty: 44, rot: 45 },
  { kind: "rect", w: 8, h: 3.5, rx: 1.5, color: "#0F2137", tx: 4, ty: 52, rot: 16 },
  { kind: "circle", r: 3.5, color: "#10B981", tx: -26, ty: 46, rot: 0 },
  { kind: "rect", w: 9, h: 4, rx: 1.5, color: "#F59E0B", tx: -48, ty: 24, rot: 40 },
  { kind: "circle", r: 3, color: "#B08D4F", tx: -54, ty: -4, rot: 0 },
  { kind: "rect", w: 8, h: 3.5, rx: 1.5, color: "#34D399", tx: -46, ty: -24, rot: -42 },
  { kind: "circle", r: 2.5, color: "#0F2137", tx: -16, ty: -48, rot: 0 },
  { kind: "circle", r: 2.5, color: "#34D399", tx: 26, ty: -48, rot: 0 },
  { kind: "circle", r: 2.5, color: "#F59E0B", tx: 46, ty: 36, rot: 0 },
];

function ConfettiCheckIcon() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
      className="mx-auto overflow-visible"
    >
      {confettiPieces.map((piece, index) => {
        const style = {
          "--tx": `${piece.tx}px`,
          "--ty": `${piece.ty}px`,
          "--rot": `${piece.rot}deg`,
        } as CSSProperties;

        if (piece.kind === "circle") {
          return (
            <circle
              key={index}
              cx="70"
              cy="70"
              r={piece.r}
              fill={piece.color}
              className="luah-confetti-piece"
              style={style}
            />
          );
        }

        return (
          <rect
            key={index}
            x={70 - piece.w / 2}
            y={70 - piece.h / 2}
            width={piece.w}
            height={piece.h}
            rx={piece.rx}
            fill={piece.color}
            className="luah-confetti-piece"
            style={style}
          />
        );
      })}

      <g className="luah-check-pop">
        <circle cx="70" cy="70" r="36" fill="#ECFDF5" />
        <circle cx="70" cy="70" r="28" fill="#10B981" />
        <path
          d="M58 70.5L66.5 79L83 62.5"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="luah-check-draw"
        />
      </g>
    </svg>
  );
}

export function FormSuccessOverlay({
  open,
  onClose,
  title,
  caption,
}: FormSuccessOverlayProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="luah-overlay-enter absolute inset-0 z-10 flex items-center justify-center bg-brand-navy/40 p-5 sm:p-8"
    >
      <div
        role="status"
        aria-live="polite"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-[360px] border border-brand-sand bg-white px-7 py-9 text-center sm:px-8 sm:py-10"
      >
        <ConfettiCheckIcon />

        <h3
          id={titleId}
          className="mt-4 text-2xl font-bold leading-snug text-brand-navy"
        >
          {title}
        </h3>
        <p
          id={descriptionId}
          className="mt-2 text-sm leading-relaxed text-brand-muted"
        >
          {caption}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex min-h-11 items-center justify-center bg-brand-gold-light px-8 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          Done
        </button>
      </div>
    </div>
  );
}
