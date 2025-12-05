import React from "react";

export default async function TenantCoursesPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <p className="text-muted-foreground">
        Manage courses for this platform. Tenant ID: {tenantId}
      </p>
    </div>
  );
}
