"use client";
import { updateGuardian } from "@/app/actions/waiver";
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
import { useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import Link from "next/link";

type GuardianProps = {
  name: string | null;
  phone: string | null;
  dob: Date | null;
  id: number;
  email: string;
  children: {
    id: number;
    guardianId: number;
    name: string | null;
    dob: Date | null;
  }[];
};

const GuardianForm = ({
  waiverId,
  guardianId,
  initialData,
}: {
  waiverId: number;
  guardianId: number;
  initialData: GuardianProps;
}) => {
  const [name, setName] = useState(initialData.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [dob, setDob] = useState<Date | undefined>(
    initialData?.dob ?? undefined
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
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
      setIsSubmitting(false);
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
              onClick={handleSubmit}
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

export default GuardianForm;
