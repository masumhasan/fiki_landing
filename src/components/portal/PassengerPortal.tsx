"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, RefreshCw, User, Phone, Headset, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteCard } from "@/components/portal/QuoteCard";
import { getMyTripsApi } from "@/lib/api";
import { clearPassengerSession, getPassengerToken, getPassengerUser, PassengerUser } from "@/lib/auth";

interface Trip {
  _id: string;
  status: string;
  pickupLocation: { address: string };
  dropoffLocation: { address: string };
  quotedFare?: number;
  quoteNote?: string;
  counterOffer?: number;
  fare?: number;
  createdAt: string;
  scheduledTime?: string;
}

const ACTIVE_STATUSES = new Set(["REQUESTED", "QUOTE_SENT", "QUOTE_COUNTERED", "QUOTE_ACCEPTED", "ACCEPTED", "DRIVER_ARRIVING", "DRIVER_ARRIVED", "IN_PROGRESS"]);

function EmergencyPanel({ dispatchNumber }: { dispatchNumber: string }) {
  const cleanDispatch = dispatchNumber ? dispatchNumber.replace(/[^\d+]/g, "") : "+18003454825";

  return (
    <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-red-200/80 bg-[#fffafa] p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(239,68,68,0.04)]">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="h-[1.5px] flex-1 bg-red-200/90 rounded-full" />
        <div className="flex items-center gap-1.5 shrink-0">
          <svg className="size-5 text-[#c91c1c] drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
            <path d="M11 7h2v3h3v2h-3v3h-2v-3H8v-2h3V7z" fill="white" />
          </svg>
          <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0a1e3b]">
            Emergency
          </h2>
        </div>
        <div className="h-[1.5px] flex-1 bg-red-200/90 rounded-full" />
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:gap-3">
        <a
          href="tel:911"
          title="Call 911 (Emergency)"
          className="group flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-red-300/90 bg-white px-2 py-3 sm:px-3 sm:py-3.5 text-center transition-all hover:border-red-500 hover:bg-red-50/30 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full bg-[#c91c1c] text-white">
              <Phone className="size-3 sm:size-3.5 fill-white text-white" />
            </span>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#c91c1c]">
              911
            </span>
          </div>
          <span className="mt-1 text-[11px] sm:text-xs font-medium text-slate-500 group-hover:text-slate-700">
            Emergency
          </span>
        </a>

        <a
          href={`tel:${cleanDispatch}`}
          title={dispatchNumber ? `Call Dispatch (${dispatchNumber})` : "Call Dispatch"}
          className="group flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-[#c91c1c] px-2 py-3 sm:px-3 sm:py-3.5 text-center text-white transition-all hover:bg-[#b31818] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full border border-white/80 text-white">
            <Headset className="size-3.5 sm:size-4 text-white" />
          </div>
          <span className="mt-1 text-xs sm:text-sm font-bold text-white">
            Call Dispatch
          </span>
        </a>
      </div>
    </section>
  );
}

export function PassengerPortal() {
  const router = useRouter();
  const [user, setUser] = useState<PassengerUser | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"active" | "history">("active");
  const [dispatchNumber, setDispatchNumber] = useState("+18003454825");

  const loadTrips = useCallback(async () => {
    const token = getPassengerToken();
    if (!token) { router.replace("/login"); return; }

    setLoading(true);
    setError("");

    import("@/lib/api").then(({ getDispatchNumberApi }) => {
      getDispatchNumberApi(token).then((res) => {
        if (res.success && res.data) {
          setDispatchNumber(res.data.dispatchNumber);
        }
      });
    });

    const res = await getMyTripsApi(token);
    setLoading(false);

    if (res.success) {
      setTrips(res.data.trips ?? []);
    } else if (res.error?.code === "TOKEN_EXPIRED" || res.error?.code === "UNAUTHENTICATED") {
      clearPassengerSession();
      router.replace("/login");
    } else {
      setError(res.error?.message || "Failed to load trips");
    }
  }, [router]);

  useEffect(() => {
    const u = getPassengerUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    loadTrips();
  }, [loadTrips, router]);

  function handleSignOut() {
    clearPassengerSession();
    router.replace("/");
  }

  const activeTrips = trips.filter((t) => ACTIVE_STATUSES.has(t.status));
  const pastTrips = trips.filter((t) => !ACTIVE_STATUSES.has(t.status));
  const pendingQuotes = trips.filter((t) => t.status === "QUOTE_SENT").length;
  const displayTrips = tab === "active" ? activeTrips : pastTrips;

  return (
    <div className="min-h-screen bg-background">


      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Welcome & Request Another Ride CTA */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Portal
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
              Manage your ride requests and respond to quotes from FIKI Transit.
            </p>
          </div>
          <Link href="/request-ride" className="shrink-0">
            <Button className="rounded-xl bg-[#FBC43C] hover:bg-[#eab32b] text-foreground font-bold shadow-sm px-5 py-2.5 h-10 text-sm cursor-pointer transition-all hover:shadow active:scale-[0.98] inline-flex items-center gap-2">
              <Plus className="size-4 stroke-[2.5]" />
              Request Another Ride
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Requests", value: trips.length },
            { label: "Active", value: activeTrips.length },
            { label: "Quotes Pending", value: pendingQuotes, highlight: pendingQuotes > 0 },
            { label: "Completed", value: trips.filter((t) => t.status === "COMPLETED").length },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
            >
              <p className={`text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA banner when no trips */}
        {trips.length === 0 && !loading && (
          <div className="mb-8 rounded-2xl border border-border bg-secondary/5 px-6 py-8 text-center">
            <p className="text-lg font-semibold text-foreground">No ride requests yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit a ride request to get started. Our team will send you a quote within 24 hours.
            </p>
            <Link href="/request-ride">
              <Button className="mt-5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer font-semibold">
                Request A Ride
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
          <div className="min-w-0">
            {/* Tabs + Refresh */}
        <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
          <div role="tablist" className="flex gap-1 rounded-xl bg-muted p-1">
            {(["active", "history"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer capitalize ${
                  tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "active" ? `Active (${activeTrips.length})` : `History (${pastTrips.length})`}
              </button>
            ))}
          </div>

          <button
            onClick={loadTrips}
            disabled={loading}
            aria-label="Refresh trips"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Trip list */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : displayTrips.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            {tab === "active" ? "No active requests." : "No past trips yet."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {displayTrips.map((trip) => (
              <QuoteCard key={trip._id} trip={trip} onUpdated={loadTrips} />
            ))}
          </div>
        )}
          </div>

          <aside className="space-y-4">
            <EmergencyPanel dispatchNumber={dispatchNumber} />
          </aside>
        </div>
      </main>
    </div>
  );
}
