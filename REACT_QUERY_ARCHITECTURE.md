# React Query + Supabase Architecture

## 📁 Folder Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client (for React Query)
│   │   ├── server.ts          # Server client (for Server Components/Actions)
│   │   └── middleware.ts      # Middleware client (for route protection)
│   │
│   ├── queries/               # React Query query functions (browser client)
│   │   ├── profile.ts
│   │   └── index.ts
│   │
│   └── mutations/             # React Query mutations (browser client)
│       ├── profile.ts
│       └── index.ts
│
├── hooks/
│   ├── queries/               # Custom React Query hooks
│   │   ├── useProfile.ts
│   │   └── index.ts
│   │
│   └── mutations/             # Custom mutation hooks
│       ├── useUpdateProfile.ts
│       └── index.ts
│
├── components/
│   └── providers/
│       ├── QueryProvider.tsx      # React Query provider
│       └── DashboardProvider.tsx  # Dashboard context + React Query
│
└── server/
    └── actions/               # Server Actions (server client)
        └── auth/
            └── getInitialAuthState.action.ts
```

## 🔄 Data Flow

### 1. Initial Load (SSR)
```
Server Component (layout.tsx)
  ↓
getInitialAuthState() [Server Client]
  ↓
DashboardProvider [initialData]
  ↓
React Query [initialData → cache]
```

### 2. Client-Side Updates
```
Client Component
  ↓
useQuery/useMutation [Browser Client]
  ↓
React Query Cache
  ↓
UI Update
```

## 📝 Usage Examples

### Using Dashboard Context (Recommended)
```tsx
"use client";
import { useDashboard } from "@/components/providers/DashboardProvider";

export default function MyComponent() {
  const { user, profile, isLoading } = useDashboard();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{profile?.full_name}</div>;
}
```

### Using React Query Directly
```tsx
"use client";
import { useProfile } from "@/hooks/queries/useProfile";

export default function MyComponent({ userId }: { userId: string }) {
  const { data: profile, isLoading } = useProfile(userId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{profile?.full_name}</div>;
}
```

### Using Mutations
```tsx
"use client";
import { useUpdateProfile } from "@/hooks/mutations/useUpdateProfile";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateProfileForm() {
  const mutation = useUpdateProfile();
  const queryClient = useQueryClient();
  
  const handleSubmit = async (data: ProfileUpdate) => {
    try {
      await mutation.mutateAsync(data);
      // Cache automatically invalidated and updated
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🎯 Key Principles

1. **Browser Client for React Query**: All queries/mutations use `createClient()` from `lib/supabase/client.ts`
2. **Server Client for Initial Data**: Server Components use `createServerClient()` from `lib/supabase/server.ts`
3. **Initial Data Pattern**: Server fetches data → passes as `initialData` → React Query takes over
4. **Cache Management**: React Query handles caching, refetching, and invalidation automatically
5. **Type Safety**: All clients use `Database` type from `@/types/supabase.types`

## 🔑 Query Keys

- Profile: `["profile", userId]`
- Add more as needed: `["organizations", userId]`, `["tenant", tenantId]`, etc.

## ⚙️ Configuration

React Query is configured in `src/components/providers/QueryProvider.tsx`:
- `staleTime`: 60 seconds (default)
- `refetchOnWindowFocus`: false
- `retry`: 1 (for both queries and mutations)

