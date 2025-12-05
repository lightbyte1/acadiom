import { createServerClient } from "@/lib/supabase/server";
import React from "react";

export default async function TenantPage({
  params,
}: {
  params: { tenant: string };
}) {
  const { tenant } = await params;
  return <div>TenantPage {tenant}</div>;
}
