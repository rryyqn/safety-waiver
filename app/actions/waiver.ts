"use server";

import { db } from "@/lib/d";
import { emailSchema } from "@/lib/validations";

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

export async function updateGuardian(
  guardianId: number,
  data: { name?: string; phone?: string; dob?: string }
) {
  try {
    const updated = await db.guardian.update({
      where: { id: guardianId },
      data: {
        name: data.name,
        phone: data.phone,
        // If dob is provided as a string from a form, convert it to a Date object
        dob: data.dob ? new Date(data.dob) : undefined,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to save guardian draft" };
  }
}

export async function updateChildren(
  guardianId: number,
  children: { id?: number; name: string; dob: string }[]
) {
  try {
    const childrenList = await db.$transaction([
      db.child.deleteMany({ where: { guardianId } }),
      db.child.createMany({
        data: children.map((child) => ({
          name: child.name,
          dob: new Date(child.dob),
          guardianId: guardianId,
        })),
      }),
      db.child.findMany({ where: { guardianId } }),
    ]);

    return { success: true, data: childrenList };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Database error" };
  }
}

export async function submitWaiver(waiverId: number, agreementData: any) {
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
      (child: any) => !child.name || !child.dob
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
          safetyRules: agreementData.safetyRules,
          liability: agreementData.liability,
          medicalConsent: agreementData.medicalConsent,
          signature: agreementData.signature,
        },
      }),
    ]);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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
