"use client";
import { usePathname } from "next/navigation";
import { WaiverStepper } from "@/components/WaiverStepper";

export default function WaiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSuccessPage = pathname.endsWith("/success");

  const getStepIndex = () => {
    if (pathname.includes("guardian")) return 1;
    if (pathname.includes("children")) return 2;
    if (pathname.includes("agreement")) return 3;
    return 0;
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-150 mx-auto flex items-center px-8 flex-col gap-8 justify-center bg-background rounded-sm py-10 shadow-[0px_0px_5px_-2px_#00000024]">
        {!isSuccessPage && <WaiverStepper currentStepIndex={getStepIndex()} />}
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
