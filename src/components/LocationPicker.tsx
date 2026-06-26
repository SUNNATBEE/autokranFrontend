"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LMap, Marker as LMarker } from "leaflet";
import { Loader2, LocateFixed, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const TASHKENT: [number, number] = [41.2995, 69.2401];

export interface LocationValue {
  address: string;
  lat: number | null;
  lng: number | null;
}

// Brand-coloured SVG pin (avoids Leaflet's default-icon asset issues).
const PIN_SVG =
  '<svg width="34" height="44" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M12 0C5.37 0 0 5.37 0 12c0 8.25 12 20 12 20s12-11.75 12-20C24 5.37 18.63 0 12 0z" fill="#facc15"/>' +
  '<circle cx="12" cy="12" r="5" fill="#121214"/></svg>';

export const LocationPicker = ({
  onChange,
}: {
  onChange: (v: LocationValue) => void;
}) => {
  const t = useTranslations("Location");
  const mapEl = useRef<HTMLDivElement>(null);
  const mapInst = useRef<LMap | null>(null);
  const marker = useRef<LMarker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&accept-language=ru`,
        { headers: { Accept: "application/json" } }
      );
      const data = await res.json();
      const addr: string = data.display_name || "";
      setAddress(addr);
      onChangeRef.current({ address: addr, lat, lng });
    } catch {
      onChangeRef.current({ address, lat, lng });
    } finally {
      setGeocoding(false);
    }
  };

  // Initialise the Leaflet map once (browser only — dynamic import avoids SSR).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("leaflet");
      // Handle both ESM-namespace and CJS-default interop shapes.
      const L = ((mod as { default?: typeof import("leaflet") }).default ??
        mod) as typeof import("leaflet");
      if (cancelled || !mapEl.current || mapInst.current) return;

      const map = L.map(mapEl.current, { attributionControl: false }).setView(
        TASHKENT,
        12
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: PIN_SVG,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
      });
      const mk = L.marker(TASHKENT, { draggable: true, icon }).addTo(map);

      mk.on("dragend", () => {
        const p = mk.getLatLng();
        reverseGeocode(p.lat, p.lng);
      });
      map.on("click", (e) => {
        mk.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapInst.current = map;
      marker.current = mk;
      // Modal mount/animation can leave the map mis-sized — fix after paint.
      setTimeout(() => map.invalidateSize(), 250);
    })();

    return () => {
      cancelled = true;
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInst.current && marker.current) {
          mapInst.current.setView([latitude, longitude], 16);
          marker.current.setLatLng([latitude, longitude]);
        }
        reverseGeocode(latitude, longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground/40 font-medium">{t("hint")}</span>
        <button
          type="button"
          onClick={useMyLocation}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
        >
          {locating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <LocateFixed size={14} />
          )}
          {t("myLocation")}
        </button>
      </div>

      <div
        ref={mapEl}
        className="h-52 w-full rounded-2xl overflow-hidden border border-foreground/10 z-0"
      />

      {/* Resolved address (editable so the customer can refine it) */}
      <div className="relative">
        <MapPin
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20"
          size={20}
        />
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onChangeRef.current({
              address: e.target.value,
              lat: coords?.lat ?? null,
              lng: coords?.lng ?? null,
            });
          }}
          placeholder={t("addressPlaceholder")}
          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 pl-12 pr-10 focus:border-brand-primary outline-none font-medium text-foreground"
        />
        {geocoding && (
          <Loader2
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-primary"
          />
        )}
      </div>
    </div>
  );
};
