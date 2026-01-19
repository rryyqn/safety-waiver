import { getAdminWaivers } from "@/app/actions/admin";

export default async function AdminDashboard() {
  const waivers = await getAdminWaivers();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Waiver Administration</h1>
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