import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/d";
import { calculateAge } from "@/lib/utils";
import { Check, Mail, Printer } from "lucide-react";


 export default async function WaiverDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    
    const waiver = await db.waiver.findUnique({
      where: { id: parseInt(id) },
      include: { guardian: { include: { children: true } }, agreement: true }
    });
  
    if (!waiver) return <div>Waiver not found.</div>;
  
    return (
      <div className="py-10 px-4 sm:p-10 w-full h-full flex flex-col gap-8 text-sm">
        <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Waivers</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        <BreadcrumbPage>
          {waiver.guardian.name}
        </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div className="flex flex-col gap-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
    <h1 className="font-bold text-3xl flex items-center gap-2">Waiver #{id}</h1>
    <p className="bg-accent rounded-xs px-2 w-fit text-muted-foreground py-0.5">Signed: {waiver.submittedAt?.toLocaleDateString()}</p>
    </div>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" size="dashboard"><Mail /> Email Waiver</Button>
        <Button variant="secondary" size="dashboard"><Printer /> Print Waiver</Button>
      </div>
    <Separator />
    </div>

    
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col gap-4 border border-input rounded-xs py-3 px-4">

    <h2 className="font-bold text-xl">Guardian</h2>
    <div className="flex flex-col">
    <p className="text-muted text-sm">Full Name</p>
    <p>{waiver.guardian.name}</p>
    </div>
    <div className="flex flex-col">
    <p className="text-muted text-sm">Phone Number</p>
    <p>{waiver.guardian.phone}</p>
    </div>
    <div className="flex flex-col">
    <p className="text-muted text-sm">Email Address</p>
    <p>{waiver.guardian.email}</p>
    </div>
    </div>
    <div className="flex flex-col gap-4 border border-input rounded-xs py-3 px-4">
    <div className="flex flex-row justify-between items-center">
    <h2 className="font-bold text-xl">Participating Minors</h2>
<span className="bg-accent text-muted-foreground p-1 rounded-full flex items-center justify-center w-6 h-6">{waiver.guardian.children.length}</span>
    </div>
    <div className="flex flex-col gap-2">

      {waiver.guardian.children.map((child) => (
        <div key={child.id} className="flex flex-col border-input border p-2 rounded-xs sm:flex-row justify-between">
          <p>{child.name}</p>
          <div>
            <p className="text-muted">{child.dob?.toLocaleDateString(undefined, { dateStyle: "medium" })} (Age {calculateAge(child.dob!)})</p>
            </div>
        </div>
      ))}

    </div>

    </div>
    <div className="flex flex-col gap-4 border border-input rounded-xs py-3 px-4 md:col-span-2">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
    <h2 className="font-bold text-xl">Safety Agreement</h2>
    <span className="text-muted-foreground px-2 py-0.5 rounded-xs bg-accent w-fit">Version 1.0</span>
      </div>
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center"><Check className="size-4" /> Agreed to the Rules Agreement</div>
      <div className="flex flex-row gap-2 items-center"><Check className="size-4" /> Agreed to the Risks Agreement</div>
      <div className="flex flex-row gap-2 items-center"><Check className="size-4" /> Agreed to the Medical Agreement</div>
    </div>
    <div>Agreement signed by {waiver.guardian.name} at {waiver.submittedAt?.toLocaleString()}</div>

    </div>
      </div>

      </div>
    );
  }