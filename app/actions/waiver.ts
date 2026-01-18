"use server";

import { db } from "@/lib/d";
import {
  agreementSchema,
  childrenArraySchema,
  emailSchema,
  guardianSchema,
} from "@/lib/validations";

export async function initiateWaiver(email: string) {
  try {
    const result = emailSchema.safeParse(email);
    if (!result.success)
      return { success: false, error: result.error.issues[0].message };
    let guardian = await db.guardian.findUnique({
      where: { email },
      include: { waiver: true },
    });

    let isNew = false;

    if (!guardian) {
      isNew = true;
      guardian = await db.guardian.create({
        data: {
          email,
          waiver: { create: {} },
        },
        include: { waiver: true },
      });
    }

    return { success: true, data: guardian, isNew };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Database error" };
  }
}

export async function getGuardian(guardianId: number) {
  try {
    const guardian = await db.guardian.findUnique({
      where: { id: guardianId },
    });
    return { success: true, data: guardian };
  } catch (error) {
    return {
      success: false,
      error: "Guardian not found. Please try again later",
    };
  }
}

export async function updateGuardian(
  guardianId: number,
  data: { name?: string; phone?: string; dob?: Date }
) {
  try {
    const result = guardianSchema.safeParse({
      name: data.name,
      phone: data.phone,
      dob: data.dob,
    });
    if (!result.success)
      return { success: false, error: result.error.issues[0].message };

    const updated = await db.guardian.update({
      where: { id: guardianId },
      data: {
        name: data.name,
        phone: data.phone,
        dob: data.dob,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update. Please try again later",
    };
  }
}

export async function getWaiverDraft(waiverId: number) {
  try {
    const waiver = await db.waiver.findUnique({
      where: { id: waiverId },
      include: { guardian: true, agreement: true },
    });
    if (!waiver) return { success: false, error: "Waiver not found" };
    return { success: true, data: waiver };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch waiver. Please try again later",
    };
  }
}

export async function getChildren(guardianId: number) {
  try {
    const children = await db.child.findMany({ where: { guardianId } });
    return { success: true, data: children };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch children. Please try again later",
    };
  }
}

export async function updateChildren(
  guardianId: number,
  children: { name?: string; dob?: Date }[]
) {
  const validation = childrenArraySchema.safeParse(children);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid data provided",
      details: validation.error.flatten(),
    };
  }
  try {
    const childrenList = await db.$transaction([
      db.child.deleteMany({ where: { guardianId } }),
      db.child.createMany({
        data: children.map((child) => ({
          name: child.name,
          dob: child.dob,
          guardianId: guardianId,
        })),
      }),
      db.child.findMany({ where: { guardianId } }),
    ]);

    return { success: true, data: childrenList };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to update children. Please try again later",
    };
  }
}

export async function submitWaiver(
  waiverId: number,
  agreementData: {
    signature: string;
    guardianName: string;
    rulesAgreement: boolean;
    risksAgreement: boolean;
    medicalAgreement: boolean;
  }
) {
  try {
    // 1. Fetch the data to validate it
    const waiver = await db.waiver.findUnique({
      where: { id: waiverId },
      include: {
        guardian: { include: { children: true } },
      },
    });

    // 2. RUN VALIDATIONS
    const children = waiver?.guardian.children;
    if (!waiver) throw new Error("Waiver not found");
    if (!children || children.length === 0) {
      throw new Error("At least one child is required.");
    }
    if (!agreementData.signature) throw new Error("Signature is required");
    if (!waiver.guardian.name) throw new Error("Guardian name is required");
    if (!waiver.guardian.email) throw new Error("Guardian email is required");
    if (!waiver.guardian.phone) throw new Error("Guardian phone is required");
    if (!waiver.guardian.dob)
      throw new Error("Guardian date of birth is required");
    const hasIncompleteChild = children.some(
      (child: {
        id: number;
        name: string | null;
        dob: Date | null;
        guardianId: number;
      }) => !child.name || !child.dob
    );
    if (hasIncompleteChild) {
      throw new Error("All children must have a name and date of birth.");
    }

    const today = new Date();
    const birthDate = new Date(waiver.guardian.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      throw new Error("The signing Guardian must be at least 18 years old.");
    }

    const agreementDataResult = agreementSchema.safeParse(agreementData);
    if (!agreementDataResult.success) {
      throw new Error(agreementDataResult.error.issues[0].message);
    }

    // 3. EXECUTE THE COMMIT
    const result = await db.$transaction([
      // Update the waiver status
      db.waiver.update({
        where: { id: waiverId },
        data: { submittedAt: new Date() },
      }),
      // Create the agreement record
      db.agreement.create({
        data: {
          waiverId: waiverId,
          rulesAgreement: agreementData.rulesAgreement,
          risksAgreement: agreementData.risksAgreement,
          medicalAgreement: agreementData.medicalAgreement,
          signature: agreementData.signature,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to submit waiver. Please try again later",
    };
  }
}

export async function getCompletedWaivers() {
  try {
    const waivers = await db.waiver.findMany({
      where: { submittedAt: { not: null } },
      include: { agreement: true, guardian: { include: { children: true } } },
      orderBy: { submittedAt: "desc" },
    });
    return { success: true, data: waivers };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}

export async function getWaiverProgress(waiverId: number) {
  const waiver = await db.waiver.findUnique({
    where: { id: waiverId },
    include: {
      guardian: { include: { children: true } },
      agreement: true,
    },
  });

  if (!waiver) return { exists: false };

  // Logic to determine furthest allowed step
  let step = "email";
  if (waiver.guardian.email) {
    step = "guardian";
  }
  if (waiver.guardian.name && waiver.guardian.phone && waiver.guardian.dob) {
    step = "children";
  }
  if (waiver.guardian.children.length > 0) {
    step = "agreement";
  }
  if (waiver.submittedAt) {
    step = "success";
  }

  return { exists: true, allowedStep: step, data: waiver };
}
