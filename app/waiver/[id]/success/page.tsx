import { getWaiverProgress } from "@/app/actions/waiver";
import { redirect } from "next/navigation";
import SuccessForm from "@/components/SuccessForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const progress = await getWaiverProgress(id);
  const restrictedSteps = ["success"];

  if (!progress.exists || !progress.data) redirect("/");
  if (!restrictedSteps.includes(progress.allowedStep))
    redirect(`/waiver/${id}/${progress.allowedStep}`);

  return <SuccessForm waiverId={id} finalData={progress.data.guardian} />;
}
