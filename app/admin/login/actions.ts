"use server";

import { cookies } from "next/headers";

export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    
    // cookies expires in 3 days
    cookieStore.set("admin-session", password, {
      httpOnly: true, // prevents client-side JS from reading it
      secure: process.env.NODE_ONLY === "production",
      maxAge: 60 * 60 * 24 * 3, 
      path: "/",
    });
    
    return { success: true };
  }
  
  return { success: false, error: "Invalid password" };
}