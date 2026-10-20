//src/context/UseContext.jsx

import { createContext, useEffect, useRef, useState } from "react";

// Strip trailing slashes so "https://x.app/" + "/api/..." never becomes "//api"
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkedRef = useRef(false);

  // Restore the session from the httpOnly cookie on page load
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setUser(null);
  }

  // Wrapper for calling protected APIs: always sends the cookie, returns the
  // parsed JSON, throws an Error with the backend message on failure,
  // and drops the local session if the backend says 401.
  async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (res.status === 401) {
      setUser(null);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, apiFetch }}>
      {children}
    </UserContext.Provider>
  );
}
