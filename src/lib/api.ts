export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function registerRiderApi(name: string, email: string, password: string, phone?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }),
    });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to registration server",
      },
    };
  }
}

export async function getFareEstimateApi(pickupAddress: string, dropoffAddress: string, mobilityType = "STANDARD") {
  try {
    const res = await fetch(`${API_BASE_URL}/landing/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pickupAddress, dropoffAddress, mobilityType }),
    });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to fetch fare estimate",
      },
    };
  }
}
