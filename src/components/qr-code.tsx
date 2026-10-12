import QRCode from "qrcode";

type QrCodeProps = {
  value: string;
  label: string;
  className?: string;
  color?: string;
};

/** A real, scannable QR code rendered as SVG on the server. */
export function QrCode({ value, label, className, color = "#1d1b18" }: QrCodeProps) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
  const size = modules.size;
  const quiet = 2;
  const total = size + quiet * 2;
  let path = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules.get(row, col)) path += `M${col + quiet} ${row + quiet}h1v1h-1z`;
    }
  }
  return (
    <svg viewBox={`0 0 ${total} ${total}`} className={className} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={total} height={total} fill="#fff" />
      <path d={path} fill={color} />
    </svg>
  );
}
