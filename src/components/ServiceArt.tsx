/**
 * Abstract, on-brand illustrations for each service. Pure SVG so they stay
 * sharp at any size, need no image hosting, and animate with CSS only.
 */

type Props = { slug: string; className?: string; label?: string };

const A = "var(--aqua)";
const T = "var(--teal)";
const G = "var(--amber)";

export default function ServiceArt({ slug, className = "", label }: Props) {
  return (
    <svg
      viewBox="0 0 400 300"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#031416" />
          <stop offset="0.6" stopColor="#073033" />
          <stop offset="1" stopColor="#0b4a48" />
        </linearGradient>
        <radialGradient id={`glow-${slug}`} cx="70%" cy="20%" r="70%">
          <stop offset="0" stopColor="#67e8d6" stopOpacity="0.28" />
          <stop offset="1" stopColor="#67e8d6" stopOpacity="0" />
        </radialGradient>
        <pattern id={`dots-${slug}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#fff" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#bg-${slug})`} />
      <rect width="400" height="300" fill={`url(#dots-${slug})`} />
      <rect width="400" height="300" fill={`url(#glow-${slug})`} />
      {art(slug)}
    </svg>
  );
}

function art(slug: string) {
  switch (slug) {
    case "meta-ads":
      return (
        <g>
          <circle cx="160" cy="150" r="78" fill={T} fillOpacity="0.22" stroke={T} strokeOpacity="0.8" />
          <circle cx="238" cy="150" r="78" fill={A} fillOpacity="0.16" stroke={A} strokeOpacity="0.8" />
          <circle cx="199" cy="95" r="60" fill={G} fillOpacity="0.14" stroke={G} strokeOpacity="0.8" />
          <circle cx="199" cy="140" r="7" fill="#fff" />
          <circle cx="199" cy="140" r="7" fill="none" stroke="#fff" strokeOpacity="0.7">
            <animate attributeName="r" values="7;34;7" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="3.2s" repeatCount="indefinite" />
          </circle>
          {[[72, 70], [330, 80], [340, 220], [60, 230]].map(([x, y], i) => (
            <g key={i} opacity="0.85">
              <rect x={x - 22} y={y - 14} width="44" height="28" rx="7" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeOpacity="0.35" />
              <rect x={x - 14} y={y - 6} width="20" height="4" rx="2" fill="#fff" fillOpacity="0.6" />
              <rect x={x - 14} y={y + 3} width="12" height="4" rx="2" fill={G} />
            </g>
          ))}
        </g>
      );
    case "google-ads":
      return (
        <g>
          <rect x="56" y="48" width="288" height="42" rx="21" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeOpacity="0.4" />
          <circle cx="86" cy="69" r="9" fill="none" stroke={A} strokeWidth="2.5" />
          <path d="M93 76l8 8" stroke={A} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="112" y="64" width="110" height="10" rx="5" fill="#fff" fillOpacity="0.55">
            <animate attributeName="width" values="20;110;110" dur="3.6s" repeatCount="indefinite" />
          </rect>
          <g>
            <rect x="56" y="112" width="288" height="52" rx="12" fill={G} fillOpacity="0.18" stroke={G} strokeOpacity="0.85" />
            <rect x="70" y="122" width="26" height="14" rx="4" fill={G} />
            <rect x="106" y="124" width="120" height="8" rx="4" fill="#fff" fillOpacity="0.85" />
            <rect x="70" y="144" width="200" height="6" rx="3" fill="#fff" fillOpacity="0.4" />
          </g>
          {[180, 230].map((y, i) => (
            <g key={y} opacity={1 - i * 0.3}>
              <rect x="56" y={y - 10} width="288" height="42" rx="12" fill="#fff" fillOpacity="0.05" stroke="#fff" strokeOpacity="0.2" />
              <rect x="70" y={y} width={140 - i * 20} height="7" rx="3.5" fill={A} fillOpacity="0.8" />
              <rect x="70" y={y + 14} width="210" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
            </g>
          ))}
        </g>
      );
    case "seo":
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={60 + i * 48} y={230 - (30 + i * 24)} width="30" height={30 + i * 24} rx="6" fill={i === 5 ? G : T} fillOpacity={i === 5 ? 0.95 : 0.35 + i * 0.08}>
              <animate attributeName="height" values={`0;${30 + i * 24}`} dur="1.2s" begin={`${i * 0.12}s`} fill="freeze" />
              <animate attributeName="y" values={`230;${230 - (30 + i * 24)}`} dur="1.2s" begin={`${i * 0.12}s`} fill="freeze" />
            </rect>
          ))}
          <path d="M70 190 C 130 170, 170 150, 220 120 S 300 80, 340 52" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 7" />
          <g transform="translate(300 40)">
            <circle cx="0" cy="0" r="26" fill="#031416" fillOpacity="0.7" stroke={A} strokeWidth="3" />
            <path d="M18 18l16 16" stroke={A} strokeWidth="4" strokeLinecap="round" />
            <path d="M-8 4l6 6 12-14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform="translate(70 70)">
            <path d="M0 -26c-14 0-24 10-24 23 0 17 24 40 24 40s24-23 24-40c0-13-10-23-24-23z" fill={G} />
            <circle cx="0" cy="-3" r="8" fill="#031416" />
          </g>
        </g>
      );
    case "influencer-marketing":
      return (
        <g>
          {[[90, 70], [310, 70], [320, 220], [80, 220], [200, 38]].map(([x, y], i) => (
            <g key={i}>
              <line x1="200" y1="150" x2={x} y2={y} stroke={A} strokeOpacity="0.45" strokeDasharray="4 6" />
              <circle cx={x} cy={y} r="22" fill="#fff" fillOpacity="0.1" stroke={i % 2 ? G : T} strokeWidth="2" />
              <circle cx={x} cy={y - 5} r="6.5" fill="#fff" fillOpacity="0.8" />
              <path d={`M${x - 11} ${y + 12}a11 9 0 0122 0`} fill="#fff" fillOpacity="0.8" />
            </g>
          ))}
          <circle cx="200" cy="150" r="44" fill={T} fillOpacity="0.3" stroke={A} strokeWidth="2.5" />
          <circle cx="200" cy="150" r="44" fill="none" stroke={A}>
            <animate attributeName="r" values="44;74;44" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="3.6s" repeatCount="indefinite" />
          </circle>
          <path d="M200 166l-18-17a11 11 0 0118-12 11 11 0 0118 12z" fill={G} />
        </g>
      );
    case "video-editing":
      return (
        <g>
          <rect x="60" y="36" width="280" height="130" rx="14" fill="#031416" fillOpacity="0.6" stroke="#fff" strokeOpacity="0.3" />
          <circle cx="200" cy="101" r="28" fill={T} fillOpacity="0.9" />
          <path d="M192 88l22 13-22 13z" fill="#fff" />
          <rect x="60" y="182" width="280" height="76" rx="12" fill="#fff" fillOpacity="0.05" stroke="#fff" strokeOpacity="0.2" />
          {[[70, 192, 80, T], [158, 192, 60, A], [226, 192, 100, G]].map(([x, y, w, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={w as number} height="16" rx="5" fill={c as string} fillOpacity="0.85" />
          ))}
          {[[70, 214, 110, A], [190, 214, 70, G], [268, 214, 62, T]].map(([x, y, w, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={w as number} height="16" rx="5" fill={c as string} fillOpacity="0.55" />
          ))}
          <g>
            <line x1="0" y1="178" x2="0" y2="262" stroke="#fff" strokeWidth="2" />
            <path d="M-6 172h12l-6 9z" fill="#fff" />
            <animateTransform attributeName="transform" type="translate" values="70 0;330 0;70 0" dur="7s" repeatCount="indefinite" />
          </g>
        </g>
      );
    case "website-app-development":
      return (
        <g>
          <rect x="44" y="44" width="250" height="190" rx="14" fill="#031416" fillOpacity="0.65" stroke="#fff" strokeOpacity="0.35" />
          <path d="M44 72h250" stroke="#fff" strokeOpacity="0.25" />
          {[0, 1, 2].map((i) => <circle key={i} cx={62 + i * 14} cy="58" r="3.5" fill={i === 2 ? A : "#fff"} fillOpacity={i === 2 ? 1 : 0.4} />)}
          <rect x="62" y="92" width="120" height="14" rx="4" fill="#fff" fillOpacity="0.85" />
          <rect x="62" y="114" width="170" height="7" rx="3.5" fill="#fff" fillOpacity="0.4" />
          <rect x="62" y="128" width="140" height="7" rx="3.5" fill="#fff" fillOpacity="0.4" />
          <rect x="62" y="150" width="76" height="24" rx="12" fill={G} />
          {[0, 1, 2].map((i) => <rect key={i} x={62 + i * 76} y="188" width="64" height="32" rx="8" fill={i === 1 ? T : "#fff"} fillOpacity={i === 1 ? 0.5 : 0.1} stroke="#fff" strokeOpacity="0.25" />)}
          <g transform="translate(278 96)">
            <rect width="88" height="156" rx="16" fill="#031416" stroke={A} strokeWidth="2.5" />
            <rect x="10" y="22" width="68" height="40" rx="8" fill={T} fillOpacity="0.55" />
            <rect x="10" y="72" width="50" height="7" rx="3.5" fill="#fff" fillOpacity="0.8" />
            <rect x="10" y="86" width="68" height="5" rx="2.5" fill="#fff" fillOpacity="0.35" />
            <rect x="10" y="108" width="68" height="22" rx="11" fill={G} />
            <animateTransform attributeName="transform" type="translate" values="278 96;278 88;278 96" dur="4s" repeatCount="indefinite" />
          </g>
        </g>
      );
    case "web-applications":
      return (
        <g>
          <rect x="40" y="36" width="320" height="228" rx="14" fill="#031416" fillOpacity="0.7" stroke="#fff" strokeOpacity="0.35" />
          <rect x="40" y="36" width="70" height="228" rx="14" fill="#fff" fillOpacity="0.06" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x="54" y={62 + i * 28} width="42" height="9" rx="4.5" fill={i === 1 ? A : "#fff"} fillOpacity={i === 1 ? 0.95 : 0.35} />)}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={124 + i * 78} y="54" width="68" height="48" rx="10" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.25" />
              <rect x={134 + i * 78} y="66" width="26" height="6" rx="3" fill="#fff" fillOpacity="0.5" />
              <rect x={134 + i * 78} y="80" width="40" height="10" rx="3" fill={[T, A, G][i]} />
            </g>
          ))}
          <rect x="124" y="116" width="224" height="130" rx="10" fill="#fff" fillOpacity="0.05" stroke="#fff" strokeOpacity="0.2" />
          <path d="M140 224 C 170 200, 190 214, 220 176 S 280 160, 332 134" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" strokeDasharray="500" strokeDashoffset="500">
            <animate attributeName="stroke-dashoffset" values="500;0" dur="2.4s" fill="freeze" />
          </path>
          <path d="M140 224 C 170 200, 190 214, 220 176 S 280 160, 332 134 L332 238 L140 238z" fill={T} fillOpacity="0.18" />
          <circle cx="332" cy="134" r="5" fill={G} />
        </g>
      );
    case "performance-marketing":
    default:
      return (
        <g>
          <path d="M110 70h180l-40 60v70l-40 24v-94z" fill={T} fillOpacity="0.3" stroke={A} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M126 92h148M150 118h100" stroke="#fff" strokeOpacity="0.35" />
          {[[44, 52], [44, 110], [44, 168], [356, 52], [356, 110], [356, 168]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y} C ${x < 200 ? x + 40 : x - 40} ${y}, ${x < 200 ? 120 : 280} 80, 200 100`} fill="none" stroke={i % 3 === 0 ? G : A} strokeOpacity="0.6" strokeDasharray="3 6">
                <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.4s" repeatCount="indefinite" />
              </path>
              <circle cx={x} cy={y} r="13" fill="#031416" stroke={i % 3 === 0 ? G : A} strokeWidth="2" />
              <circle cx={x} cy={y} r="4" fill={i % 3 === 0 ? G : A} />
            </g>
          ))}
          <circle cx="200" cy="244" r="22" fill={G} />
          <path d="M190 244l7 7 14-15" fill="none" stroke="#031416" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
  }
}
