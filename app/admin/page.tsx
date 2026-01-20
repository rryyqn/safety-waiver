import { getFilteredWaivers } from "@/app/actions/admin";
import FilterBar from "@/components/FilterBar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{search: string; from: string; to: string}>; }) {

  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin-session")?.value;

  if (adminSession !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const waivers = await getFilteredWaivers({
    search: params.search,
    startDate: params.from ? new Date(params.from) : undefined,
    endDate: params.to ? new Date(params.to) : undefined,
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Waiver Administration</h1>
      <FilterBar />
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-4">Guardian</th>
              <th className="p-4">Email</th>
              <th className="p-4">Children</th>
              <th className="p-4">Signed Date</th>
              <th className="p-4">Signature</th>
            </tr>
          </thead>
          <tbody>
            {waivers.map((w) => (
              <tr key={w.id} className="border-t hover:bg-muted/50">
                <td className="p-4 font-medium">{w.guardian.name}</td>
                <td className="p-4">{w.guardian.email}</td>
                <td className="p-4">{w.guardian.children.map((child) => <p key={child.id}>{child.name}</p>)}</td>
                <td className="p-4">
                  {w.submittedAt?.toLocaleDateString()}
                </td>
                <td className="p-4 italic text-sm">{w.agreement?.signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}