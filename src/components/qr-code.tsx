import QRCode from "qrcode";

type QrCodeProps = {
  value: string;
  label: string;
  className?: string;
  color?: string;
  /** Rounded dots, soft finder eyes and the Kvitas mark in the middle. */
  styled?: boolean;
};

/** A real, scannable QR code rendered as SVG on the server. */
export function QrCode({ value, label, className, color = "#1d1d1f", styled = false }: QrCodeProps) {
  // High error correction leaves room for the logo in the centre.
  const { modules } = QRCode.create(value, { errorCorrectionLevel: styled ? "H" : "M" });
  const n = modules.size;
  const quiet = 2;
  const total = n + quiet * 2;

  if (!styled) {
    let path = "";
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
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

  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  // Centre area kept clear for the logo (odd size, about a fifth of the code).
  let logo = Math.round(n * 0.22);
  if (logo % 2 === 0) logo += 1;
  const logoStart = Math.floor((n - logo) / 2);
  const inLogo = (r: number, c: number) =>
    r >= logoStart && r < logoStart + logo && c >= logoStart && c < logoStart + logo;

  const dots: string[] = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (!modules.get(row, col) || inFinder(row, col) || inLogo(row, col)) continue;
      const cx = col + quiet + 0.5;
      const cy = row + quiet + 0.5;
      dots.push(`M${cx - 0.43} ${cy}a0.43 0.43 0 1 0 0.86 0a0.43 0.43 0 1 0 -0.86 0`);
    }
  }

  const eyes = [
    [quiet, quiet],
    [quiet + n - 7, quiet],
    [quiet, quiet + n - 7],
  ];
  const lx = quiet + logoStart;
  const ls = logo;

  return (
    <svg viewBox={`0 0 ${total} ${total}`} className={className} role="img" aria-label={label}>
      <rect width={total} height={total} rx={1.5} fill="#fff" />
      <path d={dots.join("")} fill={color} />
      {eyes.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.9} fill="none" stroke={color} strokeWidth={1} />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} fill={color} />
        </g>
      ))}
      {/* Kvitas mark in the clear centre */}
      <rect x={lx + 0.4} y={lx + 0.4} width={ls - 0.8} height={ls - 0.8} rx={1.2} fill="#fff" />
      <svg x={lx + ls * 0.18} y={lx + ls * 0.14} width={ls * 0.64} height={ls * 0.72} viewBox="5 1 22 30">
        <path d="M6 2h20v24l-3.33 3.5-3.34-3.5-3.33 3.5-3.33-3.5-3.34 3.5L6 26z" fill={color} />
        <rect x="10" y="7.5" width="12" height="2.6" rx="1" fill="#fff" />
        <rect x="10" y="12.5" width="8" height="2.6" rx="1" fill="#fff" />
        <rect x="10" y="17.5" width="11" height="2.6" rx="1" fill="#e5583c" />
      </svg>
    </svg>
  );
}
