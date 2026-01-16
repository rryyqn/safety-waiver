"use client";
import {
  getChildren,
  getWaiverDraft,
  updateChildren,
} from "@/app/actions/waiver";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { childrenArraySchema } from "@/lib/validations";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CircleAlert,
  LoaderCircle,
  Plus,
  Trash,
  User,
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
  const [errors, setErrors] = useState<[Record<string, string>]>([{}]);
  const [arrayError, setArrayError] = useState<string | null>(null);

  const [children, setChildren] = useState<
    { name: string | null; dob: Date | undefined }[]
  >([]);

  console.log("Children: ", children);

  console.log(children);

  useEffect(() => {
    async function loadDraft() {
      if (isNaN(waiverId)) return;

      const waiverRes = await getWaiverDraft(waiverId);

      if (waiverRes.success && waiverRes.data) {
        const actualGuardianId = waiverRes.data.guardianId;
        setGuardianId(actualGuardianId);

        const childrenRes = await getChildren(actualGuardianId);
        if (childrenRes.success && childrenRes.data) {
          setChildren(
            childrenRes.data.map((c) => ({
              name: c.name,
              dob: c.dob ?? undefined,
            }))
          );
        }
      }
    }
    loadDraft();
  }, [waiverId]);

  const addChild = (e: React.FormEvent) => {
    e.preventDefault();
    setChildren([...children, { name: "", dob: undefined }]);

    if (arrayError === "At least one child is required") {
      setArrayError(null);
    } else {
    }
  };

  const removeChild = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    setChildren(children.filter((_, i) => i !== index));
  };
  const updateChild = (index: number, field: "name" | "dob", value: any) => {
    const newChildren = [...children]; // 1. Copy the array
    newChildren[index] = { ...newChildren[index], [field]: value }; // 2. Update the specific object
    setChildren(newChildren); // 3. Save it back to state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([{}]);
    setFormError(null);
    setIsSubmitting(true);

    const data = children.map((c) => ({
      name: c.name,
      dob: c.dob || "",
    }));

    const result = childrenArraySchema.safeParse(data);
    console.log("Result", JSON.stringify(result));

    if (!result.success) {
      const newErrors: Record<string, string>[] = children.map(() => ({}));

      result.error.issues.forEach((issue) => {
        if (issue.path.length === 0) {
          setArrayError(issue.message); // "At least one child is required"
          return;
        }
        const index = issue.path[0] as number;
        const field = issue.path[1] as string;

        newErrors[index] = {
          ...newErrors[index],
          [field]: issue.message,
        };
      });

      console.log("Errors: ", newErrors);
      setErrors(newErrors as [Record<string, string>]);
      setIsSubmitting(false);
      return;
    }

    if (!guardianId) {
      setFormError("Guardian not found");
      setIsSubmitting(false);
      return;
    }

    const res = await updateChildren(guardianId, result.data);
    if (res.success && res.data) {
      window.location.href = `/waiver/${waiverId}/agreement`;
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
          <Users className="size-8" />
        </div>
        <h1 className="text-4xl font-extrabold">Children Details</h1>
      </div>
      <form className="grid w-full items-center gap-6">
        {children.length > 0 ? (
          <div className="flex flex-col gap-6">
            {children.map((child, index) => (
              <div
                key={index}
                className="flex flex-col gap-6 p-6 bg-muted-background rounded-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-row items-center gap-3">
                    <div className="p-2 rounded-sm bg-primary/10 text-primary w-fit">
                      <User className="size-5" />
                    </div>
                    <h3 className="text-lg">Child {index + 1}</h3>
                  </div>

                  <Button
                    onClick={(e) => removeChild(e, index)}
                    className="p-2 w-9 h-9 rounded-sm hover:bg-destructive/10 text-destructive cursor-pointer transition-all bg-transparent"
                    title="Remove Child"
                    aria-label="Remove Child"
                  >
                    <Trash className="size-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <Label>Full Name</Label>
                    <div className="flex flex-col gap-1">
                      <Input
                        value={child.name ?? ""}
                        onChange={(e) =>
                          updateChild(index, "name", e.target.value)
                        }
                      />
                      {errors[index]?.name && (
                        <p className="text-destructive font-extrabold flex flex-row gap-1 items-center">
                          <CircleAlert className="size-4" />
                          {errors[index].name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Date of Birth</Label>
                    <div className="flex flex-col gap-1">
                      <DatePicker
                        value={child.dob}
                        onChange={(date) => updateChild(index, "dob", date)}
                      />
                      {errors[index]?.dob && (
                        <p className="text-destructive font-extrabold flex flex-row gap-1 items-center">
                          <CircleAlert className="size-4" />
                          {errors[index].dob}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addChild} variant="dashed" className="w-full">
              + Add Child
            </Button>
          </div>
        ) : (
          <div className="w-full h-71 border-2 border-input border-dashed rounded-sm flex flex-col items-center justify-between p-3">
            <div></div>
            <div className="text-muted flex flex-col items-center">
              <Baby className="size-10 text-muted" />
              <p>No children added yet</p>
            </div>
            <Button variant="dashed" onClick={addChild} className="w-full">
              <Plus className="size-5" /> Add Child
            </Button>
          </div>
        )}
        {arrayError && (
          <p className="text-destructive font-extrabold flex flex-row gap-1 items-center w-full truncate">
            <CircleAlert className="size-4" />
            {arrayError}
          </p>
        )}
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

export default Page;
