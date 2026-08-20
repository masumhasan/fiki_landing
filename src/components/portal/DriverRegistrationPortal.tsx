"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCheck, ShieldAlert, Phone, RefreshCw, Car, Check, CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPassengerToken, getPassengerUser, clearPassengerSession, PassengerUser } from "@/lib/auth";
import { getMyApplicationApi } from "@/lib/api";

interface Vehicle {
  _id: string;
  modelName: string;
  licensePlate: string;
  year?: number;
}

interface Application {
  _id: string;
  applicationId: string;
  status: "PENDING_REVIEW" | "INTERVIEW_SCHEDULED" | "APPROVED" | "REJECTED";
  position?: string;
  positionType: string;
  submittedDate: string;
  assignedVehicleId?: Vehicle;
}

function EmergencyPanel({ dispatchNumber }: { dispatchNumber: string }) {
  return (
    <section className="rounded-2xl border border-destructive/20 bg-destructive/4 p-5 shadow-[0_4px_14px_rgba(239,68,68,.02)]">
      <div className="flex items-center gap-2 text-destructive">
        <ShieldAlert aria-hidden="true" className="size-4.5" />
        <h2 className="text-sm font-semibold">Emergency Support</h2>
      </div>
      <p className="mt-3 text-xs font-bold text-foreground">
        FIKI Dispatch
      </p>
      <p className="mt-1 text-xs text-muted-foreground leading-normal">
        Available 24 hours a day, 7 days a week for any dispatch questions.
      </p>
      <a
        href={`tel:${dispatchNumber}`}
        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-destructive/85"
      >
        <Phone aria-hidden="true" className="size-3.5" />
        Call Dispatch
      </a>
    </section>
  );
}

export function DriverRegistrationPortal() {
  const router = useRouter();
  const [user, setUser] = useState<PassengerUser | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dispatchNumber, setDispatchNumber] = useState("+18003454825");

  const loadApplication = useCallback(async () => {
    const token = getPassengerToken();
    if (!token) {
      router.replace("/driver-login");
      return;
    }

    setLoading(true);
    setError("");

    import("@/lib/api").then(({ getDispatchNumberApi }) => {
      getDispatchNumberApi(token).then((res) => {
        if (res.success && res.data) {
          setDispatchNumber(res.data.dispatchNumber);
        }
      });
    });

    const res = await getMyApplicationApi(token);
    setLoading(false);

    if (res.success) {
      setApp(res.data);
    } else if (res.error?.code === "TOKEN_EXPIRED" || res.error?.code === "UNAUTHENTICATED") {
      clearPassengerSession();
      router.replace("/driver-login");
    } else {
      setError(res.error?.message || "Failed to load application status.");
    }
  }, [router]);

  useEffect(() => {
    const u = getPassengerUser();
    if (!u) {
      router.replace("/driver-login");
      return;
    }
    if (u.role !== "DRIVER") {
      router.replace("/");
      return;
    }
    setUser(u);
    loadApplication();
  }, [loadApplication, router]);

  const timelineSteps = [
    { label: "Account Created", done: true, current: false, time: "Step Completed" },
    { label: "Submit Application", done: !!app, current: !app, time: app ? "Completed" : "Action Required" },
    {
      label: "Background Audit",
      done: app?.status === "INTERVIEW_SCHEDULED" || app?.status === "APPROVED",
      current: app?.status === "PENDING_REVIEW",
      time: app?.status === "PENDING_REVIEW" ? "In Progress" : app ? "Cleared" : "Pending",
    },
    {
      label: "Interview Phase",
      done: app?.status === "APPROVED",
      current: app?.status === "INTERVIEW_SCHEDULED",
      time: app?.status === "INTERVIEW_SCHEDULED" ? "Scheduled" : "Pending",
    },
    {
      label: "Vehicle & Approval",
      done: app?.status === "APPROVED",
      current: false,
      time: app?.status === "APPROVED" ? "Assigned" : "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Welcome */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Driver Portal
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm">
              Wisconsin Driver Onboarding & Registration Dashboard
            </p>
          </div>
          <button
            onClick={loadApplication}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:text-primary cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Status
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="h-32 rounded-2xl bg-muted animate-pulse" />
            <div className="h-64 rounded-2xl bg-muted animate-pulse" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
            <div className="space-y-6">
              {/* Timeline Status */}
              <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
                <h2 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider text-muted-foreground">
                  Registration Checklist
                </h2>
                <ol className="grid gap-4 sm:grid-cols-5 relative">
                  {timelineSteps.map((step, idx) => (
                    <li key={idx} className="flex flex-col items-center text-center space-y-2">
                      <span
                        className={`grid size-8 place-items-center rounded-full border-2 transition-all ${
                          step.done
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : step.current
                            ? "border-amber-500 bg-amber-50 text-amber-600 ring-4 ring-amber-500/10"
                            : "border-muted-foreground/30 bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.done ? <Check className="size-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${step.done || step.current ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground/75 mt-0.5">{step.time}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Dynamic Status Dashboard */}
              {!app ? (
                // NOT SUBMITTED
                <section className="rounded-2xl border border-amber-200 bg-amber-50/20 p-6 md:p-8 space-y-5">
                  <div className="size-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Welcome to FIKI Transit!</h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Your driver account has been created successfully. The final step to join our professional non-medical transportation team is to submit your job application form.
                    </p>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-2 max-w-lg leading-normal">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Input your credentials, educational details, references, and driving history.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Complete digital signatures for security consents and background check authorization.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/job-application">
                      <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 h-11">
                        Begin Job Application Form
                      </Button>
                    </Link>
                  </div>
                </section>
              ) : (
                // SUBMITTED (PENDING_REVIEW, INTERVIEW_SCHEDULED, APPROVED, REJECTED)
                <div className="space-y-6">
                  {/* Status Overview Card */}
                  <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.02)] space-y-6">
                    <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Application Details</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">ID: {app.applicationId}</p>
                      </div>
                      <span
                        className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                          app.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : app.status === "REJECTED"
                            ? "bg-red-50 text-red-600"
                            : app.status === "INTERVIEW_SCHEDULED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {app.status === "PENDING_REVIEW" && (
                        <div className="space-y-3">
                          <p className="text-sm text-foreground leading-relaxed">
                            Thank you for submitting your driver job application! Your files and background credentials are currently undergoing review.
                          </p>
                          <p className="text-xs text-muted-foreground leading-normal">
                            Our compliance team will audit your license record, credentials, and references. We will notify you here as soon as the background checks clear.
                          </p>
                        </div>
                      )}

                      {app.status === "INTERVIEW_SCHEDULED" && (
                        <div className="space-y-3">
                          <p className="text-sm text-foreground leading-relaxed">
                            Great news! Your background check has cleared, and you have been moved to the **Interview Phase**.
                          </p>
                          <p className="text-xs text-muted-foreground leading-normal">
                            Our recruitment managers are reviewing scheduling availability and will contact you via phone or email shortly to confirm your interview timing.
                          </p>
                        </div>
                      )}

                      {app.status === "APPROVED" && (
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <p className="text-sm text-foreground leading-relaxed font-semibold">
                              Congratulations! Your application is Approved and your driver profile is Active.
                            </p>
                            <p className="text-xs text-muted-foreground leading-normal">
                              We are excited to have you on board! You have been successfully assigned a vehicle. You can now access your shifts, ride schedules, and log in to the main Driver Portal.
                            </p>
                          </div>

                          {app.assignedVehicleId && (
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 flex items-center gap-4">
                              <div className="size-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <Car className="size-5.5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Assigned Vehicle</p>
                                <h3 className="text-sm font-bold text-foreground mt-0.5">{app.assignedVehicleId.modelName}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Plate: <strong className="text-foreground">{app.assignedVehicleId.licensePlate}</strong> {app.assignedVehicleId.year ? `· Year: ${app.assignedVehicleId.year}` : ""}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                            <a href="http://localhost:3002" target="_blank" rel="noopener noreferrer">
                              <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 h-11 flex items-center gap-2">
                                <span>Launch Driver Portal</span>
                                <ExternalLink className="size-4" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      )}

                      {app.status === "REJECTED" && (
                        <div className="space-y-3">
                          <p className="text-sm text-foreground leading-relaxed">
                            Thank you for your interest in joining FIKI Transit.
                          </p>
                          <p className="text-xs text-muted-foreground leading-normal">
                            Unfortunately, we are unable to proceed with your driver application at this time. We appreciate you taking the time to apply and wish you the best in your career.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <EmergencyPanel dispatchNumber={dispatchNumber} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
