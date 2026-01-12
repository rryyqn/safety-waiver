"use client";

import { useEffect, useState } from "react";
import { getCompletedWaivers } from "@/app/actions/waiver";

export default function AdminTestPage() {
  const [waivers, setWaivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getCompletedWaivers();
      if (res.success) setWaivers(res.data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="p-10">Loading waivers...</div>;

  const getChildAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-6">Submitted Waivers</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Guardian</th>
              <th className="p-3">Email</th>
              <th className="p-3">Children</th>
              <th className="p-3">Signed Date</th>
              <th className="p-3">Signature</th>
            </tr>
          </thead>
          <tbody>
            {waivers.map((w) => (
              <tr key={w.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{w.guardian?.name}</td>
                <td className="p-3 text-gray-600">{w.guardian?.email}</td>
                <td className="p-3 flex flex-col">
                  {w.guardian?.children?.map((c: any) => (
                    <p key={c.id}>
                      {c.name} ({getChildAge(c.dob)})
                    </p>
                  ))}
                </td>
                <td className="p-3">
                  {new Date(w.submittedAt).toLocaleDateString()}
                </td>
                <td className="p-3 italic">"{w.agreement?.signature}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {waivers.length === 0 && (
        <p className="mt-4 text-gray-500">No submitted waivers found.</p>
      )}
    </div>
  );
}
