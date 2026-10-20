import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import {
  TOKEN_COOKIE,
  TOKEN_MAX_AGE,
  X_HEADER_USER_EMAIL,
  X_HEADER_USER_ID,
  X_HEADER_USER_NAME,
  X_HEADER_USER_ROLE,
} from "./constant";
import { errorResponse } from "./utils";

const JWT_SECRET = process.env.JWT_SECRET;

export function signJWT(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_MAX_AGE },
  );
}

export function verifyJWT(req) {
  try {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;

    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Frontend and backend are on different domains in production,
// so the cookie must be SameSite=None + Secure to be sent cross-site.
export function tokenCookieOptions(maxAge = TOKEN_MAX_AGE) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: maxAge,
  };
}

// Current user as forwarded by proxy.js (call only in protected routes)
export async function getCurrentUser() {
  const h = await headers();
  return {
    id: h.get(X_HEADER_USER_ID),
    username: h.get(X_HEADER_USER_NAME),
    email: h.get(X_HEADER_USER_EMAIL),
    role: h.get(X_HEADER_USER_ROLE),
  };
}

// Returns an error response if the current user does not have one of the roles,
// otherwise null.  Usage: const denied = requireRole(user, ROLE_TEACHER); if (denied) return denied;
export function requireRole(user, ...roles) {
  if (!roles.includes(user.role)) {
    return errorResponse(`Forbidden: ${roles.join(" or ")} only`, 403);
  }
  return null;
}
