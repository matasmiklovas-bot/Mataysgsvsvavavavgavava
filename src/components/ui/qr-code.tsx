import QRCode from "qrcode";

type QrCodeProps = {
  value: string;
  className?: string;
  color?: string;
  label: string;
};

/** Renders a real, scannable QR code as crisp SVG (generated on the server). */
export function QrCode({ value, className, color = "#0b0b0f", label }: QrCodeProps) {
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
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className={className}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <path d={path} fill={color} />
    </svg>
  );
}
