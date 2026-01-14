"use client";
import { updateGuardian } from "@/app/actions/waiver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { guardianSchema } from "@/lib/validations";
import { ArrowRight, CircleAlert, LoaderCircle, User } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const params = useParams();

  const waiverId = params.id;

  const handleSubmit = async (
    e: React.FormEvent,
    name: string,
    phone: string,
    dob: string
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

    const res = await updateGuardian(guardianId, { name, phone, dob });
    if (res.success && res.data) {
      console.log("success");
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
            <Input
              id="dob"
              placeholder="DD/MM/YYYY"
              className="w-full"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              aria-invalid={!!errors.dob}
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
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, name, phone, dob)}
            className="disabled:bg-primary/80"
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
