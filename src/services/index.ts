/**
 * Services - Business logic layer
 * NO database queries - services call client/server functions
 *
 * Services handle complex business logic like:
 * - Combining data from multiple sources
 * - Data transformations
 * - Business rules and validations
 * - Orchestrating multiple operations
 */

export * from "./profile.service";
export * from "./organizations.service";
export * from "./tenants.service";
