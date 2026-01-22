"use client";
import { getChildren, getWaiverDraft } from "@/app/actions/waiver";
import LottieAnimation from "@/components/SuccessCheck";
import { Separator } from "@/components/ui/separator";
import { calculateAge } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type SuccessProps = {
  children: {
    id: number;
    guardianId: number;
    name: string | null;
    dob: Date | null;
  }[];
  email: string;
  id: number;
  name: string | null;
  dob: Date | null;
  phone: string | null;
};

const SuccessForm = ({
  waiverId,
  finalData,
}: {
  waiverId: number;
  finalData: SuccessProps;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex flex-col justify-center gap-2 items-center">
        <LottieAnimation />
        <h1 className="text-3xl font-extrabold">Waiver complete!</h1>
        <p className="text-muted-foreground">
          Please show this screen to our staff members at the reception desk.
        </p>
      </div>
      <div className="bg-muted-background p-4 rounded-sm flex flex-col gap-4 text-xl font-extrabold leading-loose">
        {waiverId ? (
          <>
            <ul>
              <li>{finalData.name}</li>
              <li>{finalData.phone}</li>
            </ul>
            <Separator />
            <ul>
              {finalData.children.map(
                (child: {
                  id: number;
                  guardianId: number;
                  name: string | null;
                  dob: Date | null;
                }) => (
                  <li key={child.id}>
                    {child.name} ({child.dob && calculateAge(child.dob)})
                  </li>
                )
              )}
            </ul>
          </>
        ) : (
          <p>Error, could not find waiver</p>
        )}
      </div>
    </div>
  );
};

export default SuccessForm;
