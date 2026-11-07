const colors: Record<string, { text: string; bg: string }> = {
  web: { text: "text-[#dfffe9]", bg: "bg-[#0f1d13]" },
  ee: { text: "text-[#b5ffc5]", bg: "bg-[#0d1714]" },
  dsa: { text: "text-[#e7ffe8]", bg: "bg-[#101910]" },
  other: { text: "text-[#9fffb3]", bg: "bg-[#07140b]" },
} as const;

const SkillCard = ({
  skillName,
  category,
}: {
  skillName: string;
  category: string;
}) => {
  const color = colors[category];
  if (color === undefined) return <></>;

  return (
    <div
      className={`${color.bg} inline-flex p-2 rounded-full items-center justify-center text-center overflow-hidden`}
    >
      <p className={`${color.text} font-semibold`}>{skillName}</p>
    </div>
  );
};

export default SkillCard;
