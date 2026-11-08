import { buildSkullBackground } from "../skullPattern";

const { primaryTile, accentTile } = buildSkullBackground({
  primaryFill: "rgba(255,255,255,0.14)",
  accentFill: "rgba(57,255,122,0.08)",
  scale: 2.8,
});

const landscapeStyle = {
  backgroundImage: `url("${primaryTile}"), url("${accentTile}")`,
  backgroundRepeat: "repeat, repeat",
  backgroundPosition: "center, 12.5% 12.5%",
  backgroundSize:
    "clamp(180px, 28vmax, 360px) clamp(180px, 28vmax, 360px), clamp(180px, 28vmax, 360px) clamp(180px, 28vmax, 360px)",
};

const SkullBackground = ({ className = "" }) => (
  <div
    className={`background-layer ${className}`.trim()}
    aria-hidden="true"
    style={landscapeStyle}
  />
);

export default SkullBackground;
