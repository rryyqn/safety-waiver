"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateAge } from "@/lib/utils";
import { ArrowUpToLine, FileText, Mail, Minus, Phone, SquareMinus, Trash, User, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "./ui/context-menu";

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
  const [openItems, setOpenItems] = useState<string[]>([]);

  function copyTextToClipboard(text: string): void {
    // Use the Clipboard API to write the text
    navigator.clipboard.writeText(text)
      .then(() => {
        // Success message (optional, e.g., show a tooltip)
        console.log('Text copied to clipboard successfully!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  }

      return (
    <Accordion type="multiple" className="divide-y" value={openItems} onValueChange={setOpenItems}>
      {waivers.map((waiver) => (
        <ContextMenu key={waiver.id}>
  <ContextMenuTrigger asChild>
        <AccordionItem key={waiver.id} value={waiver.id.toString()} className="border-b border-input">
          <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-center text-left">
              <p>{waiver.guardian.name}</p>
              <p className="sm:block hidden">{waiver.guardian.phone}</p>
              <p className="sm:block hidden">
                {waiver.guardian.children.length} {
                  waiver.guardian.children.length === 1 ? "child" : "children"}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 lg:pr-12 pb-6 pt-2">
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
                        (Age {child.dob && calculateAge(child.dob)})
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
                  <p className="flex flex-row gap-1 items-center">Status:  <span className="bg-green-100/70 px-1.5 text-green-800 rounded-xs">Valid</span></p>
                </div>
                  <div className="flex flex-row w-full mb-1.5 gap-2 pt-2 flex-wrap">

                  <Button variant="secondary" size="dashboard"><FileText className="size-4" strokeWidth={1.5} />Details</Button>
                  <Button variant="secondary" size="dashboard" className="bg-destructive/4 text-red-800"><Trash className="size-4" strokeWidth={1.5} />Delete</Button>
                  </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {openItems.length > 0 && (
            <>
          <ContextMenuGroup>
            <ContextMenuLabel>View</ContextMenuLabel>
        
    <ContextMenuItem onClick={() => setOpenItems([])}>
      <ArrowUpToLine className="size-4" />
      Collapse All
    </ContextMenuItem>
    </ContextMenuGroup>
          <ContextMenuSeparator /></>
          )}
          <ContextMenuGroup>
            <ContextMenuLabel>Info</ContextMenuLabel>
            <ContextMenuItem onClick={() =>copyTextToClipboard(waiver.guardian.name!)}>
            <User className="size-4" />

      Copy Name
    </ContextMenuItem>
            <ContextMenuItem onClick={() =>copyTextToClipboard(waiver.guardian.phone!)}>
            <Phone className="size-4" />
      Copy Phone
    </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>
              <FileText className="size-4" />
              View Details
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <Trash className="size-4" />
              Delete Waiver
            </ContextMenuItem>
          </ContextMenuGroup>
  </ContextMenuContent>
        </ContextMenu>
      ))}
    </Accordion>
  );
}