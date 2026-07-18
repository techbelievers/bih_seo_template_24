import React from "react";
import {
  Waves, Car, Dumbbell, SquareParking, BatteryCharging, Cctv, Gamepad2,
  ArrowUpFromDot, ShieldCheck, Recycle, Wifi, TentTree, PlugZap, Footprints,
  Theater, Dog, Volleyball, Sparkles, Drama, Building2, DoorOpen, Route,
  Trees, Baby, Flower2, Bath, BookOpen, CloudRain, Droplets, Sun,
  FireExtinguisher, Phone, PartyPopper, Utensils, CreditCard, Armchair,
  BedDouble, Bike, Church, Store, Music, Lightbulb, Fence, Wind,
} from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useEnquiry } from "../hooks/useEnquiry";

/**
 * Amenity names arrive free-form from the CMS and vary per project
 * ("Landscape Garden", "Garden Area", "Central Green"…), so exact-string
 * lookup left most of them on the same fallback icon. Match on keywords
 * instead — ordered most-specific first, since the first hit wins.
 */
const ICON_RULES = [
  [["cover parking", "covered parking"], SquareParking],
  [["parking"], Car],
  [["swimming", "pool"], Waves],
  [["gym", "fitness"], Dumbbell],
  [["cctv", "surveillance"], Cctv],
  // "gaurd" — the CMS ships this misspelling
  [["security", "guard", "gaurd"], ShieldCheck],
  [["club"], Building2],
  [["entrance", "gate"], DoorOpen],
  [["road", "pathway", "driveway"], Route],
  [["garden", "landscape", "lawn", "green", "plantation"], Trees],
  [["lift", "elevator"], ArrowUpFromDot],
  [["battery", "power backup", "generator", "dg set"], BatteryCharging],
  [["wifi", "wi-fi", "internet", "broadband"], Wifi],
  [["charging", "electric vehic", "electical vehical", "ev point"], PlugZap],
  [["cycl", "bicycle"], Bike],
  [["jogging", "walking", "running", "track"], Footprints],
  [["indoor game", "games", "gaming"], Gamepad2],
  [["amphi"], Drama],
  [["theater", "theatre", "cinema"], Theater],
  [["pet"], Dog],
  [["waste", "garbage", "compost"], Recycle],
  [["sewage", "water treatment", "stp", "water supply"], Droplets],
  [["rain water", "rainwater", "harvest"], CloudRain],
  [["solar"], Sun],
  [["fire"], FireExtinguisher],
  [["intercom", "telephone"], Phone],
  [["banquet", "party", "celebration", "multipurpose hall"], PartyPopper],
  [["cafe", "restaurant", "dining", "food", "kitchen"], Utensils],
  [["library", "reading"], BookOpen],
  [["yoga", "meditation", "spa", "wellness"], Flower2],
  [["jacuzzi", "steam", "sauna", "bath"], Bath],
  [["kids", "children", "toddler", "play area", "creche"], Baby],
  [["senior", "elder"], Armchair],
  [["guest"], BedDouble],
  [["temple", "worship", "prayer"], Church],
  [["atm", "bank"], CreditCard],
  [["cricket", "football", "basketball", "badminton", "tennis", "volleyball", "sports", "court"], Volleyball],
  [["gazebo", "pergola", "sit out", "seating", "deck"], TentTree],
  [["shopping", "store", "retail", "market", "convenience"], Store],
  [["music", "dance"], Music],
  [["light", "lamp"], Lightbulb],
  [["compound", "boundary", "fence", "wall"], Fence],
  [["ventilation", "air"], Wind],
];

const iconFor = (name = "") => {
  const n = name.toLowerCase();
  const hit = ICON_RULES.find(([keys]) => keys.some((k) => n.includes(k)));
  return hit ? hit[1] : Sparkles;
};

const Amenities = () => {
  const { data, loading } = useApi("amenities");
  const openEnquiry = useEnquiry();
  const list = data?.amenities?.amenities || [];
  const heading = data?.amenities?.page?.heading;

  if (!loading && list.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-28">
      {/* Ambient gold glows for depth */}
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold/6 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gold/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Curated Lifestyle"
          title={heading || "World-Class Amenities"}
          sub="Every detail considered — leisure, wellness and security woven into daily life."
        />

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {loading &&
            [...Array(10)].map((_, i) => <div key={i} className="skeleton-dark h-32 rounded-2xl" />)}

          {list.map((a, i) => {
            const Icon = iconFor(a.amenity_name);
            return (
              <Reveal key={a.id} delay={(i % 5) * 70}>
                <div className="tilt-sm group flex h-full flex-col items-center justify-center gap-3.5 rounded-2xl border border-line-dark bg-ink-soft px-4 py-7 text-center transition-colors duration-300 hover:border-gold/40">
                  <span className="flex h-13 w-13 items-center justify-center rounded-full border border-gold/25 bg-gold/8 p-3.5 text-gold transition-transform duration-500 group-hover:scale-110">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <p className="text-[13px] font-semibold leading-snug text-ivory/85">
                    {a.amenity_name}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <button onClick={() => openEnquiry("Amenities Enquiry")} className="btn-gold">
            Explore the Full Lifestyle
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default Amenities;
