import { getTenantsByOrganizationIdServer } from "@/lib/server";
import React from "react";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  const { orgId } = await params;

  const tenants = await getTenantsByOrganizationIdServer(orgId);
  console.log(tenants);

  return (
    <div>
      OrgPage {orgId}
      <div>Tenants: {tenants.length}</div>
    </div>
  );
}
