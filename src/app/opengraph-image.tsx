import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "Kvitas: svečiai užsisako patys, o virtuvė užsakymą mato iškart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { setup, monthly } = siteConfig.pricing;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0c0b0a",
          color: "#f5f3ef",
          padding: "70px 80px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 34, height: 44, background: "#f5f3ef", borderBottom: "6px solid #e5583c" }} />
            <div style={{ fontSize: 40 }}>Kvitas</div>
          </div>
          <div style={{ marginTop: 56, fontSize: 68, lineHeight: 1.05, letterSpacing: -2 }}>
            Svečiai užsisako patys, o virtuvė užsakymą mato iškart.
          </div>
          <div style={{ marginTop: 32, fontSize: 30, color: "#a39f97" }}>
            {`${setup} € įdiegimas · ${monthly} € per mėnesį · priežiūra nemokama`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 330,
            background: "#fbf8f1",
            color: "#1d1d1f",
            padding: "28px 28px 36px",
            fontSize: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            transform: "rotate(2deg)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>VIRTUVĖ</span>
            <span>#024</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#5b564d" }}>
            <span>Staliukas 4</span>
            <span>19:42</span>
          </div>
          <div style={{ borderTop: "2px dashed #9a948a", margin: "16px 0" }} />
          <div style={{ display: "flex" }}>2× Jautienos mėsainis</div>
          <div style={{ display: "flex", marginLeft: 28, color: "#a8321c" }}>BE SVOGŪNŲ</div>
          <div style={{ display: "flex", marginTop: 6 }}>1× Šaltibarščiai</div>
        </div>
      </div>
    ),
    size,
  );
}
