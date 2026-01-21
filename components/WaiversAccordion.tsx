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
        <AccordionItem key={waiver.id} value={waiver.id.toString()} className="border-0">
          <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
            <div className="grid grid-cols-3 gap-4 w-full items-center text-left pr-4">
              <p>{waiver.guardian.name}</p>
              <p>{waiver.guardian.phone}</p>
              <p>
                {waiver.guardian.children.length}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 bg-muted/30">
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="font-semibold mb-2">Children</h3>
                <div className="space-y-2">
                  {waiver.guardian.children.map((child, index) => (
                    <div
                      key={index}
                      className="flex gap-4 text-sm pl-4 py-1 border-l-2"
                    >
                      <span className="font-medium">{child.name}</span>
                      <span className="text-muted-foreground">
                        Age {child.dob && calculateAge(child.dob)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Waiver Details</h3>
                <div className="text-sm space-y-1 pl-4">
                  <p>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    {waiver.submittedAt?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}