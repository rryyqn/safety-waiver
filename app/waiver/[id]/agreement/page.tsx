import { getWaiverProgress } from "@/app/actions/waiver";
import { redirect } from "next/navigation";
import AgreementForm from "@/components/AgreementForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const progress = await getWaiverProgress(id);
  const restrictedSteps = ["agreement", "success"];

  if (!progress.exists || !progress.data) redirect("/");
  if (!restrictedSteps.includes(progress.allowedStep))
    redirect(`/waiver/${id}/${progress.allowedStep}`);

  return (
    <AgreementForm
      waiverId={id}
      guardianId={progress.data.guardianId}
      initialData={{
        submittedAt: progress.data.submittedAt,
        agreement: progress.data.agreement,
        guardianName: progress.data.guardian.name,
      }}
    />
  );
}
