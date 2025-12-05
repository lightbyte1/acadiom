import { getTenantsByOrganizationIdServer } from "@/lib/server/tenants.server";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const { orgId } = await params;

  const tenants = await getTenantsByOrganizationIdServer(orgId);

  return (
    <div>
      OrgPage {orgId}
      <div>Tenants: {tenants.length}</div>
      {children}
    </div>
  );
}
