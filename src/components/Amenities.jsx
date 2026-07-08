import React from "react";
import {
  Waves, Car, Dumbbell, ParkingCircle, BatteryCharging, Cctv, Gamepad2,
  ArrowUpFromDot, Shield, Recycle, Wifi, TentTree, PlugZap, Footprints,
  Theater, Dog, Volleyball, Sparkles,
} from "lucide-react";
import useApi from "../hooks/useApi";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { useEnquiry } from "../hooks/useEnquiry";

const ICONS = {
  "Swimming Pool": Waves,
  "Parking Lot": Car,
  Gym: Dumbbell,
  "Cricket Pitch": Volleyball,
  Football: Volleyball,
  "Cover Parking Lot": ParkingCircle,
  "Battery Backup": BatteryCharging,
  CCTV: Cctv,
  "Indoor Games": Gamepad2,
  Lift: ArrowUpFromDot,
  "Security Gaurd": Shield,
  "Solid Waste management": Recycle,
  "Free Wifi": Wifi,
  Amphitheater: TentTree,
  "Electical Vehical Charging Point": PlugZap,
  "Jogging Track": Footprints,
  "Mini Theater": Theater,
  "Pet Play Area": Dog,
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
            const Icon = ICONS[a.amenity_name] || Sparkles;
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
