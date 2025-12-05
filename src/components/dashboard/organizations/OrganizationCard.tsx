import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/types/supabase.types";
import React from "react";

type OrganizationCardProps =
  Database["public"]["Tables"]["organizations"]["Row"];

export default function OrganizationCard({ id, name }: OrganizationCardProps) {
  return (
    <Card hoverable href={`/dashboard/org/${id}`}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>Content</CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
