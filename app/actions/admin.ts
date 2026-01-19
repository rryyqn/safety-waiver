"use server";
import { db } from "@/lib/d";

export async function getAdminWaivers() {
  return await db.waiver.findMany({
    where: { submittedAt: { not: null } },
    include: {
      guardian: {include: {children: true}},
      agreement: true,
    },
    orderBy: { submittedAt: "desc" },
  });
}