"use client";
import { getWaiverDraft, updateGuardian } from "@/app/actions/waiver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { guardianSchema } from "@/lib/validations";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  LoaderCircle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DatePicker } from "@/components/DatePicker";
import Link from "next/link";

const Page = () => {
  const params = useParams();
  const rawWaiverId = params.id;
  const waiverId = Number(rawWaiverId);

  const [guardianId, setGuardianId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date>();

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadDraft() {
      if (isNaN(waiverId)) return;
      const res = await getWaiverDraft(waiverId);
      if (res.success && res.data) {
        setGuardianId(res.data.guardianId);
        // Pre-populate fields
        setName(res.data.guardian.name || "");
        setPhone(res.data.guardian.phone || "");
        if (res.data.guardian.dob) setDob(new Date(res.data.guardian.dob));
      }
    }
    loadDraft();
  }, [waiverId]);

  const handleSubmit = async (
    e: React.FormEvent,
    name: string,
    phone: string,
    dob: Date | null | undefined
  ) => {
    e.preventDefault();

    setErrors({});
    setFormError(null);
    setIsSubmitting(true);

    const result = guardianSchema.safeParse({ name, phone, dob });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMap = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
      );
      setErrors(errorMap);
      setIsSubmitting(false);
      return;
    }

    if (!guardianId) {
      setFormError("Guardian not found");
      return;
    }

    const res = await updateGuardian(guardianId, {
      name,
      phone,
      dob: dob ?? undefined,
    });
    if (res.success && res.data) {
      window.location.href = `/waiver/${waiverId}/children`;
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
          <User className="size-8" />
        </div>
        <h1 className="text-4xl font-extrabold">Guardian Details</h1>
      </div>
      <form className="grid w-full items-center gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Full Name</Label>
          <div className="flex flex-col gap-1">
            <Input
              id="name"
              placeholder="Full Name"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-center">
                <CircleAlert className="size-4" />
                {errors.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex flex-col gap-1">
            <Input
              id="phone"
              placeholder="Phone"
              className="w-full"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-center">
                <CircleAlert className="size-4" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="flex flex-col gap-1">
            <DatePicker
              id="dob"
              value={dob}
              onChange={(date) => setDob(date)}
              ariainvalid={!!errors.dob}
            />
            {errors.dob && (
              <p className="text-destructive font-extrabold flex flex-row gap-1 items-center">
                <CircleAlert className="size-4" />
                {errors.dob}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <Button className="w-fit" variant="secondary" asChild>
              <Link href={`/`}>
                <ArrowLeft className="size-5" />
                Back
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, name, phone, dob)}
              className="disabled:bg-primary/80 flex-1"
            >
              {isSubmitting ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <>
                  Continue
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
      <div></div>
    </div>
  );
};

export default Page;
