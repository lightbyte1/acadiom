import { TenantProvider } from "@/contexts/dashboard/TenantContext";
import { getTenantByIdServer } from "@/lib/server/tenants.server";
import { redirect } from "next/navigation";
import React from "react";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const tenant = await getTenantByIdServer(tenantId);
  console.log(tenant)

  if (!tenant) {
    redirect("/dashboard");
  }

  return <TenantProvider initialTenant={tenant}>{children}</TenantProvider>;
}
