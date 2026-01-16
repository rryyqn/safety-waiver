"use client";
import { getWaiverDraft } from "@/app/actions/waiver";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CircleAlert,
  LoaderCircle,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const rawWaiverId = params.id;
  const waiverId = Number(rawWaiverId);
  const [guardianId, setGuardianId] = useState<number | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [children, setChildren] = useState<
    { name: string; dob: Date | undefined }[]
  >([]);

  console.log(children);

  useEffect(() => {
    async function loadDraft() {
      if (isNaN(waiverId)) return;
      const res = await getWaiverDraft(waiverId);
      if (res.success && res.data) {
        setGuardianId(res.data.guardianId);
        // Pre-populate fields
      }
    }
    loadDraft();
  }, [waiverId]);

  const addChild = () =>
    setChildren([...children, { name: "", dob: undefined }]);

  const removeChild = (index: number) => {
      setChildren(children.filter((_, i) => i !== index));
  };
  const updateChild = (index: number, field: "name" | "dob", value: any) => {
    const newChildren = [...children]; // 1. Copy the array
    newChildren[index] = { ...newChildren[index], [field]: value }; // 2. Update the specific object
    setChildren(newChildren); // 3. Save it back to state
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-2">
        <div className="p-4 rounded-sm bg-primary/10 text-primary w-fit mb-4">
          <Users className="size-8" />
        </div>
        <h1 className="text-4xl font-extrabold">Children Details</h1>
      </div>
      <form className="grid w-full items-center gap-6">
        {children.length > 0 ? (
          <div>
            {children.map((child, index) => (
              <div key={index} className="space-y-4 border-b pb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Child #{index + 1}</h3>
                  {children.length > 1 && (
                    <Button variant="ghost" onClick={() => removeChild(index)}>
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  <Label>Full Name</Label>
                  <Input
                    value={child.name}
                    onChange={(e) => updateChild(index, "name", e.target.value)}
                  />

                  <Label>Date of Birth</Label>
                  <DatePicker
                    value={child.dob}
                    onChange={(date) => updateChild(index, "dob", date)}
                  />
                </div>
              </div>
            ))}

            <Button onClick={addChild} variant="outline" className="w-full">
              + Add Another Child
            </Button>
          </div>
        ) : (
          <div className="w-full h-50 border-2 border-input border-dashed rounded-sm flex flex-col items-center justify-between p-3">
            <div></div>
            <div className="text-muted flex flex-col items-center">
              <Baby className="size-10 text-muted" />
              <p>No children added yet</p>
            </div>
            <Button
              variant="outline"
              onClick={addChild}
              className="w-full font-normal"
            >
              <Plus className="size-5" /> Add Child
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-3"></div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <Button className="w-fit" variant="secondary" asChild>
              <Link href={`/waiver/${rawWaiverId}/guardian`}>
                <ArrowLeft className="size-5" />
                Back
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
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
