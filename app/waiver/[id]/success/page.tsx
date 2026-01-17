"use client";
import { getChildren, getWaiverDraft } from "@/app/actions/waiver";
import LottieAnimation from "@/components/SuccessCheck";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const rawWaiverId = params.id;
  const waiverId = Number(rawWaiverId);

  const [waiver, setWaiver] = useState<any>(null);
  const [children, setChildren] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaiverData = async () => {
      if (!waiverId) return;

      const waiverRes = await getWaiverDraft(waiverId);

      if (waiverRes.success && waiverRes.data) {
        if (
          waiverRes.data.submittedAt != null ||
          waiverRes.data.submittedAt != undefined
        ) {
          const childrenRes = await getChildren(waiverId);
          if (childrenRes.success && childrenRes.data) {
            setChildren(childrenRes.data);
          }
          setWaiver(waiverRes.data);
        }
      } else {
        setError(waiverRes.error || "Failed to load waiver data");
      }
    };

    fetchWaiverData();
  }, [waiverId]);

  const calculateAge = (dobString: string): number => {
    const today = new Date();
    const birthDate = new Date(dobString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex flex-col justify-center gap-2 items-center">
        <LottieAnimation />
        <h1 className="text-3xl font-extrabold">Waiver complete!</h1>
        <p className="text-muted-foreground">
          Please show this screen to our staff members at the reception desk.
        </p>
      </div>
      <div className="bg-muted-background p-4 rounded-sm flex flex-col gap-4 text-xl font-extrabold leading-loose">
        {waiver ? (
          <>
            <ul>
              <li>{waiver.guardian.name}</li>
              <li>{waiver.guardian.phone}</li>
            </ul>
            <Separator />
            <ul>
              {children.map((child: any) => (
                <li key={child.id}>
                  {child.name} ({calculateAge(child.dob)})
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>{error}</p>
        )}
      </div>
    </div>
  );
};

export default Page;
