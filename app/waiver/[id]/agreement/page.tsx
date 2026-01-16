"use client";

import {
  getGuardian,
  getWaiverDraft,
  submitWaiver,
} from "@/app/actions/waiver";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { agreementSchema } from "@/lib/validations";
import {
  ClipboardCheck,
  HeartPulse,
  ShieldCheck,
  TriangleAlert,
  Activity,
  Cross,
  CircleAlert,
  ArrowLeft,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const rawWaiverId = params.id;
  const waiverId = Number(rawWaiverId);

  const [guardianId, setGuardianId] = useState<number | null>(null);
  const [guardianName, setGuardianName] = useState("");

  const [rulesAgreement, setRulesAgreement] = useState(false);
  const [risksAgreement, setRisksAgreement] = useState(false);
  const [medicalAgreement, setMedicalAgreement] = useState(false);
  const [signature, setSignature] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isEdit, setIsEdit] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchWaiverData = async () => {
      if (!waiverId) return;

      const res = await getWaiverDraft(waiverId);

      if (res.success && res.data) {
        if (res.data.guardian) {
          setGuardianId(res.data.guardian.id);

          setGuardianName(res.data.guardian.name || "");
        } else {
          setFormError("Guardian not found");
        }
        if (res.data.submittedAt != null || res.data.submittedAt != undefined) {
          setIsEdit(true);
          setSubmittedAt(res.data.submittedAt);
          setSignature(res.data.agreement?.signature || "");
          setRulesAgreement(res.data.agreement?.rulesAgreement || false);
          setRisksAgreement(res.data.agreement?.risksAgreement || false);
          setMedicalAgreement(res.data.agreement?.medicalAgreement || false);
        }
      } else {
        setFormError(res.error || "Failed to load waiver data");
      }
    };

    fetchWaiverData();
  }, [waiverId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setFormError(null);
    setIsSubmitting(true);

    if (isEdit) {
      window.location.href = `/waiver/${waiverId}/success`;
      setIsSubmitting(false);
      return;
    }

    const result = agreementSchema.safeParse({
      signature,
      guardianName,
      rulesAgreement,
      risksAgreement,
      medicalAgreement,
    });
    console.log(rulesAgreement, risksAgreement, medicalAgreement);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMap = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
      );
      console.log(errorMap);
      setErrors(errorMap);
      setIsSubmitting(false);
      return;
    }

    if (!guardianId) {
      setFormError("Guardian not found");
      setIsSubmitting(false);
      return;
    }

    const agreementData = {
      signature,
      guardianName,
      rulesAgreement,
      risksAgreement,
      medicalAgreement,
    };
    const res = await submitWaiver(waiverId, agreementData);
    if (res.success) {
      window.location.href = `/waiver/${waiverId}/success`;
    } else if (res.error) {
      setFormError(res.error);
      console.log(res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-2">
        <div className="p-4 rounded-sm bg-primary/10 text-primary w-fit mb-4">
          <ClipboardCheck className="size-8" />
        </div>
        <h1 className="text-4xl font-extrabold">
          {isEdit ? "Review Agreement" : "Sign Agreement"}
        </h1>

        <p>
          {isEdit
            ? `Your waiver was originally signed on ${submittedAt?.toLocaleDateString()}`
            : "All sections must be acknowledged to sign the agreement"}
        </p>
      </div>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <Label
              aria-invalid={!!errors.risksAgreement}
              className={`hover:bg-accent/50 flex items-start gap-3 rounded-sm border border-input p-4 has-aria-checked:border-blue-300 transition-all cursor-pointer has-aria-checked:bg-blue-50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive ${
                isEdit ? "cursor-not-allowed" : ""
              }`}
            >
              <Checkbox
                id="toggle-2"
                className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={rulesAgreement || isEdit}
                disabled={isEdit}
                onCheckedChange={() => setRulesAgreement(!rulesAgreement)}
              />
              <div className="grid gap-2 font-normal">
                <p className=" leading-none font-extrabold flex flex-row gap-1 items-center">
                  <ShieldCheck className="size-4 text-primary" />
                  Play and Facility Rules
                </p>
                <p className="text-muted-foreground text-sm">
                  I agree to follow all facility rules, including age
                  restrictions, sock and wristband requirements, and supervision
                  guidelines, as instructed by staff members.
                </p>
              </div>
            </Label>
            {errors.rulesAgreement && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-start">
                <CircleAlert className="size-4 mt-1" />
                {errors.rulesAgreement}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label
              aria-invalid={!!errors.risksAgreement}
              className={`hover:bg-accent/50 flex items-start gap-3 rounded-sm border border-input p-4 has-aria-checked:border-blue-300 transition-all cursor-pointer has-aria-checked:bg-blue-50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive ${
                isEdit ? "cursor-not-allowed" : ""
              }`}
            >
              <Checkbox
                id="toggle-2"
                className=" data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={risksAgreement || isEdit}
                disabled={isEdit}
                onCheckedChange={() => setRisksAgreement(!risksAgreement)}
              />
              <div className="grid gap-2 font-normal">
                <p className=" leading-none font-extrabold flex flex-row gap-1 items-center">
                  <TriangleAlert className="size-4 text-primary" />
                  Assumption of Risk
                </p>
                <p className="text-muted-foreground text-sm">
                  I understand that indoor playground activities involve
                  inherent risks including, but not limited to, falls,
                  collisions, and injuries. I acknowledge assumption for all
                  risks.
                </p>
              </div>
            </Label>
            {errors.risksAgreement && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-start">
                <CircleAlert className="size-4 mt-1" />
                {errors.risksAgreement}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label
              aria-invalid={!!errors.risksAgreement}
              className={`hover:bg-accent/50 flex items-start gap-3 rounded-sm border border-input p-4 has-aria-checked:border-blue-300 transition-all cursor-pointer has-aria-checked:bg-blue-50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive ${
                isEdit ? "cursor-not-allowed" : ""
              }`}
            >
              <Checkbox
                id="toggle-2"
                className=" data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={medicalAgreement || isEdit}
                disabled={isEdit}
                onCheckedChange={() => setMedicalAgreement(!medicalAgreement)}
              />
              <div className="grid gap-2 font-normal">
                <p className=" leading-none font-extrabold flex flex-row gap-1 items-center">
                  <Cross className="size-4 text-primary" />
                  Medical Authorization
                </p>
                <p className="text-muted-foreground text-sm">
                  In case of emergency, I authorize the facility to provide or
                  arrange for medical aid for the minor(s) listed in this
                  waiver.
                </p>
              </div>
            </Label>
            {errors.medicalAgreement && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-start">
                <CircleAlert className="size-4 mt-1" />
                {errors.medicalAgreement}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Digital Signature</Label>
          <p className="text-sm">
            Type your full name{" "}
            <span className="font-extrabold">{guardianName}</span> to sign the
            agreement
          </p>
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={guardianName}
              aria-invalid={!!errors.signature}
              disabled={isEdit}
            />
            {errors.signature && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-start">
                <CircleAlert className="size-4 mt-1" />
                {errors.signature}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <Button className="w-fit" variant="secondary" asChild>
              <Link href={`/waiver/${waiverId}/children`}>
                <ArrowLeft className="size-5" />
                Back
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="disabled:bg-primary/80 flex-1"
            >
              {isSubmitting ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <>
                  {isEdit ? "Update Waiver" : "Finalise Waiver"}
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </div>
          {formError && (
            <p className="text-destructive font-extrabold flex flex-row gap-1 items-center w-full truncate">
              <CircleAlert className="size-4" />
              {formError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
