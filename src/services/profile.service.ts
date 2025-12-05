/**
 * Profile Service - Business logic only
 * NO database queries - calls client/server functions
 */

export type ProfileUpdate = {
  full_name?: string;
  avatar_url?: string | null;
};

// Services for business logic transformations, validations, etc.
// For simple CRUD, use client/server functions directly
