"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateAge } from "@/lib/utils";
import { ChevronDown, FileText, Mail, Phone, SquarePen, Trash, User2 } from "lucide-react";
import { Button } from "./ui/button";

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
      return (
    <Accordion type="multiple" className="divide-y">
      {waivers.map((waiver) => (
        <AccordionItem key={waiver.id} value={waiver.id.toString()} className="border-b border-input">
          <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180 data-[state=open]:bg-muted-background/50 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-center text-left">
              <p>{waiver.guardian.name}</p>
              <p className="sm:block hidden">{waiver.guardian.phone}</p>
              <p className="sm:block hidden">
                {waiver.guardian.children.length} {
                  waiver.guardian.children.length === 1 ? "child" : "children"}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 lg:pr-12 pb-6 pt-2 bg-muted-background/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="flex flex-col gap-2 border border-input rounded-xs py-3 px-4">
                <div className="uppercase font-mono text-muted">Guardian Info</div>
                <div className="flex justify-between flex-col gap-2">
                  {waiver.guardian.name && (
                      <div className="flex items-center gap-2"><User2 className="size-4 text-muted" /> {waiver.guardian.name}</div>
                  )}
                  {waiver.guardian.phone && (
                      <div className="flex items-center gap-2"><Phone className="size-4 text-muted" /> {waiver.guardian.phone}</div>
                  )}
                  {waiver.guardian.email && (
                      <div className="flex items-center gap-2"><Mail className="size-4 text-muted" /> {waiver.guardian.email}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 border border-input rounded-xs py-3 px-4">
                <h3 className="uppercase font-mono text-muted">Participating Minors</h3>
                <div className="flex justify-between flex-col gap-2">
                  {waiver.guardian.children.map((child, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm pl-2 border-l-2 items-center"
                    >
                      <span className="">{child.name}</span>
                      <span className="text-muted-foreground text-xs" title={child.dob?.toLocaleDateString()}>
                        (Age: {child.dob && calculateAge(child.dob)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border border-input rounded-xs py-3 px-4">
                <h3 className="uppercase font-mono text-muted">Waiver Details</h3>
                <div className="text-sm flex flex-col gap-2">
                  <p>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    {waiver.submittedAt?.toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p className="flex flex-row gap-1 items-center">Status:  <span className="bg-green-100 px-1.5 text-green-800 rounded-xs">Valid</span></p>
                </div>
                  <div className="flex flex-row w-full mb-1.5 gap-2 pt-2 flex-wrap">

                  <Button variant="secondary" size="dashboard"><FileText className="text-muted size-4" /> View</Button>
                  <Button variant="secondary" size="dashboard"><SquarePen className="text-muted size-4" />Edit</Button>
                  <Button variant="secondary" size="dashboard" className="hover:bg-destructive/10 hover:text-red-800 group"><Trash className="text-muted group-hover:text-red-600 size-4" />Delete</Button>
                  </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}