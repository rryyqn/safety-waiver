"use client";

import { useState } from "react";
import {
  createWaiver,
  updateGuardian,
  updateChildren,
  submitWaiver,
} from "@/app/actions/waiver";

export default function TestPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<any>(null);

  // These IDs will be populated after Step 1
  const [guardianId, setGuardianId] = useState<number | null>(null);
  const [waiverId, setWaiverId] = useState<number | null>(null);

  return (
    <div className="p-10 space-y-8 font-mono text-sm">
      <h1 className="text-2xl font-bold">Waiver Backend Tester</h1>

      {/* STEP 1: INITIATE */}
      <section className="border p-4 space-y-2">
        <h2 className="font-bold">Step 1: Email Entry</h2>
        <input
          className="border p-1 text-black"
          placeholder="email@test.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 ml-2"
          onClick={async () => {
            const res = await createWaiver(email);
            setStatus(res);
            if (res.success && res.data) {
              setGuardianId(res.data.id);
              setWaiverId(res.data.waiver?.id);
            }
          }}
        >
          Run initiateWaiver
        </button>
      </section>

      {/* STEP 2: GUARDIAN DRAFT */}
      <section className="border p-4 space-y-2">
        <h2 className="font-bold">
          Step 2: Update Guardian (ID: {guardianId})
        </h2>
        <button
          className="bg-green-600 text-white px-4 py-1"
          disabled={!guardianId}
          onClick={async () => {
            const res = await updateGuardian(guardianId!, {
              name: "Test Guardian",
              phone: "123-456-7890",
              dob: "1990-01-01",
            });
            setStatus(res);
          }}
        >
          Save Guardian Info
        </button>
      </section>

      {/* STEP 3: CHILDREN */}
      <section className="border p-4 space-y-2">
        <h2 className="font-bold">Step 3: Save Children</h2>
        <button
          className="bg-purple-600 text-white px-4 py-1"
          disabled={!guardianId}
          onClick={async () => {
            const res = await updateChildren(guardianId!, [
              { name: "Child One", dob: "2015-05-10" },
              { name: "Child Two", dob: "2018-08-20" },
            ]);
            setStatus(res);
          }}
        >
          Save 2 Children
        </button>
      </section>

      {/* STEP 4: SUBMIT */}
      <section className="border p-4 space-y-2">
        <h2 className="font-bold">
          Step 4: Final Submit (Waiver ID: {waiverId})
        </h2>
        <button
          className="bg-red-600 text-white px-4 py-1"
          disabled={!waiverId}
          onClick={async () => {
            const res = await submitWaiver(waiverId!, {
              safetyRules: true,
              liability: true,
              medicalConsent: true,
              signature: "Digital Signature Test",
            });
            setStatus(res);
          }}
        >
          Finalize Waiver
        </button>
      </section>

      {/* OUTPUT LOG */}
      <section className="bg-gray-100 p-4 rounded text-black">
        <h2 className="font-bold mb-2">Server Response:</h2>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </section>
    </div>
  );
}
