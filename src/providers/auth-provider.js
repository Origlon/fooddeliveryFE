"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

import { sanitizeUser } from "./auth-user";

const AuthContext = createContext(null);

const STORAGE_KEY = "food-delivery:user";
const CHANGE_EVENT = "food-delivery:auth-change";

function subscribe(callback) {
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return undefined;
}

export function AuthProvider({ children }) {
  const router = useRouter();

  const rawUser = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isLoading = rawUser === undefined;

  const user = useMemo(() => {
    try {
      return sanitizeUser(JSON.parse(rawUser || "null"));
    } catch {
      return null;
    }
  }, [rawUser]);

  const login = (returnedUser) => {
    const safeUser = sanitizeUser(returnedUser);

    if (!safeUser) {
      throw new Error("Invalid user response. Check the login API.");
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    } catch {
      throw new Error(
        "Browser storage is unavailable. Enable site storage and retry.",
      );
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));

    router.replace(
      safeUser.role === "admin" ? "/admin/dishes" : "/",
    );
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      throw new Error("Could not clear browser storage.");
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));

    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Wrap the root layout with AuthProvider.");
  }

  return context;
}