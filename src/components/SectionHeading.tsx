type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
}: Props) {
  const isCenter = align === "center";
  const textColor = tone === "paper" ? "text-paper" : "text-ink";
  const subColor = tone === "paper" ? "text-slate-on-ink" : "text-slate";

  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className={`text-sm font-medium ${tone === "paper" ? "text-teal" : "text-teal-deep"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-3 font-display text-3xl leading-[1.15] md:text-4xl ${textColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed md:text-lg ${subColor}`}>
          {description}
        </p>
      )}
    </div>
  );
}
