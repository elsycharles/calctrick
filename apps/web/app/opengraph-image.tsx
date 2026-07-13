import { ImageResponse } from "next/og";

export const alt = "CalcTrick turns 24 × 25 into the simpler calculation 6 × 100";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#F5F5F2",
        color: "#1C1C1E",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #D4D4D8",
          borderRadius: "36px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "58px 64px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
          <svg width="88" height="88" viewBox="0 0 128 128" fill="none">
            <path
              d="M94 27A47 47 0 1 0 94 101"
              stroke="#5753D9"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M64 64h36M87 51l13 13-13 13"
              stroke="#5753D9"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-1.5px" }}>
              CalcTrick
            </span>
            <span style={{ color: "#71717A", fontSize: "19px", fontWeight: 700, letterSpacing: "4px" }}>
              MENTAL MATH, SIMPLIFIED
            </span>
          </div>
        </div>

        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ color: "#71717A", fontSize: "22px", fontWeight: 700 }}>
              A difficult calculation
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "66px", fontWeight: 800, textDecoration: "line-through" }}>
              24 × 25
            </span>
          </div>
          <div
            style={{
              alignItems: "center",
              background: "#5753D9",
              borderRadius: "999px",
              display: "flex",
              height: "88px",
              justifyContent: "center",
              width: "88px",
            }}
          >
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <path
                d="M7 21h27M23 10l11 11-11 11"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ color: "#5753D9", fontSize: "22px", fontWeight: 700 }}>
              A simpler route
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "66px", fontWeight: 800 }}>
              6 × 100 = 600
            </span>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
