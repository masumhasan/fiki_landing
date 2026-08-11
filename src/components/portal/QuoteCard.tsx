"use client";

import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { respondToQuoteApi } from "@/lib/api";
import { getPassengerToken } from "@/lib/auth";

interface QuoteCardProps {
  trip: {
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
  };
  onUpdated: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  REQUESTED: { label: "Awaiting Quote", color: "bg-amber-100 text-amber-800" },
  QUOTE_SENT: { label: "Quote Received", color: "bg-blue-100 text-blue-800" },
  QUOTE_ACCEPTED: { label: "Quote Accepted", color: "bg-green-100 text-green-800" },
  QUOTE_DENIED: { label: "Quote Declined", color: "bg-red-100 text-red-800" },
  QUOTE_COUNTERED: { label: "Counter Offered", color: "bg-purple-100 text-purple-800" },
  ACCEPTED: { label: "Booking Confirmed", color: "bg-green-100 text-green-800" },
  DRIVER_ARRIVING: { label: "Driver Arriving", color: "bg-blue-100 text-blue-800" },
  DRIVER_ARRIVED: { label: "Driver Arrived", color: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-indigo-100 text-indigo-800" },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export function QuoteCard({ trip, onUpdated }: QuoteCardProps) {
  const [loading, setLoading] = useState<"ACCEPT" | "DENY" | "COUNTER" | null>(null);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [error, setError] = useState("");

  const statusInfo = STATUS_LABELS[trip.status] ?? { label: trip.status, color: "bg-gray-100 text-gray-700" };
  const isQuotePending = trip.status === "QUOTE_SENT";

  async function respond(action: "ACCEPT" | "DENY" | "COUNTER", counterOffer?: number, note?: string) {
    setError("");
    setLoading(action);
    const token = getPassengerToken();
    if (!token) { setError("Session expired. Please sign in again."); setLoading(null); return; }

    const res = await respondToQuoteApi(token, trip._id, action, counterOffer, note);
    setLoading(null);

    if (res.success) {
      setShowCounterModal(false);
      onUpdated();
    } else {
      setError(res.error?.message || "Action failed. Please try again.");
    }
  }

  async function submitCounter() {
    const amount = parseFloat(counterAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid counter amount.");
      return;
    }
    await respond("COUNTER", amount, counterNote || undefined);
  }

  return (
    <>
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Requested {new Date(trip.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            {trip.scheduledTime && (
              <p className="text-xs font-medium text-foreground">
                Scheduled: {new Date(trip.scheduledTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </p>
            )}
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Route */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 size-2 rounded-full bg-primary flex-shrink-0" aria-hidden />
            <p className="text-sm text-foreground leading-snug">{trip.pickupLocation.address}</p>
          </div>
          <div className="ml-1 h-4 w-px bg-border" aria-hidden />
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 size-2 rounded-full bg-secondary flex-shrink-0" aria-hidden />
            <p className="text-sm text-foreground leading-snug">{trip.dropoffLocation.address}</p>
          </div>
        </div>

        {/* Quote details */}
        {trip.quotedFare !== undefined && (
          <div className="mt-4 rounded-xl bg-muted px-4 py-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Quoted Fare</span>
              <span className="text-lg font-bold text-primary">${trip.quotedFare.toFixed(2)}</span>
            </div>
            {trip.quoteNote && (
              <p className="text-xs text-muted-foreground">{trip.quoteNote}</p>
            )}
            {trip.counterOffer !== undefined && (
              <div className="flex items-center justify-between pt-1 border-t border-border mt-2">
                <span className="text-xs text-muted-foreground">Your Counter Offer</span>
                <span className="text-sm font-semibold text-purple-700">${trip.counterOffer.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {trip.fare !== undefined && trip.status === "QUOTE_ACCEPTED" && (
          <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-green-800">Agreed Fare</span>
              <span className="text-lg font-bold text-green-700">${trip.fare.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p role="alert" className="mt-3 text-xs text-red-600 font-medium">{error}</p>
        )}

        {/* Actions — only when quote is pending response */}
        {isQuotePending && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => respond("ACCEPT")}
              disabled={loading !== null}
              className="flex-1 min-w-24 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer font-semibold"
            >
              {loading === "ACCEPT" ? <LoaderCircle className="size-4 animate-spin" /> : "Accept"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setError(""); setShowCounterModal(true); }}
              disabled={loading !== null}
              className="flex-1 min-w-24 rounded-full border-primary text-primary hover:bg-primary/5 cursor-pointer font-semibold"
            >
              Counter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => respond("DENY")}
              disabled={loading !== null}
              className="flex-1 min-w-24 rounded-full border-destructive text-destructive hover:bg-destructive/5 cursor-pointer font-semibold"
            >
              {loading === "DENY" ? <LoaderCircle className="size-4 animate-spin" /> : "Decline"}
            </Button>
          </div>
        )}
      </article>

      {/* Counter offer modal */}
      {showCounterModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="counter-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCounterModal(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 id="counter-title" className="text-lg font-bold text-foreground">Make a Counter Offer</h3>
              <button
                onClick={() => setShowCounterModal(false)}
                aria-label="Close"
                className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Admin quoted <span className="font-semibold text-foreground">${trip.quotedFare?.toFixed(2)}</span>. Enter your preferred amount below.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="counterAmount" className="mb-2 block text-sm font-semibold text-foreground">
                  Your Offer (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium" aria-hidden>$</span>
                  <input
                    id="counterAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    className="h-12 w-full rounded-full border border-input bg-muted pl-8 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="counterNote" className="mb-2 block text-sm font-semibold text-foreground">
                  Note <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="counterNote"
                  placeholder="Explain your offer…"
                  rows={3}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {error && <p role="alert" className="text-xs text-red-600 font-medium">{error}</p>}

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setShowCounterModal(false)}
                  className="flex-1 rounded-full cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitCounter}
                  disabled={loading === "COUNTER"}
                  className="flex-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer font-semibold"
                >
                  {loading === "COUNTER" ? <LoaderCircle className="size-4 animate-spin" /> : "Submit Offer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
