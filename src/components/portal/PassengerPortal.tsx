"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, RefreshCw, User, ShieldAlert, Phone } from "lucide-react";
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
  return (
    <section className="rounded-2xl border border-destructive/20 bg-destructive/4 p-4">
      <div className="flex items-center gap-2 text-destructive">
        <ShieldAlert aria-hidden="true" className="size-4" />
        <h2 className="text-sm font-semibold">Emergency contact</h2>
      </div>
      <p className="mt-3 text-xs font-semibold text-foreground">
        FIKI Dispatch
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Available 24 hours, 7 days a week
      </p>
      <a
        href={`tel:${dispatchNumber}`}
        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-destructive/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
      >
        <Phone aria-hidden="true" className="size-3.5" />
        Call dispatch
      </a>
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
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Portal
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage your ride requests and respond to quotes from FIKI Transit.
          </p>
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
