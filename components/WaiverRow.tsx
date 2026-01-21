"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type WaiverRowProps = {
  waiver: {
    id: number;
    guardian: {
      name: string | null;
      phone: string | null;
      children: { id: number; name: string | null; dob: Date | null; guardianId: number; }[];
    };
    submittedAt: Date | null;
  };
};

export default function WaiverRow({ waiver }: WaiverRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full grid grid-cols-[1fr_200px_120px_40px] gap-4 px-4 py-3 hover:bg-muted/50 transition-colors items-center text-left"
      >
        <p>{waiver.guardian.name}</p>
        <p>{waiver.guardian.phone}</p>
        <p>
          {waiver.guardian.children.length}{" "}
          {waiver.guardian.children.length === 1 ? "child" : "children"}
        </p>
        
      </button>

      {isExpanded && (
        <div className="px-4 py-4 bg-muted/30 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Children</h3>
            <div className="space-y-2">
              {waiver.guardian.children.map((child, index) => (
                <div
                  key={index}
                  className="flex gap-4 text-sm pl-4 py-1 border-l-2"
                >
                  <span className="font-medium">{child.name}</span>
                  <span className="text-muted-foreground">Age {child.dob && calculateAge(child.dob)}</span>
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
              {/* Add more waiver details here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}