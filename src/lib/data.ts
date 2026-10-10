export const company = {
  name: "Tech.Mind",
  tagline: "Strategy | Creativity | Performance",
  phone: "+91 90000 12345",
  email: "hello@techmind.in",
  address:
    "Level 4, Cyber Gateway, Hitech City, Madhapur, Hyderabad, Telangana 500081",
  mapsQuery: "Hitech City, Hyderabad, Telangana",
};

/* ------------------------------------------------------------------ */
/*  Headline numbers: only figures that come straight from the brief   */
/* ------------------------------------------------------------------ */

export const stats = [
  { value: "360°", label: "Marketing solutions, from brand to sale" },
  { value: "8", label: "Service categories under one roof" },
  { value: "7", label: "Industries we currently support" },
  { value: "One Team", label: "From strategy to execution" },
];

export const growthPanel = {
  eyebrow: "Your growth partner",
  title: "Digital marketing, connected.",
  rows: [
    { label: "Brand visibility", tag: "Strategy" },
    { label: "Qualified enquiries", tag: "Performance" },
    { label: "Search presence", tag: "Organic" },
    { label: "Content that connects", tag: "Creative" },
    { label: "Leads & customer journey", tag: "Optimization" },
  ],
  note: "Plans are tailored to your business goals, audience, and budget.",
};

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  number: string;
  name: string;
  short: string;
  tagline: string;
  description: string[];
  bestFor: string[];
  included: { title: string; text: string }[];
  process: { title: string; text: string }[];
  channels: string[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "meta-ads",
    number: "01",
    name: "Meta Ads",
    short:
      "Reach the right audience with paid social campaigns built around awareness, enquiries, and sales.",
    tagline: "Paid social that puts your brand in front of the people most likely to care.",
    description: [
      "Facebook and Instagram are where many of your future customers already spend their time. Meta Ads lets you meet them there with the right message, in the right format, at the right moment in their decision.",
      "We plan campaigns around a clear objective first: awareness, enquiries, store visits or online sales. Then we build the audiences, creative and tracking that objective needs, and we keep refining them as results come in.",
    ],
    bestFor: [
      "Local and regional businesses that want steady enquiries",
      "E-commerce brands that need reach and repeat purchases",
      "Launches, events and seasonal offers with a fixed window",
      "Brands that already have good creative and need it to travel further",
    ],
    included: [
      { title: "Objective and funnel planning", text: "We map awareness, consideration and conversion campaigns to your actual sales journey, so budget is not spent on the wrong stage." },
      { title: "Audience building", text: "Interest, location, lookalike and retargeting audiences, tested against each other so the strongest ones earn more of the budget." },
      { title: "Creative direction", text: "Static, carousel, reel and story formats written and briefed to fit each placement, with hooks designed for the first seconds." },
      { title: "Tracking setup", text: "Meta Pixel and Conversions API configured so enquiries, calls and purchases are measured properly from day one." },
      { title: "Campaign management", text: "Daily monitoring, budget pacing, creative rotation and audience pruning handled by the same team that planned the campaign." },
      { title: "Reporting and review", text: "Plain-language reports that show what ran, what worked, what did not, and what we will change next." },
    ],
    process: [
      { title: "Goal and offer review", text: "We agree what a good result looks like and check that the offer and landing experience can support it." },
      { title: "Account and tracking setup", text: "Business accounts, pixel events and conversion tracking are checked or built before any money is spent." },
      { title: "Launch and test", text: "Campaigns go live with multiple audiences and creatives so we learn quickly what resonates." },
      { title: "Optimise and scale", text: "Winning combinations get more budget. Weak ones are paused, rewritten or replaced." },
    ],
    channels: ["Facebook", "Instagram", "Reels", "Stories", "Lead forms", "Retargeting", "Catalogue ads", "Click-to-WhatsApp"],
    outcomes: [
      "A clear, trackable route from ad to enquiry or sale",
      "Creative that is tested instead of guessed",
      "Spend that shifts toward what is working",
      "Reporting you can read without a glossary",
    ],
    faqs: [
      { q: "Do you also create the ad creative?", a: "Yes. Our creative and video team can produce the static designs, reels and edits, or we can work with creative you already have." },
      { q: "How much should I spend on ads?", a: "It depends on your goals, audience size and market. We recommend a starting budget based on those, and plans are tailored to your business goals, audience, and budget." },
      { q: "Can you run ads for lead generation and sales together?", a: "Yes. We usually separate the objectives into different campaigns so each can be measured and improved on its own terms." },
    ],
    related: ["google-ads", "video-editing", "performance-marketing"],
  },
  {
    slug: "google-ads",
    number: "02",
    name: "Google Ads",
    short:
      "Connect with people searching for your products and services through targeted campaigns.",
    tagline: "Be the answer when someone is already searching for what you offer.",
    description: [
      "Search advertising reaches people at the moment they are looking. Someone typing a service, product or problem into Google is closer to a decision than almost any other audience you can pay to reach.",
      "We build Google Ads campaigns around the searches that matter to your business, write ads that match intent, and send visitors to pages designed to turn that interest into a call, form or purchase.",
    ],
    bestFor: [
      "Businesses with clear, searchable services such as clinics, hotels or contractors",
      "Local brands that rely on calls, directions and bookings",
      "Online stores that want shopping and search visibility",
      "Anyone who wants enquiries sooner than SEO alone can deliver",
    ],
    included: [
      { title: "Keyword and intent research", text: "We group searches by buying intent, so high-intent terms are prioritised and wasted clicks are filtered out early." },
      { title: "Search campaign build", text: "Tightly themed ad groups, responsive search ads and extensions written around your offer and location." },
      { title: "Local and call campaigns", text: "Location targeting, call extensions and Google Business Profile links for businesses that depend on nearby customers." },
      { title: "Performance Max and Shopping", text: "For product businesses, feed-based campaigns that show your catalogue across Search, Shopping and Display." },
      { title: "Conversion tracking", text: "Form submissions, calls and purchases tracked through GA4 and Google Tag Manager so results are measurable." },
      { title: "Landing page recommendations", text: "Practical changes to your pages so the traffic you pay for has the best chance of converting." },
    ],
    process: [
      { title: "Search landscape review", text: "We study what your customers search for and what competitors are already doing." },
      { title: "Structure and tracking", text: "Campaigns, negative keywords and conversion events are set up cleanly before launch." },
      { title: "Launch and learn", text: "Early data tells us which queries and ads deserve more budget." },
      { title: "Refine continuously", text: "Search term reviews, bid adjustments and ad testing keep quality up and cost down." },
    ],
    channels: ["Search", "Performance Max", "Shopping", "Display", "YouTube", "Local campaigns", "Call ads", "Remarketing"],
    outcomes: [
      "Visibility on searches that show real intent",
      "Calls, forms and bookings tracked end to end",
      "A steadily cleaner list of queries and keywords",
      "Clear reporting on cost per enquiry or sale",
    ],
    faqs: [
      { q: "How quickly can Google Ads start bringing enquiries?", a: "Campaigns can go live soon after setup and approval. The first weeks are used to learn which searches and ads perform, so results improve with refinement." },
      { q: "Do I need a website to run Google Ads?", a: "A relevant landing page helps a great deal. If you do not have one, our website team can build it so your ads have somewhere strong to send people." },
      { q: "Can Google Ads work alongside SEO?", a: "Yes, and it often should. Ads give faster visibility while SEO builds lasting presence, and each informs the other." },
    ],
    related: ["seo", "website-app-development", "performance-marketing"],
  },
  {
    slug: "seo",
    number: "03",
    name: "SEO",
    short:
      "Improve search discoverability through technical, on-page, content, and local SEO.",
    tagline: "Build the kind of search presence that keeps working after the campaign ends.",
    description: [
      "Search engine optimisation is how your business earns a lasting place in search results. Unlike paid ads, the visibility you build tends to compound: good pages, a healthy site and a trusted profile keep bringing in relevant visitors.",
      "Our approach covers the whole picture. We fix technical issues that hold a site back, shape pages around what people actually search for, produce content that answers real questions, and strengthen local presence through Google Business Profile and Maps.",
    ],
    bestFor: [
      "Businesses that want steady, long-term discovery",
      "Clinics, hotels, studios and services with a local catchment",
      "Websites that exist but are hard to find on Google",
      "E-commerce stores with many products and categories",
    ],
    included: [
      { title: "Technical SEO audit", text: "Crawlability, site speed, mobile experience, indexing and structured data checked and prioritised into a fix list." },
      { title: "Keyword and content strategy", text: "A keyword map tied to your services and customer questions, with a plan for the pages and articles that should exist." },
      { title: "On-page optimisation", text: "Titles, headings, copy, internal links and metadata refined so each page is clear to both people and search engines." },
      { title: "Local SEO", text: "Google Business Profile setup and management, local citations, review strategy and Maps visibility for location-based businesses." },
      { title: "Content production", text: "Service pages, guides and articles written to answer search intent and support the buying journey." },
      { title: "Monitoring and reporting", text: "Search Console and analytics tracking, with regular reviews of rankings, traffic and enquiries." },
    ],
    process: [
      { title: "Audit", text: "We review the site, the competition and your current visibility to find the biggest opportunities." },
      { title: "Strategy", text: "Priorities are ordered by impact and effort, so early work moves the needle." },
      { title: "Implement", text: "Technical fixes, page improvements and new content are delivered in steady batches." },
      { title: "Measure and grow", text: "We track what is improving, then extend into new topics, locations and pages." },
    ],
    channels: ["Technical SEO", "On-page", "Content", "Local SEO", "Google Business Profile", "Google Maps", "Schema markup", "Search Console"],
    outcomes: [
      "A site search engines can crawl and understand",
      "Pages aligned with how customers actually search",
      "A stronger local profile on Google Search and Maps",
      "Compounding visibility rather than rented attention",
    ],
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO is a gradual channel. Technical fixes and local improvements can be seen sooner, while content and authority build over months. We report progress along the way." },
      { q: "Do you help with Google Business Profile?", a: "Yes. Local SEO is a core part of our work, including profile setup, optimisation and ongoing management for businesses with physical locations." },
      { q: "Can you fix SEO on a site someone else built?", a: "In most cases, yes. We audit what is there, recommend changes, and work with your developers or our own team to apply them." },
    ],
    related: ["google-ads", "website-app-development", "performance-marketing"],
  },
  {
    slug: "influencer-marketing",
    number: "04",
    name: "Influencer Marketing",
    short:
      "Plan creator collaborations that help brands reach relevant audiences and build awareness.",
    tagline: "Collaborations with creators your audience already listens to.",
    description: [
      "People trust people. When the right creator talks about your brand to an audience that already follows them, the message arrives with a credibility that traditional advertising struggles to earn.",
      "We help you find creators who genuinely fit your brand, structure collaborations that feel natural, and measure what they contribute, so influencer marketing becomes a planned channel instead of a one-off experiment.",
    ],
    bestFor: [
      "Consumer brands in lifestyle, jewellery, beauty, food, hospitality and wellness",
      "New launches that need quick awareness",
      "Local brands that want to be talked about in their own city",
      "Businesses that want authentic content they can reuse in ads",
    ],
    included: [
      { title: "Creator research and shortlisting", text: "We look beyond follower counts to audience fit, engagement quality and content style." },
      { title: "Campaign concept and brief", text: "A clear creative brief that protects your message while leaving room for the creator's own voice." },
      { title: "Outreach and coordination", text: "Negotiation, scheduling, product or experience logistics and approvals handled by our team." },
      { title: "Content review", text: "Every piece is reviewed against the brief before it goes live, so your brand is represented correctly." },
      { title: "Content reuse", text: "Where agreed, creator content is repurposed into paid ads and your own channels for longer-lasting value." },
      { title: "Campaign reporting", text: "Reach, engagement and traffic summaries that show what the collaboration contributed." },
    ],
    process: [
      { title: "Define the role", text: "We decide what the campaign should do: awareness, launch buzz, store visits or sales support." },
      { title: "Match creators", text: "A shortlist is prepared with reasons behind each recommendation." },
      { title: "Produce and publish", text: "Briefs, approvals and posting schedules are managed end to end." },
      { title: "Review and extend", text: "We report results and recommend which creators and formats to continue with." },
    ],
    channels: ["Instagram", "YouTube", "Reels", "Local creators", "Micro-influencers", "Product seeding", "Event coverage", "UGC"],
    outcomes: [
      "Creators who fit your brand and your audience",
      "Authentic content you can reuse across channels",
      "Awareness in the communities that matter to you",
      "A repeatable process instead of ad hoc posts",
    ],
    faqs: [
      { q: "Do I need a large budget for influencer marketing?", a: "No. Micro and local creators can be a strong fit for many brands. We plan around your budget and goals." },
      { q: "How do you choose creators?", a: "We assess audience relevance, engagement quality, content style and brand fit, not just follower numbers." },
      { q: "Can influencer content be used in ads?", a: "Yes, when usage rights are agreed upfront. It often performs well as paid creative." },
    ],
    related: ["meta-ads", "video-editing", "performance-marketing"],
  },
  {
    slug: "video-editing",
    number: "05",
    name: "Cinema Graphics & Video Editing",
    short:
      "Produce promotional edits, reels, motion graphics, and branded video content.",
    tagline: "Video and motion work that gives your marketing a look people remember.",
    description: [
      "Video is the format most audiences prefer, and the one platforms reward. But a good campaign video is more than a nicely cut clip: it has a clear hook, a consistent brand look and a format that suits where it will be seen.",
      "Our video and graphics team handles shoots, edits, reels, motion graphics and branded content, working closely with the marketing team so every piece is made to perform on the channel it is built for.",
    ],
    bestFor: [
      "Brands that want a stronger social media presence",
      "Real estate, hospitality and retail businesses that sell through visuals",
      "Advertisers who need fresh creative to avoid ad fatigue",
      "Businesses with raw footage that needs professional finishing",
    ],
    included: [
      { title: "Video shoots", text: "Planned shoots for properties, products, interiors, experiences and team stories, with a shot list prepared in advance." },
      { title: "Reels and short-form edits", text: "Vertical edits with strong hooks, captions and pacing designed for Instagram, Facebook and YouTube Shorts." },
      { title: "Promotional and brand films", text: "Longer pieces for launches, websites and presentations, with story structure and sound considered." },
      { title: "Motion graphics", text: "Animated titles, logos, lower thirds and explainer elements that give videos a polished, consistent look." },
      { title: "Colour and sound", text: "Colour correction, grading and audio clean-up so the finished piece looks and sounds professional." },
      { title: "Ad-ready variations", text: "Multiple cut-downs and aspect ratios from a single shoot, so the same footage serves several placements." },
    ],
    process: [
      { title: "Brief and concept", text: "We agree the message, audience, format and where the video will be used." },
      { title: "Plan and shoot", text: "Scripts, storyboards, locations and schedules are prepared before cameras roll." },
      { title: "Edit and refine", text: "Rough cuts are shared for feedback, then polished with graphics, music and colour." },
      { title: "Deliver and adapt", text: "Final files are exported in the right formats, with variations for ads and social." },
    ],
    channels: ["Reels", "Shorts", "Ad creative", "Brand films", "Motion graphics", "Product videos", "Property walkthroughs", "Social content"],
    outcomes: [
      "A consistent visual identity across your content",
      "Video built for the platform it will appear on",
      "A library of reusable footage and cut-downs",
      "Fresher creative for your paid campaigns",
    ],
    faqs: [
      { q: "Can you edit footage we have already shot?", a: "Yes. We can edit existing footage into reels, ads and brand films, and advise on what additional material would help." },
      { q: "Do you handle both shooting and editing?", a: "Yes. Our team covers planning, shooting and post-production, so one team is accountable for the final result." },
      { q: "Can you make videos for ads?", a: "Yes. We build ad-ready versions in multiple formats and lengths, with hooks designed for paid placements." },
    ],
    related: ["meta-ads", "influencer-marketing", "performance-marketing"],
  },
  {
    slug: "website-app-development",
    number: "06",
    name: "Website & App Development",
    short:
      "Create responsive websites, e-commerce experiences, and applications for your business.",
    tagline: "A website that looks credible, loads quickly and turns visitors into enquiries.",
    description: [
      "Your website is where every campaign, search result and recommendation ends up. If it is slow, confusing or unconvincing, the rest of your marketing works harder than it should.",
      "We design and build responsive websites, e-commerce stores and mobile experiences that are fast, easy to use and ready for search, with analytics and conversion tracking connected so you can see what is working.",
    ],
    bestFor: [
      "Businesses launching or replacing a website",
      "Brands that want to start selling online",
      "Local businesses that need booking and enquiry forms",
      "Companies whose current site is hard to update or slow on mobile",
    ],
    included: [
      { title: "Design and user experience", text: "Layouts designed around how visitors actually browse, with clear calls to action and a look that fits your brand." },
      { title: "Responsive development", text: "Sites that work well on phones, tablets and desktops, built for speed and accessibility." },
      { title: "E-commerce", text: "Product catalogues, carts, checkout and payments, set up so selling online feels simple for you and your customers." },
      { title: "SEO foundations", text: "Clean structure, metadata, speed and schema included from the start, so the site is ready to be found." },
      { title: "Forms, bookings and CRM", text: "Enquiry forms, appointment bookings and integrations that route leads to the people who follow up." },
      { title: "Analytics and tracking", text: "GA4, tag management and conversion tracking connected so your marketing can be measured." },
    ],
    process: [
      { title: "Plan the site", text: "Goals, audience, sitemap and content needs are agreed before design begins." },
      { title: "Design", text: "Page designs are shared for review so changes happen before development starts." },
      { title: "Build and test", text: "Development, content loading and testing across devices and browsers." },
      { title: "Launch and support", text: "Go-live checks, tracking verification and ongoing care after launch." },
    ],
    channels: ["Business websites", "E-commerce", "Landing pages", "Mobile apps", "Booking systems", "CMS", "Analytics", "Speed optimisation"],
    outcomes: [
      "A site that builds trust at first glance",
      "Fast, mobile-friendly pages that support SEO and ads",
      "Forms and bookings that reach your team reliably",
      "Tracking that connects traffic to enquiries and sales",
    ],
    faqs: [
      { q: "Can you build a site that I can update myself?", a: "Yes. We can use a content management system so your team can edit pages, products and blog posts without a developer." },
      { q: "Do you build mobile apps?", a: "Yes. We build apps for businesses that need a mobile experience, and advise on whether a responsive website would serve you better." },
      { q: "Will my new website be ready for SEO?", a: "Yes. Structure, speed, metadata and tracking are built in, so the site is ready for search and for ad campaigns." },
    ],
    related: ["web-applications", "seo", "google-ads"],
  },
  {
    slug: "performance-marketing",
    number: "07",
    name: "Complete Performance Marketing",
    short:
      "Connect paid media, creative, tracking, conversion goals, and optimization.",
    tagline: "Every channel working toward the same goal, measured in one place.",
    description: [
      "Most businesses run marketing as separate pieces: ads here, social there, a website somewhere else. Performance marketing joins those pieces into one system, so each channel supports the others and every rupee can be traced to a result.",
      "We take responsibility for the full journey: the paid media, the creative, the landing experience, the tracking and the follow-up. Then we use the data to decide what to do more of, what to fix and what to stop.",
    ],
    bestFor: [
      "Businesses already spending on ads that want clearer results",
      "Brands that need leads, bookings or sales across several channels",
      "Companies that want one accountable team instead of several vendors",
      "Owners who want regular, honest reporting on what marketing is delivering",
    ],
    included: [
      { title: "Full-funnel strategy", text: "A plan connecting awareness, consideration and conversion across Meta, Google, search and content." },
      { title: "Paid media management", text: "Planning, launching and optimising campaigns across platforms with a unified budget view." },
      { title: "Creative and content", text: "Ad creative, video and landing content produced together so the message stays consistent." },
      { title: "Conversion tracking", text: "A tracking framework that follows leads and sales from first click to final outcome." },
      { title: "Lead follow-up and CRM", text: "Lead capture, routing and CRM workflows so enquiries are responded to and not lost." },
      { title: "Reporting and optimisation", text: "Regular reviews that translate channel data into practical next steps." },
    ],
    process: [
      { title: "Audit and align", text: "We review current activity, tracking and goals, and agree what success looks like." },
      { title: "Build the system", text: "Channels, creative and tracking are structured to work as one." },
      { title: "Run and manage", text: "Campaigns, content and lead workflows are managed day to day." },
      { title: "Review and improve", text: "Regular performance reviews guide where to invest next." },
    ],
    channels: ["Meta Ads", "Google Ads", "SEO", "Creative", "Landing pages", "CRM", "Analytics", "Remarketing"],
    outcomes: [
      "One team accountable for the full customer journey",
      "Budget directed to the channels that earn it",
      "Leads tracked from enquiry through to outcome",
      "Reports that lead to decisions, not just charts",
    ],
    faqs: [
      { q: "Is performance marketing right for small businesses?", a: "Yes. It scales to your size. We tailor plans to your business goals, audience and budget, starting with the channels most likely to help." },
      { q: "How do you measure performance?", a: "We agree the goals first, such as enquiries, bookings or sales, then set up tracking so each channel's contribution can be seen." },
      { q: "Can we start with one service and expand?", a: "Absolutely. Many partnerships begin with a single channel and grow as results and confidence build." },
    ],
    related: ["meta-ads", "google-ads", "seo"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/* ------------------------------------------------------------------ */
/*  Clients                                                            */
/* ------------------------------------------------------------------ */

export type Client = {
  slug: string;
  name: string;
  sector: string;
  partnership: string;
  ongoing: boolean;
  summary: string;
  focus: string;
  tags: string[];
  story: string[];
};

export const clients: Client[] = [
  {
    slug: "srigdha-group",
    name: "Srigdha Group",
    sector: "Real Estate",
    partnership: "6 months",
    ongoing: false,
    summary: "Two gated communities covering villas and apartments in East Hyderabad.",
    focus: "Real estate branding and lead generation",
    tags: ["Meta Ads", "Google Ads", "SEO", "Video Shoots", "CRM", "Website & GMB"],
    story: [
      "Buying a home is a considered, high-value decision. Prospective buyers research for weeks, compare communities and look for signals of trust before they ever pick up the phone. For two gated communities in East Hyderabad, that meant the brand needed to look credible and the enquiry journey needed to be effortless.",
      "Our work combines branding with a steady lead generation system: paid campaigns on Meta and Google to reach buyers, video content that shows the communities properly, search and Google Business Profile work to be found locally, and CRM follow-up so every enquiry is picked up and tracked.",
    ],
  },
  {
    slug: "amma-eye-care-hospitals",
    name: "Amma Eye Care Hospitals",
    sector: "Healthcare",
    partnership: "4 months",
    ongoing: false,
    summary:
      "Digital visibility support for the Kokapet and LB Nagar locations, including Google Search and Maps presence.",
    focus: "Branding and appointment bookings",
    tags: ["Local SEO", "Google Maps", "Meta Ads", "Google Ads", "CRM", "Website & GMB"],
    story: [
      "Healthcare is a local decision. Patients search for a clinic near them, check the location on Maps, read what others say and then book. For a hospital with two locations, being visible and trustworthy in those moments matters more than anything else.",
      "We support the Kokapet and LB Nagar locations with local SEO, Google Maps and Google Business Profile optimisation, alongside Meta and Google campaigns that encourage appointment bookings, with a CRM to manage the enquiries that follow.",
    ],
  },
  {
    slug: "mangatrai-by-darpan",
    name: "Mangatrai by Darpan",
    sector: "Jewellery",
    partnership: "5 years",
    ongoing: false,
    summary:
      "Long-term social media structure and digital marketing support for a pearls and jewellery brand.",
    focus: "E-commerce sales, audience growth and store visits",
    tags: ["Social Media", "E-commerce", "Meta Ads", "SEO", "Video Shoots", "CRM"],
    story: [
      "Jewellery is bought on emotion and trust. The best marketing for it is visual, consistent and patient, which is why this is our longest-running partnership. Over five years we have helped structure how the brand shows up on social media and how that attention connects to the store and the online shop.",
      "The work spans a planned social media presence, product and brand video shoots, paid campaigns on Meta, search optimisation and e-commerce support, with CRM follow-up so interest turns into store visits and sales.",
    ],
  },
  {
    slug: "the-park-hotels",
    name: "The Park Hotels",
    sector: "Hospitality",
    partnership: "6 months",
    ongoing: false,
    summary: "Digital marketing support for hospitality visibility and customer engagement.",
    focus: "Hotel bookings and table reservations",
    tags: ["Branding", "Meta Ads", "Google Ads", "SEO", "Video Shoots", "Website & GMB"],
    story: [
      "Guests choose hotels and restaurants with their eyes first. Photography, video, reviews and search results all shape whether someone books a room or reserves a table. Visibility alone is not enough; the experience has to be shown well.",
      "Our work supports hotel bookings and table reservations through branding, video content that captures the property, paid campaigns on Meta and Google, search optimisation, and a strong website and Google Business Profile presence.",
    ],
  },
  {
    slug: "feijoa-skin-hair-clinic",
    name: "Feijoa Skin & Hair Clinic",
    sector: "Beauty & Wellness",
    partnership: "Ongoing",
    ongoing: true,
    summary: "Brand and digital marketing support to attract relevant audiences and enquiries.",
    focus: "Branding and appointment bookings",
    tags: ["Lead Generation", "Social Media", "Meta Ads", "SEO", "CRM", "Website & GMB"],
    story: [
      "Skin and hair care is a personal, trust-driven choice. People want to see credibility, understand what treatments involve and feel comfortable before booking a consultation.",
      "We support the clinic with a branded social media presence, lead generation campaigns on Meta, search and local optimisation, and CRM follow-up so every enquiry is answered and every consultation request is tracked toward a booking.",
    ],
  },
  {
    slug: "kinnera-farms",
    name: "Kinnera Farms",
    sector: "Farms & Lifestyle",
    partnership: "Ongoing",
    ongoing: true,
    summary: "Digital brand support to strengthen online presence and e-commerce activity.",
    focus: "Branding and e-commerce sales",
    tags: ["Branding", "E-commerce", "Meta Ads", "Google Ads", "SEO", "CRM"],
    story: [
      "Farm and lifestyle brands sell a story as much as a product: where it comes from, how it is made and why it is worth choosing. Online, that story has to be told clearly and connected to an easy way to buy.",
      "We help Kinnera Farms build a distinctive brand presence and support its e-commerce activity with paid campaigns on Meta and Google, search optimisation, and CRM follow-up that brings customers back.",
    ],
  },
  {
    slug: "obedience-dog-training",
    name: "Obedience Dog Training",
    sector: "Pet Services",
    partnership: "Ongoing",
    ongoing: true,
    summary: "Digital marketing to strengthen brand visibility and generate relevant enquiries.",
    focus: "Branding and lead generation",
    tags: ["Lead Generation", "Social Media", "Meta Ads", "Google Ads", "SEO", "Website & GMB"],
    story: [
      "Pet owners look for trainers they can trust with a member of the family. They search locally, compare options and look for proof that the trainer understands both dogs and people.",
      "Our work builds the brand's visibility through social media, paid campaigns on Meta and Google, local search and Google Business Profile, and a website that turns interest into enquiries from owners who are a good fit.",
    ],
  },
];

export const getClient = (slug: string) => clients.find((c) => c.slug === slug);
export const sectors = Array.from(new Set(clients.map((c) => c.sector)));
export const industries = sectors;

/** What each tag on a client card means, and which service page explains it. */
export const tagInfo: Record<string, { text: string; service: string }> = {
  "Meta Ads": { text: "Paid campaigns on Facebook and Instagram to reach the right audience.", service: "meta-ads" },
  "Google Ads": { text: "Search and local campaigns that capture people already looking.", service: "google-ads" },
  SEO: { text: "Technical, on-page and content work to be found on search.", service: "seo" },
  "Local SEO": { text: "Location-focused optimisation so nearby customers find the business.", service: "seo" },
  "Google Maps": { text: "Visibility and accuracy on Google Maps listings.", service: "seo" },
  "Website & GMB": { text: "A credible website and a fully optimised Google Business Profile.", service: "website-app-development" },
  "Video Shoots": { text: "Planned shoots and edits that show the brand at its best.", service: "video-editing" },
  CRM: { text: "Lead capture and follow-up so enquiries are tracked, not lost.", service: "web-applications" },
  "Social Media": { text: "A planned, consistent presence on the platforms customers use.", service: "influencer-marketing" },
  "E-commerce": { text: "Support for online selling, from catalogue to conversion.", service: "website-app-development" },
  Branding: { text: "A clear, recognisable identity across every touchpoint.", service: "performance-marketing" },
  "Lead Generation": { text: "Campaigns and funnels designed to produce qualified enquiries.", service: "performance-marketing" },
};

/* ------------------------------------------------------------------ */
/*  Process                                                            */
/* ------------------------------------------------------------------ */

export const process = [
  {
    step: "01",
    title: "Discover",
    headline: "Understand the business",
    text: "Clarify audience, objectives, offer, market, and budget.",
    points: ["Stakeholder conversation and goal setting", "Audience and competitor review", "Audit of existing channels and tracking"],
  },
  {
    step: "02",
    title: "Plan",
    headline: "Build the strategy",
    text: "Choose channels, creative direction, measurement, and priorities.",
    points: ["Channel and budget mix", "Creative and content direction", "Tracking and reporting plan"],
  },
  {
    step: "03",
    title: "Execute",
    headline: "Launch & manage",
    text: "Deliver campaigns, content, search work, and lead workflows.",
    points: ["Campaign launch and daily management", "Content and video production", "Lead capture and CRM follow-up"],
  },
  {
    step: "04",
    title: "Optimize",
    headline: "Review & improve",
    text: "Use available performance data to guide practical next steps.",
    points: ["Regular performance reviews", "Creative and audience testing", "Clear recommendations for what to do next"],
  },
];

/* ------------------------------------------------------------------ */
/*  About + FAQ                                                        */
/* ------------------------------------------------------------------ */

export const values = [
  {
    title: "Strategy first",
    text: "We choose channels after we understand your goals, never before. Plans are tailored to your business goals, audience, and budget.",
  },
  {
    title: "Creativity that works",
    text: "Good creative earns attention, but it also has to earn enquiries. We design content to be seen and to convert.",
  },
  {
    title: "Performance you can see",
    text: "We set up tracking first and report in plain language, so you always know what is working and what we will change.",
  },
  {
    title: "One accountable team",
    text: "Strategy, content, search, paid media and development work together, so nothing falls between vendors.",
  },
];

export const faqs = [
  {
    q: "How does a project with Tech.Mind start?",
    a: "We begin with a conversation about your business, audience, offer and budget. You can share a few project details through the contact form, and our team will follow up with the right next steps.",
  },
  {
    q: "Which service should we start with?",
    a: "It depends on your goals. Businesses that need enquiries soon often start with Meta Ads or Google Ads, while those building lasting visibility start with SEO and their website. Our planner on this page suggests a starting mix, and we refine it together.",
  },
  {
    q: "Do you work with local and small businesses?",
    a: "Yes. Our clients include clinics, hotels, jewellery brands, farms, real estate developers and pet service providers. Plans are tailored to your business goals, audience, and budget.",
  },
  {
    q: "Can you manage everything, or only one channel?",
    a: "Both. You can start with a single service, or ask us to manage the whole journey through Complete Performance Marketing, from paid media and creative to tracking and lead follow-up.",
  },
  {
    q: "How will I know what is working?",
    a: "We set up conversion tracking before campaigns launch and share regular reports in plain language, covering what ran, what worked and what we recommend next.",
  },
  {
    q: "Do you build websites and web applications too?",
    a: "Yes. We build responsive websites, e-commerce stores and mobile apps, plus custom web applications such as portals, booking systems, CRMs and dashboards.",
  },
];

/* ------------------------------------------------------------------ */
/*  Blog (editorial placeholders, ready for real articles)             */
/* ------------------------------------------------------------------ */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "meta-ads-vs-google-ads",
    title: "Meta Ads or Google Ads: where should your first budget go?",
    excerpt:
      "One platform catches people who are searching, the other finds people who are scrolling. How to choose based on your offer, audience and goal.",
    category: "Paid Media",
    date: "Oct 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "local-seo-checklist",
    title: "A local SEO checklist for clinics, hotels and neighbourhood brands",
    excerpt:
      "Google Business Profile, reviews, Maps and location pages: the practical steps that help nearby customers find you first.",
    category: "SEO",
    date: "Sep 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "reels-that-sell",
    title: "What makes a reel work for a brand and not just for likes",
    excerpt:
      "Hooks, pacing and a clear next step: how short video is planned when the goal is enquiries and store visits.",
    category: "Video",
    date: "Sep 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "working-with-creators",
    title: "How to work with creators without losing your brand voice",
    excerpt:
      "Choosing the right creators, writing a brief that helps and planning content you can reuse in your own ads.",
    category: "Influencer",
    date: "Aug 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "tracking-before-spending",
    title: "Set up tracking before you spend a rupee on ads",
    excerpt:
      "Pixels, conversions and call tracking: the measurement groundwork that makes every later decision easier.",
    category: "Analytics",
    date: "Aug 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "website-or-web-app",
    title: "Website or web application: which does your business need?",
    excerpt:
      "When a good website is enough, and when a portal, booking system or CRM will save your team real time.",
    category: "Development",
    date: "Jul 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  },
];
