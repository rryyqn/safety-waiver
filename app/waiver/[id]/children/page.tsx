"use client";
import { getWaiverDraft } from "@/app/actions/waiver";
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

  return <div></div>;
};

export default Page;
