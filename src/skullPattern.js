export const SKULL = [
  "⠀⠀⠀⠀⢀⣀⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀",
  "⠀⢀⣤⣾⣿⣾⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀",
  "⢠⣾⣿⢛⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀",
  "⣾⣯⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
  "⣿⡿⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠻⢿⡵",
  "⢸⡇⠀⠀⠉⠛⠛⣿⣿⠛⠛⠉⠀⠀⣿⡇",
  "⢸⣿⣀⠀⢀⣠⣴⡇⠹⣦⣄⡀⠀⣠⣿⡇",
  "⠈⠻⠿⠿⣟⣿⣿⣦⣤⣼⣿⣿⠿⠿⠟⠀",
  "⠀⠀⠀⠀⠸⡿⣿⣿⢿⡿⢿⠇⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠈⠁⠈⠁⠀⠀⠀⠀⠀⠀",
];

const BRAILLE_DOT_COORDS = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [0, 3],
  [1, 3],
];

const PADDING = 8;

const normalize = (value) => Number.parseFloat(value.toFixed(4));

export function buildSkullTile({ fill = "rgba(255,255,255,0.2)", viewBoxScale = 1 } = {}) {
  const rows = SKULL.length;
  const columns = SKULL[0].length;
  const pixelWidth = columns * 2;
  const pixelHeight = rows * 4;
  const paddedCols = pixelWidth + PADDING * 2;
  const paddedRows = pixelHeight + PADDING * 2;

  const rects = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const row = SKULL[rowIndex];

    for (let charIndex = 0; charIndex < row.length; charIndex += 1) {
      const character = row[charIndex];
      const value = character.codePointAt(0) - 0x2800;
      const xBase = charIndex * 2;
      const yBase = rowIndex * 4;

      for (let bitIndex = 0; bitIndex < 8; bitIndex += 1) {
        if ((value & (1 << bitIndex)) === 0) continue;

        const [dx, dy] = BRAILLE_DOT_COORDS[bitIndex];
        const x = xBase + dx + PADDING;
        const y = yBase + dy + PADDING;

        rects.push(`M ${normalize(x * viewBoxScale)} ${normalize(y * viewBoxScale)} h 1 v 1 h -1 Z`);
      }
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${paddedCols * viewBoxScale} ${paddedRows * viewBoxScale}" shape-rendering="crispEdges">
      <rect width="${paddedCols * viewBoxScale}" height="${paddedRows * viewBoxScale}" fill="none"/>
      <path d="${rects.join(" ")}" fill="${fill}"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function buildSkullBackground({
  primaryFill = "rgba(255,255,255,0.2)",
  accentFill = "rgba(57,255,122,0.12)",
  scale = 2.9,
} = {}) {
  const primaryTile = buildSkullTile({ fill: primaryFill, viewBoxScale: scale });
  const accentTile = buildSkullTile({ fill: accentFill, viewBoxScale: scale });

  return {
    primaryTile,
    accentTile,
  };
}
