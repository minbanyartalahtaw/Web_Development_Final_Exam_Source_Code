//src/app/api/auth/login/route.js

import bcrypt from "bcrypt";
import { getClientPromise } from "@/lib/mongodb";
import { signJWT, tokenCookieOptions } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { DB_NAME, TOKEN_COOKIE } from "@/lib/constant";
import { toPublicUser } from "@/lib/user";
import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// POST /api/auth/login  { username, password }  (username may also be the email)
export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return errorResponse("Username and password are required", 400);
    }

    const client = await getClientPromise();
    const user = await client
      .db(DB_NAME)
      .collection("users")
      .findOne({ $or: [{ username: username }, { email: username }] });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse("Invalid username or password", 401);
    }

    const response = successResponse(
      {
        message: "Login successful",
        user: toPublicUser(user),
      },
      200,
    );
    response.cookies.set(TOKEN_COOKIE, signJWT(user), tokenCookieOptions());
    return response;
  } catch (error) {
    printExceptionLog("POST /api/auth/login", error);
    return errorResponse("Login failed", 500);
  }
}
