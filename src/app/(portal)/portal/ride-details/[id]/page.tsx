"use client";

import {
  ArrowLeft,
  ClipboardCheck,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Route,
  Accessibility,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getPassengerTripDetailApi } from "@/lib/api";
import { getPassengerToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

const card =
  "overflow-hidden rounded-xl border border-[#e1e6ee] bg-white shadow-[0_4px_14px_rgba(15,37,74,.04)]";

function statusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case "REQUESTED": return { text: "Pending Approval", color: "amber" };
    case "QUOTE_SENT": return { text: "Quote Received", color: "blue" };
    case "QUOTE_ACCEPTED": return { text: "Quote Accepted", color: "green" };
    case "QUOTE_DENIED": return { text: "Quote Declined", color: "red" };
    case "QUOTE_COUNTERED": return { text: "Counter Offer", color: "violet" };
    case "ACCEPTED": return { text: "Booking Confirmed", color: "green" };
    case "DRIVER_ARRIVING": return { text: "Driver Arriving", color: "blue" };
    case "DRIVER_ARRIVED": return { text: "Driver Arrived", color: "blue" };
    case "IN_PROGRESS": return { text: "In Progress", color: "blue" };
    case "COMPLETED": return { text: "Completed", color: "green" };
    case "CANCELLED": return { text: "Cancelled", color: "red" };
    default: return { text: status, color: "amber" };
  }
}

function formatTimeTo12Hour(timeStr?: string): string {
  if (!timeStr) return "";
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function PassengerRideDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [childTrips, setChildTrips] = useState<any[]>([]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const token = getPassengerToken();
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await getPassengerTripDetailApi(token, id);
      if (res.success && res.data) {
        setTrip(res.data);
        setChildTrips(res.data.childTrips || []);
      } else {
        setTrip(null);
      }
    } catch (err) {
      setTrip(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <LoaderCircle className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen">
        <p className="text-sm font-semibold text-slate-700">Trip not found.</p>
        <Link href="/portal" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">← Back to Portal</Link>
      </div>
    );
  }

  const { text: statusText, color: statusColor } = statusLabel(trip.status);
  const isRoundTrip = trip.tripType === "round-trip";
  
  const effectiveFare =
    typeof trip?.fare === "number" && !isNaN(trip.fare) && trip.fare > 0
      ? trip.fare
      : typeof trip?.quotedFare === "number" && !isNaN(trip.quotedFare) && trip.quotedFare > 0
      ? trip.quotedFare
      : 0;

  const sDate = trip.startDate || trip.pickupDate || trip.recurringStartDate;
  const submittedAt = new Date(trip.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  const scheduledAt = sDate
    ? new Date(sDate + (sDate.includes("T") ? "" : "T00:00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      (trip.pickupTime ? ` at ${formatTimeTo12Hour(trip.pickupTime)}` : "")
    : "—";
  
  const displayFare = typeof trip.fare === "number" && trip.fare > 0 ? `$${trip.fare.toFixed(2)}` : "—";
  
  const passName = trip.fullName || trip.passengerId?.fullName || "Passenger";
  const initials = passName.split(" ").length >= 2
    ? `${passName.split(" ")[0][0]}${passName.split(" ")[1][0]}`.toUpperCase()
    : passName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#172033]">Ride Request Details</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Review all details for this request.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchTrip} className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
              <RefreshCw className="size-4" /> Refresh
            </button>
            <Link href="/portal" className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-700">
              <ArrowLeft className="size-4" /> Back to Portal
            </Link>
          </div>
        </header>

        {/* Overview Stats */}
        <section className={`${card} mb-4 grid gap-4 p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`}>
          <div className="rounded-lg bg-slate-50 p-3 border">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
               <ClipboardCheck className="size-3.5" /> Status
             </div>
             <p className={`text-sm font-bold text-${statusColor}-700`}>{statusText}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">Request ID</div>
             <p className="text-sm font-bold text-slate-900">{id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">Submitted</div>
             <p className="text-sm font-bold text-slate-900">{submittedAt}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">Scheduled</div>
             <p className="text-sm font-bold text-slate-900">{scheduledAt}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">Fare</div>
             <p className="text-sm font-bold text-slate-900">{displayFare}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">Quoted Fare</div>
             <p className="text-sm font-bold text-slate-900">{trip.quotedFare ? `$${trip.quotedFare.toFixed(2)}` : "—"}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Info */}
            <section className={card}>
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Route className="size-4 text-blue-600" /> Trip Information
                </h2>
              </div>
              <div className="p-5">
                <div className="grid gap-6 sm:grid-cols-2 mb-6">
                  <div><p className="text-xs font-bold text-slate-500 mb-1">Trip Type</p><p className="text-sm font-semibold capitalize text-slate-900">{trip.tripType.replace("-", " ")}</p></div>
                  <div><p className="text-xs font-bold text-slate-500 mb-1">Schedule</p><p className="text-sm font-semibold capitalize text-slate-900">{trip.schedule.replace("-", " ")}</p></div>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-y-3 before:left-3.5 before:w-px before:bg-slate-200">
                  <div className="relative flex gap-4">
                    <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm"><MapPin className="size-3" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Pickup</p>
                      <p className="text-sm font-semibold text-slate-900">{trip.pickupLocation?.address || "—"}</p>
                      {trip.pickupTime && <p className="text-xs font-medium text-slate-500 mt-0.5">Time: {formatTimeTo12Hour(trip.pickupTime)}</p>}
                    </div>
                  </div>
                  <div className="relative flex gap-4">
                    <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow-sm"><MapPin className="size-3" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Destination</p>
                      <p className="text-sm font-semibold text-slate-900">{trip.dropoffLocation?.address || "—"}</p>
                    </div>
                  </div>
                </div>

                {isRoundTrip && (
                  <div className="mt-8 space-y-6 relative before:absolute before:inset-y-3 before:left-3.5 before:w-px before:bg-slate-200">
                    <div className="relative flex gap-4">
                      <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-4 border-white bg-amber-100 text-amber-600 shadow-sm"><MapPin className="size-3" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-500">Return Pickup</p>
                        <p className="text-sm font-semibold text-slate-900">{trip.returnPickupLocation?.address || trip.dropoffLocation?.address || "—"}</p>
                        {trip.returnPickupTime && <p className="text-xs font-medium text-slate-500 mt-0.5">Time: {formatTimeTo12Hour(trip.returnPickupTime)}</p>}
                      </div>
                    </div>
                    <div className="relative flex gap-4">
                      <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow-sm"><MapPin className="size-3" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-500">Return Destination</p>
                        <p className="text-sm font-semibold text-slate-900">{trip.returnDropoffLocation?.address || trip.pickupLocation?.address || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Mobility */}
            <section className={card}>
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Accessibility className="size-4 text-violet-600" /> Mobility & Needs
                </h2>
              </div>
              <div className="p-5 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-500 mb-2">Options</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.mobilityOptions?.length > 0 ? (
                      trip.mobilityOptions.map((opt: string) => (
                        <span key={opt} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{opt}</span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">None selected</span>
                    )}
                  </div>
                </div>
                {trip.specialInstructions && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold text-slate-500 mb-1">Special Instructions</p>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{trip.specialInstructions}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Passenger Info */}
            <section className={card}>
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <UserRound className="size-4 text-teal-600" /> Passenger
                </h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex size-14 items-center justify-center rounded-full bg-teal-100 text-lg font-black text-teal-700 shadow-inner">
                    {initials}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{passName}</p>
                    <p className="text-sm text-slate-500">{trip.phoneNumber || trip.passengerId?.phone || "—"}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Trip Legs */}
        {childTrips.length > 0 && (
          <div className="mt-8">
             <h2 className="text-lg font-bold text-slate-800 mb-4">Trip Legs & Real-Time Status</h2>
             <div className="grid gap-3">
               {childTrips.map((c: any, index: number) => (
                 <div key={c._id} className={`${card} p-4 flex items-center justify-between`}>
                   <div>
                     <p className="text-sm font-bold text-slate-900">{c.isReturnLeg ? "Return Leg" : "Outbound Leg"}</p>
                     <p className="text-xs text-slate-500">
                       Date: {new Date(c.pickupDate).toLocaleDateString("en-US")} at {formatTimeTo12Hour(c.pickupTime)}
                     </p>
                   </div>
                   <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusLabel(c.status).color === 'green' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {statusLabel(c.status).text}
                      </span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
