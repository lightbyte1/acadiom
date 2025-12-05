import React from "react";

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { orgId } = await params;

  return <div>OrgPage {orgId}</div>;
}
