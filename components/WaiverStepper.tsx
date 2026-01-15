"use client";
import { Fragment } from "react";
import { Check, Mail, User, Users, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { name: "Email", icon: Mail },
  { name: "Guardian", icon: User },
  { name: "Children", icon: Users },
  { name: "Agreement", icon: ClipboardCheck },
];

export function WaiverStepper({
  currentStepIndex,
}: {
  currentStepIndex: number;
}) {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStepIndex > index;
        const isActive = currentStepIndex === index;
        const isLastStep = index === STEPS.length - 1;

        return (
          <Fragment key={step.name}>
            {/* Step Circle & Label */}
            <div className="flex items-center gap-2 flex-col h-fit w-16 z-10">
              <div
                className={cn(
                  "size-10 rounded-full flex items-center justify-center border transition-colors bg-background",
                  isCompleted && "bg-primary border-none text-white",
                  isActive && "scale-110 bg-primary border-none text-white",
                  !isActive &&
                    !isCompleted &&
                    "border-muted/30 text-muted-foreground bg-muted-background"
                )}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>
              <p
                className={cn(
                  "text-xs",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.name}
              </p>
            </div>

            {/* Separator Line */}
            {!isLastStep && (
              <div
                className={cn(
                  "flex-1 h-[0.8px] -mx-4 -mt-6 transition-colors duration-300",
                  // Line is colored if the NEXT step is completed or active
                  currentStepIndex > index
                    ? "bg-primary h-[1.6px]"
                    : "bg-muted/30"
                )}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
