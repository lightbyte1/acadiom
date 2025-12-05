import React from "react";

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Overview</h1>
      <p className="text-muted-foreground">Tenant ID: {tenantId}</p>
      <p className="text-muted-foreground mt-2">
        This is the tenant overview page. Add your content here.
      </p>
    </div>
  );
}
