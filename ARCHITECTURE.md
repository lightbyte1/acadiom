# Data Fetching Architecture

## 📁 Directory Structure

```
src/
├── services/              # Business logic ONLY (NO database queries)
│   ├── profile.service.ts
│   ├── organizations.service.ts
│   ├── tenants.service.ts
│   └── index.ts
│
├── lib/
│   ├── server/           # Server-side database queries
│   │   ├── profile.server.ts
│   │   ├── organizations.server.ts
│   │   ├── tenants.server.ts
│   │   └── index.ts
│   │
│   ├── client/           # Client-side database queries
│   │   ├── profile.client.ts
│   │   ├── organizations.client.ts
│   │   ├── tenants.client.ts
│   │   └── index.ts
│   │
│   └── supabase/         # Supabase client factories
│       ├── client.ts     # Browser client
│       ├── server.ts     # Server client
│       └── middleware.ts # Middleware client
│
├── hooks/
│   ├── queries/          # React Query hooks for fetching
│   │   ├── useProfile.ts
│   │   ├── useOrganizations.ts
│   │   ├── useTenants.ts
│   │   └── index.ts
│   │
│   └── mutations/        # React Query hooks for mutations
│       ├── useUpdateProfile.ts
│       └── index.ts
│
└── contexts/
    └── dashboard/
        └── DashboardContext.tsx  # Simplified context using hooks
```

## 🏗️ Architecture Layers

### 1. **Client/Server Layer** (`/lib/client` and `/lib/server`)
- **Purpose**: ALL database queries go here
- **Characteristics**:
  - Direct Supabase queries
  - Creates appropriate Supabase client
  - Simple CRUD operations
  - Environment-specific (client vs server)

**Example:**
```typescript
// lib/client/profile.client.ts
export async function getProfileClient(userId: string) {
  const supabase = createClient(); // Browser client
  const { data } = await supabase.from("users").select("*").eq("id", userId).single();
  return data;
}
```

### 2. **Services Layer** (`/services`)
- **Purpose**: Business logic ONLY
- **Characteristics**:
  - NO database queries
  - NO Supabase client creation
  - Calls client/server functions
  - Combines data from multiple sources
  - Handles business rules and transformations

**Example:**
```typescript
// services/organizations.service.ts
export async function getOrganizationWithTenants(
  getOrgById: (id: string) => Promise<Organization | null>,
  getTenantsByOrgId: (id: string) => Promise<Tenant[]>,
  organizationId: string
): Promise<OrganizationWithTenants | null> {
  const organization = await getOrgById(organizationId);
  if (!organization) return null;
  
  const tenants = await getTenantsByOrgId(organizationId);
  
  return { ...organization, tenants };
}
```

### 3. **Hooks Layer** (`/hooks`)
- **Purpose**: React Query integration
- **Characteristics**:
  - Uses client functions
  - Manages caching, loading states, errors
  - Provides React-friendly API

**Example:**
```typescript
// hooks/queries/useProfile.ts
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileClient(userId!),
    enabled: !!userId,
  });
}
```

### 4. **Contexts Layer** (`/contexts`)
- **Purpose**: Simplified state management
- **Characteristics**:
  - Uses React Query hooks internally
  - Provides convenient API for components
  - Handles initial data from SSR

## 🔄 Data Flow

### Server-Side Rendering (SSR)
```
Server Component
  → lib/server/*.server.ts (database query)
    → services/*.service.ts (business logic, if needed)
      → Returns combined/transformed data
```

### Client-Side Rendering (CSR)
```
React Component
  → hooks/queries/*.ts
    → lib/client/*.client.ts (database query)
      → services/*.service.ts (business logic, if needed)
        → Returns combined/transformed data
```

### Middleware
```
Middleware
  → Direct Supabase query (uses middleware client)
    → No services needed for simple queries
```

## 📝 Usage Examples

### Server Component
```typescript
// app/dashboard/layout.tsx
import { getOrganizationsServer } from "@/lib/server/organizations.server";

export default async function Layout() {
  const orgs = await getOrganizationsServer(userId);
  return <DashboardProvider initialOrgs={orgs}>...</DashboardProvider>;
}
```

### Complex Business Logic (Server)
```typescript
// app/org/[id]/page.tsx
import { getOrganizationWithTenantsServer } from "@/lib/server/organizations.server";

export default async function OrgPage({ params }) {
  const orgWithTenants = await getOrganizationWithTenantsServer(params.id);
  // Returns: { ...organization, tenants: [...] }
}
```

### Client Component with Hook
```typescript
// components/MyComponent.tsx
"use client";
import { useProfile } from "@/hooks/queries";

export default function MyComponent({ userId }: { userId: string }) {
  const { data: profile, isLoading } = useProfile(userId);
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{profile?.full_name}</div>;
}
```

### Complex Business Logic (Client)
```typescript
// components/OrgDetails.tsx
"use client";
import { useOrganizationWithTenants } from "@/hooks/queries";

export default function OrgDetails({ orgId }: { orgId: string }) {
  const { data: orgWithTenants } = useOrganizationWithTenants(orgId);
  // orgWithTenants = { ...organization, tenants: [...] }
}
```

### Mutation
```typescript
// components/UpdateProfileForm.tsx
"use client";
import { useUpdateProfile } from "@/hooks/mutations";

export default function UpdateProfileForm() {
  const mutation = useUpdateProfile();
  
  const handleSubmit = async (data: ProfileUpdate) => {
    await mutation.mutateAsync(data);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## ✅ Key Principles

1. **Client/Server = Database Queries**: All Supabase queries live here
2. **Services = Business Logic**: No database queries, only orchestration
3. **Separation of Concerns**: Clear boundaries between layers
4. **Reusability**: Services can work with both client and server functions
5. **Type Safety**: Full TypeScript support throughout
6. **Testability**: Easy to test services (mock client/server functions)

## 🚀 Adding New Entities

To add a new entity (e.g., `Courses`):

1. **Create client queries**: `lib/client/courses.client.ts`
   ```typescript
   export async function getCoursesClient(userId: string) {
     const supabase = createClient();
     return supabase.from("courses").select("*").eq("user_id", userId);
   }
   ```

2. **Create server queries**: `lib/server/courses.server.ts`
   ```typescript
   export async function getCoursesServer(userId: string) {
     const supabase = await createServerClient();
     return supabase.from("courses").select("*").eq("user_id", userId);
   }
   ```

3. **Create service (if complex logic needed)**: `services/courses.service.ts`
   ```typescript
   export async function getCourseWithLessons(
     getCourse: (id: string) => Promise<Course | null>,
     getLessons: (courseId: string) => Promise<Lesson[]>,
     courseId: string
   ) {
     const course = await getCourse(courseId);
     const lessons = await getLessons(courseId);
     return { ...course, lessons };
   }
   ```

4. **Create hooks**: `hooks/queries/useCourses.ts`
   ```typescript
   export function useCourses(userId: string | undefined) {
     return useQuery({
       queryKey: ["courses", userId],
       queryFn: () => getCoursesClient(userId!),
       enabled: !!userId,
     });
   }
   ```

## 🎯 Summary

- **`/lib/client`** and **`/lib/server`** = Database queries (Supabase)
- **`/services`** = Business logic (calls client/server, no Supabase)
- **`/hooks`** = React Query integration
- **`/contexts`** = Simplified state management

This architecture ensures clear separation, easy testing, and maintainable code!
