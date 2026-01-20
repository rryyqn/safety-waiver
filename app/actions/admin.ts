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

export async function getFilteredWaivers(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    // 1. Initialize an empty where clause
    // We only want to see submitted waivers
    const where: any = {
      submittedAt: { not: null },
    };
  
    if (filters.search) {
      where.OR = [
        { guardian: { name: { contains: filters.search, mode: 'insensitive' } } },
        { guardian: { phone: { contains: filters.search } } },
      ];
    }
  
    if (filters.startDate || filters.endDate) {
      where.submittedAt = {
        ...where.submittedAt, // Keep the 'not: null' check
        ...(filters.startDate && { gte: filters.startDate }),
        ...(filters.endDate && { lte: filters.endDate }),
      };
    }
  
    return await db.waiver.findMany({
      where,
      include: {
        guardian: { include: { children: true } },
        agreement: true,
      },
      orderBy: { submittedAt: 'desc' },
    });
  }