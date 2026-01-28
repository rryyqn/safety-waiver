"use server";
import { db } from "@/lib/d";
import { Prisma } from "@prisma/client";

export async function getFilteredWaivers(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
  }) {
    
    
    // Initial where clause (gets submitted waivers)
    const where: Prisma.WaiverWhereInput = {
      submittedAt: { not: null },
    };
    
    if (filters.search) {
      const search = filters.search.trim();
      const searchAsNumber = Number(search);
      const isNumeric = !isNaN(searchAsNumber);
    
      // Initialize an empty OR array
      const orConditions: Prisma.WaiverWhereInput[] = [
        { guardian: { name: { contains: search, mode: 'insensitive' } } }
      ];
    
      // ID Search
      if (isNumeric) {
        orConditions.push({ id: { equals: searchAsNumber } });
      }
    
      // Phone Search
      if (search.length >= 4) {
        orConditions.push({ guardian: { phone: { contains: search } } });
      }
    
      where.OR = orConditions;
    }
    
    if (filters.startDate || filters.endDate) {
      where.submittedAt = {
        not: null, // Explicitly include the 'not: null' check
        ...(filters.startDate && { gte: filters.startDate }),
        ...(filters.endDate && { lte: filters.endDate }),
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