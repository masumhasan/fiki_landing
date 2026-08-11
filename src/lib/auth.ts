const TOKEN_KEY = "fiki_passenger_token";
const USER_KEY = "fiki_passenger_user";

export interface PassengerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  accountStatus: string;
}

export function savePassengerSession(user: PassengerUser, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getPassengerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getPassengerUser(): PassengerUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PassengerUser;
  } catch {
    return null;
  }
}

export function clearPassengerSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isPassengerAuthenticated(): boolean {
  return !!getPassengerToken();
}
