import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the ticket mark on the dark hero colour. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0b0a",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32">
          <path d="M6 2h20v24l-3.33 3.5-3.34-3.5-3.33 3.5-3.33-3.5-3.34 3.5L6 26z" fill="#f5f3ef" />
          <rect x="10" y="7.5" width="12" height="2.6" rx="1" fill="#0c0b0a" />
          <rect x="10" y="12.5" width="8" height="2.6" rx="1" fill="#0c0b0a" />
          <rect x="10" y="17.5" width="11" height="2.6" rx="1" fill="#e5583c" />
        </svg>
      </div>
    ),
    size,
  );
}
