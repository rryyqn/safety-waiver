import { getWaiverProgress } from "@/app/actions/waiver";
import { redirect } from "next/navigation";
import GuardianForm from "@/components/GuardianForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const progress = await getWaiverProgress(id);
  const restrictedSteps = ["guardian", "children", "agreement", "success"];

  if (!progress.exists || !progress.data) redirect("/");
  if (!restrictedSteps.includes(progress.allowedStep)) redirect(`/`);

  return (
    <GuardianForm
      waiverId={id}
      guardianId={progress.data.guardianId}
      initialData={progress.data.guardian}
    />
  );
}
