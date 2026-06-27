import hoverBikeAsset from "@/assets/models/hover_bike.glb.asset.json";
import hovercarAsset from "@/assets/models/hovercar.glb.asset.json";
import rainierAsset from "@/assets/models/rainier_ak.glb.asset.json";

const LOCAL_ASSET_FALLBACK_HOST = "https://id-preview--63e69060-6ada-4389-a246-5a119e62b60f.lovable.app";

function hostedAsset(url: string) {
  return `${LOCAL_ASSET_FALLBACK_HOST}${url}`;
}

export type Artifact = {
  id: string;
  serial: string;
  name: string;
  shortName: string;
  tag: string;
  year: string;
  status: "ACTIVE" | "DORMANT" | "LOST" | "OBSERVED";
  url: string;
  fallbackUrl?: string;
  accent: string;
  secondary: string;
  lightAccent: string;
  lightSecondary: string;
  origin: string;
  transmission: string;
  fitSize?: number;
  positionY?: number;
  heroCopy: string;
  instructions: string[];
  material: {
    eyebrow: string;
    title: string;
    body: string;
  };
  behaviour: {
    eyebrow: string;
    title: string;
    body: string;
  };
  statusCopy: {
    eyebrow: string;
    title: string;
    highlight: string;
  };
  dossier: Array<{ k: string; v: number; suf: string }>;
  cards: Array<{ t: string; d: string }>;
  endVerb: string;
};

export const ARTIFACTS: Artifact[] = [
  {
    id: "objekt-404",
    serial: "001",
    name: "OBJEKT // 404",
    shortName: "OBJEKT",
    tag: "//404",
    year: "2098",
    status: "ACTIVE",
    url: "/models/object.glb",
    accent: "oklch(0.92 0.22 115)",
    secondary: "oklch(0.72 0.27 350)",
    lightAccent: "#d7ff3a",
    lightSecondary: "#ff2e7e",
    origin: "UNKNOWN",
    transmission: "LIVE",
    fitSize: 2.75,
    heroCopy: "An artifact recovered from a future not yet rendered. Drag, scroll, surrender — the object responds.",
    instructions: ["SCROLL TO ROTATE.", "HOVER TO LISTEN.", "DO NOT BLINK."],
    material: {
      eyebrow: "/01 — MATERIAL",
      title: "Cast from a memory of metal that never existed.",
      body: "The surface refuses photogrammetry. Each angle proposes a new geometry. Engineers stopped trying.",
    },
    behaviour: {
      eyebrow: "/02 — BEHAVIOUR",
      title: "It hums in a frequency only your cursor can hear.",
      body: "Move closer. The artifact remembers attention and returns it as orbit, drift, and slow rotation.",
    },
    statusCopy: {
      eyebrow: "/03 — STATUS",
      title: "Permanently in beta. Forever in flux.",
      highlight: "Yours, briefly.",
    },
    dossier: [
      { k: "POLYGONS", v: 184502, suf: "" },
      { k: "FREQUENCY", v: 444, suf: " Hz" },
      { k: "OBSERVERS", v: 12048, suf: "" },
      { k: "DRIFT.RATE", v: 99, suf: " %" },
    ],
    cards: [
      { t: "DRAG", d: "Apply rotational force. The artifact resists, then yields, then rebels." },
      { t: "LISTEN", d: "A 4.44 Hz hum bleeds through. Don't ask where the speakers are." },
      { t: "DECODE", d: "Every visitor sees a different artifact. The server doesn't pick — you do." },
    ],
    endVerb: "rotating",
  },
  {
    id: "rainier-ak",
    serial: "002",
    name: "Rainier // AK",
    shortName: "RAINIER",
    tag: "//AK",
    year: "2094",
    status: "OBSERVED",
    url: "/models/rainier_ak.glb",
    fallbackUrl: hostedAsset(rainierAsset.url),
    accent: "oklch(0.78 0.18 200)",
    secondary: "oklch(0.92 0.22 115)",
    lightAccent: "#57d9ff",
    lightSecondary: "#d7ff3a",
    origin: "ALPINE STATIC",
    transmission: "WEATHER LOCK",
    fitSize: 2.65,
    heroCopy: "A mountain-range relic rendered as a navigational error. Its mass keeps trying to leave the frame.",
    instructions: ["TRACK THE RIDGE.", "LET IT DRIFT.", "KEEP DISTANCE."],
    material: {
      eyebrow: "/01 — TERRAIN",
      title: "Stone, ice, and scan-noise fused into one impossible elevation.",
      body: "Rainier was not collected. It was cropped out of a storm and archived before the weather noticed.",
    },
    behaviour: {
      eyebrow: "/02 — MASS",
      title: "It moves like geography pretending to be an object.",
      body: "The frame compensates constantly, holding the summit in orbit so the artifact stays readable.",
    },
    statusCopy: {
      eyebrow: "/03 — STATUS",
      title: "Observed at altitude. Too large for custody.",
      highlight: "Scaled down only for containment.",
    },
    dossier: [
      { k: "ELEVATION", v: 14411, suf: " ft" },
      { k: "STATIC", v: 87, suf: " %" },
      { k: "SNOWPACK", v: 62, suf: " %" },
      { k: "DRIFT.RATE", v: 31, suf: " %" },
    ],
    cards: [
      { t: "TRACE", d: "Follow the ridge line until the mountain answers with signal loss." },
      { t: "SCALE", d: "Only this artifact is deliberately reduced. Full size would break the viewport." },
      { t: "HOLD", d: "The model is centered by containment, not by permission." },
    ],
    endVerb: "surveying",
  },
  {
    id: "hover-bike",
    serial: "003",
    name: "Hover Bike",
    shortName: "HOVER",
    tag: "//BIKE",
    year: "2099",
    status: "DORMANT",
    url: "/models/hover_bike.glb",
    fallbackUrl: hostedAsset(hoverBikeAsset.url),
    accent: "oklch(0.74 0.23 255)",
    secondary: "oklch(0.72 0.27 350)",
    lightAccent: "#4f8cff",
    lightSecondary: "#ff2e7e",
    origin: "LOW-LANE MARKET",
    transmission: "IDLE",
    fitSize: 2.8,
    heroCopy: "A personal transit artifact with its engine asleep and its silhouette still moving faster than the room.",
    instructions: ["CHECK THE FRAME.", "WATCH THE NOSE.", "DO NOT START."],
    material: {
      eyebrow: "/01 — CHASSIS",
      title: "A stripped frame built for speed after streets stopped touching wheels.",
      body: "The bike keeps a rider-shaped absence in the seat, as if waiting for the next body to complete the circuit.",
    },
    behaviour: {
      eyebrow: "/02 — PROPULSION",
      title: "Dormant thrusters pulse with leftover city light.",
      body: "No ignition key was recovered. The engine responds only to rotation and prolonged attention.",
    },
    statusCopy: {
      eyebrow: "/03 — STATUS",
      title: "Dormant, balanced, ready to vanish.",
      highlight: "Do not mount.",
    },
    dossier: [
      { k: "THRUSTERS", v: 2, suf: "" },
      { k: "FRAME.ID", v: 3099, suf: "" },
      { k: "CHARGE", v: 12, suf: " %" },
      { k: "WAKE.RISK", v: 74, suf: " %" },
    ],
    cards: [
      { t: "BALANCE", d: "The artifact leans into motion even while completely still." },
      { t: "IGNITE", d: "Power signatures remain below threshold, but the lights remember acceleration." },
      { t: "PARK", d: "Archived in hover stance. Ground contact remains unverified." },
    ],
    endVerb: "hovering",
  },
  {
    id: "hovercar",
    serial: "004",
    name: "Cyberpunk Hovercar",
    shortName: "CYBER",
    tag: "//CAR",
    year: "2101",
    status: "ACTIVE",
    url: "/models/hovercar.glb",
    fallbackUrl: hostedAsset(hovercarAsset.url),
    accent: "oklch(0.72 0.27 350)",
    secondary: "oklch(0.92 0.22 115)",
    lightAccent: "#ff2e7e",
    lightSecondary: "#d7ff3a",
    origin: "NEON ARTERIAL",
    transmission: "HOT",
    fitSize: 3,
    heroCopy: "An urban vehicle artifact still carrying the color of wet asphalt, illegal signage, and midnight traffic.",
    instructions: ["READ THE LIGHTS.", "KEEP CLEARANCE.", "ENGINE IS HOT."],
    material: {
      eyebrow: "/01 — BODY",
      title: "Paint, glass, and street-light glare welded into a moving shell.",
      body: "The car's surfaces behave like a city map: reflective, aggressive, and impossible to read from one angle.",
    },
    behaviour: {
      eyebrow: "/02 — SIGNAL",
      title: "Active systems blink under the panels like trapped traffic.",
      body: "It does not idle. It waits. The scanner reports heat where the engine should be silent.",
    },
    statusCopy: {
      eyebrow: "/03 — STATUS",
      title: "Active, armed with velocity, refusing impound.",
      highlight: "Give it lane space.",
    },
    dossier: [
      { k: "HORSEPOWER", v: 904, suf: "" },
      { k: "LANE.ID", v: 404, suf: "" },
      { k: "HEAT", v: 91, suf: " %" },
      { k: "NEON.LEAK", v: 68, suf: " %" },
    ],
    cards: [
      { t: "SCAN", d: "Body panels scatter the scanner into magenta afterimages." },
      { t: "CLEAR", d: "The artifact reserves space in front of itself, even in display mode." },
      { t: "CHASE", d: "Motion logs repeat a route that has not been built yet." },
    ],
    endVerb: "driving",
  },
];
