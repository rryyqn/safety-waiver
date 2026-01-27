"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateAge } from "@/lib/utils";
import { ArrowUpToLine, Copy, FileText, Hash, LinkIcon, Mail, Phone, Printer, User, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "./ui/context-menu";
import Link from "next/link";

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
                {waiver.guardian.children.length}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 lg:pr-12 pb-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="flex flex-col gap-2 border border-input rounded-xs py-3 px-4">
                <div className="text-xs text-muted cursor-default">Guardian Info</div>
                <div className="flex justify-between flex-col gap-2">
                  {waiver.guardian.name && (
                      <div className="flex items-center gap-4"><User2 className="size-4 text-muted" /> {waiver.guardian.name}</div>
                  )}
                  {waiver.guardian.phone && (
                      <div className="flex items-center gap-4"><Phone className="size-4 text-muted" /> {waiver.guardian.phone}</div>
                  )}
                  {waiver.guardian.email && (
                      <div className="flex items-center gap-4"><Mail className="size-4 text-muted" /> {waiver.guardian.email}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 border border-input rounded-xs py-3 px-4">
                <h3 className="text-xs text-muted cursor-default">Participating Minors</h3>
                <div className="flex justify-between flex-col gap-2">
                  {waiver.guardian.children.map((child, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm pl-3 border-l-2 items-center"
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
                <h3 className="text-xs text-muted cursor-default">Waiver Details</h3>
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
                  <div className="flex flex-row w-full gap-2 pt-2 flex-wrap">
                  <Link href={`/admin/${waiver.id}`}>
                  <Button variant="secondary" size="dashboard"><FileText className="size-4" />Details</Button>
                  </Link>
                  <Button variant="secondary" size="dashboard"><Mail className="size-4" />Email</Button>
                  <Button variant="secondary" size="dashboard"><Printer className="size-4" />Print</Button>
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
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <Link href={`/admin/${waiver.id}`}>
            <ContextMenuItem>
              <FileText className="size-4" />
              See Details
            </ContextMenuItem>
              </Link>
            
            <ContextMenuItem>
              <Mail className="size-4" />
              Email Waiver
            </ContextMenuItem>
            <ContextMenuItem>
              <Printer className="size-4" />
              Print Waiver
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger className="gap-2">
                <Copy className="size-4" />
                Copy Info
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>

              <ContextMenuItem onClick={() =>copyTextToClipboard(waiver.guardian.name!)}>
              <User className="size-4" />
              Name</ContextMenuItem>
              <ContextMenuItem onClick={() =>copyTextToClipboard(waiver.guardian.phone!)}><Phone className="size-4" />Phone</ContextMenuItem>
              <ContextMenuItem onClick={() =>copyTextToClipboard(waiver.id.toString())}><Hash className="size-4" />Waiver ID</ContextMenuItem>
              <ContextMenuItem onClick={() =>copyTextToClipboard(window.location.host + `/admin/${waiver.id}`)}><LinkIcon className="size-4" />Waiver Link</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
  </ContextMenuContent>
        </ContextMenu>
      ))}
    </Accordion>
  );
}