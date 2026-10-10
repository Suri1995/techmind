import SectionHeading from "@/components/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import ChannelHub from "@/components/home-components/ChannelHub";
import { IconCheck } from "@/components/icons";

const points = [
  "One team from strategy through to execution, so nothing gets lost between vendors",
  "Plans tailored to your business goals, audience, and budget",
  "The right channels aligned with your goals, then learned from and optimized as campaigns develop",
  "Practical next steps guided by the performance data available",
];

export default function WhyTechMind() {
  return (
    <section className="border-t border-line bg-paper-raised py-16 md:py-24">
      <div className="wrap grid gap-14 md:grid-cols-2 md:items-center">
        <Reveal y={24}>
          <ChannelHub />
        </Reveal>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Why Tech.Mind"
              title="Strategy, creativity and performance, working as one."
              description="Most marketing struggles when channels are run in isolation. We connect paid media, search, content, video and development around a single goal: yours."
            />
          </Reveal>
          <RevealGroup className="mt-8 space-y-4" stagger={0.08}>
            {points.map((point) => (
              <RevealItem key={point} y={12}>
                <div className="flex items-start gap-3 text-sm text-ink-soft md:text-base">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" />
                  {point}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
