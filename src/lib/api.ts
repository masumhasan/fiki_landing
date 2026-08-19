export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function registerRiderApi(name: string, email: string, password: string, phone?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, role: "USER" }),
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to connect to registration server" } };
  }
}

export async function registerDriverApi(name: string, email: string, password: string, phone?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, role: "DRIVER" }),
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to connect to registration server" } };
  }
}

export async function submitJobApplicationApi(data: Record<string, any>) {
  try {
    const res = await fetch(`${API_BASE_URL}/landing/job-application`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to submit job application" } };
  }
}

export async function loginPassengerApi(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to connect to authentication server" } };
  }
}

export async function getMeApi(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to fetch user profile" } };
  }
}

// ── Fare Estimate ─────────────────────────────────────────────────────────────

export async function getFareEstimateApi(pickupAddress: string, dropoffAddress: string, mobilityType = "STANDARD") {
  try {
    const res = await fetch(`${API_BASE_URL}/landing/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickupAddress, dropoffAddress, mobilityType }),
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to fetch fare estimate" } };
  }
}

// ── Trips / Portal ────────────────────────────────────────────────────────────

export async function getMyTripsApi(token: string, page = 1, limit = 20) {
  try {
    const res = await fetch(`${API_BASE_URL}/trips/me?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to fetch trips" } };
  }
}

export async function cancelTripApi(token: string, tripId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to cancel trip" } };
  }
}

export async function respondToQuoteApi(
  token: string,
  tripId: string,
  action: "ACCEPT" | "DENY" | "COUNTER",
  counterOffer?: number,
  note?: string,
) {
  try {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/quote/respond`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, counterOffer, note }),
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to respond to quote" } };
  }
}

export async function getDispatchNumberApi(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/settings/dispatch-number`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, error: { code: "NETWORK_ERROR", message: "Failed to fetch dispatch number" } };
  }
}
