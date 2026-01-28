"use server";
import { db } from "@/lib/d";
import { Prisma } from "@prisma/client";

export async function getFilteredWaivers(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
    range?: string;
    page?: number;
  }) {
    // Initial where clause
    const where: Prisma.WaiverWhereInput = {
      submittedAt: { not: null },
    };
    
    // --- START: Range Logic ---
    let finalStartDate = filters.startDate;
    let finalEndDate = filters.endDate;

    if (filters.range && !filters.startDate && !filters.endDate) {
      const now = new Date();
      finalEndDate = now;
      
      switch (filters.range) {
        case "lastHour":
          finalStartDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "last3Hours":
          finalStartDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
          break;
        case "lastDay":
          finalStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "lastWeek":
          finalStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    if (filters.search) {
      const search = filters.search.trim();
      const searchAsNumber = Number(search);
      const isNumeric = !isNaN(searchAsNumber);
    
      const orConditions: Prisma.WaiverWhereInput[] = [
        { guardian: { name: { contains: search, mode: 'insensitive' } } }
      ];
    
      if (isNumeric) {
        orConditions.push({ id: { equals: searchAsNumber } });
      }
    
      if (search.length >= 4) {
        orConditions.push({ guardian: { phone: { contains: search } } });
      }
    
      where.OR = orConditions;
    }

    // Updated to use the calculated 'final' dates
    if (finalStartDate || finalEndDate) {
      where.submittedAt = {
        not: null,
        ...(finalStartDate && { gte: finalStartDate }),
        ...(finalEndDate && { lte: finalEndDate }),
      };
    }

    // pagination
    const pageSize = 20;
    const skip = (filters?.page ? (Math.max(filters.page, 1) - 1) * pageSize : 0);

    const [waivers, totalCount] = await Promise.all([
      db.waiver.findMany({
        where,
        take: pageSize,
        skip,
        include: {
          guardian: { include: { children: true } },
          agreement: true,
        },
        orderBy: { submittedAt: 'desc' },
      }),
      db.waiver.count({ where })
    ]);
    
    return {
      waivers,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount
    };
  }