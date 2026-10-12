import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "Stalas — QR užsakymų sistema restoranams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 85% 10%, rgba(139,92,246,0.55), transparent 55%), radial-gradient(circle at 0% 100%, rgba(99,102,241,0.25), transparent 50%), #060608",
          color: "#f5f5f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
              display: "flex",
              flexWrap: "wrap",
              padding: 12,
              gap: 4,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 4, background: "#0b0b0f" }} />
            <div style={{ width: 14, height: 14, borderRadius: 4, background: "#0b0b0f" }} />
            <div style={{ width: 14, height: 14, borderRadius: 4, background: "#0b0b0f" }} />
          </div>
          <div style={{ fontSize: 34, letterSpacing: -1 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -4 }}>Jūsų restoranas.</div>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -4, color: "#c4b5fd" }}>
            Išmanesni užsakymai.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a6a6b3", maxWidth: 900, lineHeight: 1.35 }}>
            QR užsakymų sistema, sujungianti klientus, virtuvę, barą ir personalą.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 26 }}>
          {[`Įdiegimas ${siteConfig.pricing.setup} €`, `${siteConfig.pricing.monthly} €/mėn.`].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
