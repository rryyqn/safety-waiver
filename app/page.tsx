"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CircleAlert, LoaderCircle, Mail } from "lucide-react";
import { useState } from "react";
import { initiateWaiver } from "./actions/waiver";
import { emailSchema } from "@/lib/validations";
import { WaiverStepper } from "@/components/WaiverStepper";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailExistingError, setEmailExistingError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    email: string,
    forceEdit?: boolean
  ) => {
    e.preventDefault();
    setEmailError(null);
    setFormError(null);
    setEmailExistingError(false);
    setIsSubmitting(true);

    const currentIsEdit = forceEdit ?? isEdit;

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      setIsSubmitting(false);
      return;
    }

    const res = await initiateWaiver(email);
    if (res.success && res.data) {
      if (
        res.isNew ||
        (!res.isNew && !res.data.waiver?.submittedAt) ||
        (!res.isNew && res.data.waiver?.submittedAt && currentIsEdit)
      ) {
        window.location.href = `/waiver/${res.data.id}/guardian`;
        setIsSubmitting(false);

        return;
      } else {
        setEmailExistingError(true);
        setIsSubmitting(false);
      }
    } else if (res.error) {
      setFormError(res.error);
      console.log(res.error);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-150 mx-auto flex items-center px-8 flex-col gap-8 justify-center bg-background rounded-sm py-10 shadow-[0px_0px_19px_-10px_#00000024]">
        <WaiverStepper currentStepIndex={0} />
        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col gap-2">
            <div className="p-4 rounded-sm bg-primary/10 text-primary w-fit mb-2">
              <Mail className="size-8" />
            </div>
            <h1 className="text-4xl font-extrabold">
              {isEdit ? "Edit Waiver" : "Let's get started"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Edit your existing waiver with your email address"
                : "The safety waiver is required for all participants"}
            </p>
          </div>
          <form className="grid w-full items-center gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email Address *</Label>
              <div className="flex flex-col gap-1">
                <Input
                  id="email"
                  placeholder="Email"
                  className="w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!emailError || !!emailExistingError}
                />
                {emailError && (
                  <p className="text-destructive font-extrabold flex flex-row gap-1 items-center">
                    <CircleAlert className="size-4" />
                    {emailError}
                  </p>
                )}
                {emailExistingError && (
                  <div className="text-destructive font-extrabold flex flex-row gap-1 items-start">
                    <CircleAlert className="size-4 shrink-0 mt-1" />
                    <p className="inline">
                      Waiver already exists for this email.{" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e, email, true);
                        }}
                        className="cursor-pointer text-muted-foreground underline decoration-2 underline-offset-4 decoration-primary/20 hover:decoration-primary/50 outline-none focus-visible:border-primary focus-visible:border-b-4 transition-all w-fit"
                      >
                        Edit your waiver
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Button
                type="submit"
                onClick={(e) => handleSubmit(e, email)}
                disabled={isSubmitting}
                className="disabled:bg-primary/80"
              >
                {isSubmitting ? (
                  <LoaderCircle className="size-5 animate-spin" />
                ) : (
                  <>
                    {isEdit ? "Edit Existing Waiver" : "Sign New Waiver"}
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
              {formError && (
                <p className="text-destructive font-extrabold flex flex-row gap-1 items-center w-full truncate">
                  <CircleAlert className="size-4" />
                  {formError}
                </p>
              )}
            </div>
          </form>
          <div>
            <button
              onClick={() => setIsEdit((isEdit) => !isEdit)}
              className="cursor-pointer text-muted-foreground underline decoration-2 underline-offset-4 decoration-primary/20 hover:decoration-primary/50 outline-none focus-visible:border-primary focus-visible:border-b-4 transition-all"
            >
              {isEdit ? "Sign a new waiver" : "Edit an existing waiver"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
