"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

type Waiver = {
  guardian: {
    children: {
        name: string | null;
        id: number;
        dob: Date | null;
        guardianId: number;
    }[];
    name: string | null;
        id: number;
        email: string;
        dob: Date | null;
        phone: string | null;
  };
  id: number;
    guardianId: number;
    submittedAt: Date | null;
};


type WaiversAccordionProps = {
  waivers: Waiver[];
};

export default function WaiversAccordion({ waivers }: WaiversAccordionProps) {
    const calculateAge = (dob: Date): number => {
        const today = new Date();
    
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
    
        return age;
      };
  return (
    <Accordion type="multiple" className="divide-y">
      {waivers.map((waiver) => (
        <AccordionItem key={waiver.id} value={waiver.id.toString()} className="border-b border-input">
          <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180 data-[state=open]:bg-muted-background transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-center text-left pr-4">
              <p>{waiver.guardian.name}</p>
              <p className="sm:block hidden">{waiver.guardian.phone}</p>
              <p className="sm:block hidden">
                {waiver.guardian.children.length} {
                  waiver.guardian.children.length === 1 ? "child" : "children"}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-8 sm:pr-16 pb-6 bg-muted-background">
            <div className="flex flex-col justify-between md:flex-row gap-6">
              <div className="flex flex-col gap-2 sm:hidden">
                <h3 className="font-bold">Guardian Info</h3>
                <div className="flex justify-between flex-col gap-2">
                  {waiver.guardian.phone && (
                      <p>Phone: {waiver.guardian.phone}</p>
                  )}
                  {waiver.guardian.email && (
                      <p>Email: {waiver.guardian.email}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Children</h3>
                <div className="flex justify-between flex-col gap-2">
                  {waiver.guardian.children.map((child, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm pl-2 py-1 border-l-2 items-center"
                    >
                      <span className="font-medium">{child.name}</span>
                      <span className="text-muted-foreground text-xs" title="Child Age">
                        ({child.dob && calculateAge(child.dob)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold ">Waiver Details</h3>
                <div className="text-sm flex flex-col gap-1">
                  <p>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    {waiver.submittedAt?.toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p className="flex flex-row gap-1 items-center">Status: <span className="bg-green-100 px-1 rounded-xs">Valid</span></p>
                  <div className="flex flex-row w-full mb-1.5 gap-4">

                  <a href="#" className="underline underline-offset-4 decoration-2 decoration-input">View</a>
                  <a href="#" className="underline underline-offset-4 decoration-2 decoration-input">Edit</a>
                  <a href="#" className="underline underline-offset-4 decoration-2 decoration-input">Delete</a>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}