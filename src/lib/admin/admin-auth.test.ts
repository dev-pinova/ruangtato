import { describe, expect, it } from "vitest"

import { isPlatformRole, roleHasPermission } from "./admin-auth"

describe("Admin Auth", () => {
  describe("isPlatformRole", () => {
    it("should return true for valid platform roles", () => {
      expect(isPlatformRole("super_admin")).toBe(true)
      expect(isPlatformRole("admin")).toBe(true)
      expect(isPlatformRole("support")).toBe(true)
      expect(isPlatformRole("finance")).toBe(true)
    })

    it("should return false for invalid platform roles", () => {
      expect(isPlatformRole("user")).toBe(false)
      expect(isPlatformRole("owner")).toBe(false)
      expect(isPlatformRole(null)).toBe(false)
      expect(isPlatformRole(undefined)).toBe(false)
      expect(isPlatformRole("")).toBe(false)
    })
  })

  describe("roleHasPermission", () => {
    it("super_admin has all permissions", () => {
      expect(roleHasPermission("super_admin", "tenants:read")).toBe(true)
      expect(roleHasPermission("super_admin", "suspensions:write")).toBe(true)
      expect(roleHasPermission("super_admin", "settings:write")).toBe(true)
    })

    it("admin has limited read permissions", () => {
      expect(roleHasPermission("admin", "tenants:read")).toBe(true)
      expect(roleHasPermission("admin", "payments:read")).toBe(true)
      expect(roleHasPermission("admin", "analytics:read")).toBe(true)
      expect(roleHasPermission("admin", "audit:read")).toBe(true)

      // write permissions
      expect(roleHasPermission("admin", "suspensions:write")).toBe(false)
      expect(roleHasPermission("admin", "settings:write")).toBe(false)
    })

    it("support has tenant and payment read permissions", () => {
      expect(roleHasPermission("support", "tenants:read")).toBe(true)
      expect(roleHasPermission("support", "payments:read")).toBe(true)

      // No analytics or audit
      expect(roleHasPermission("support", "analytics:read")).toBe(false)
      expect(roleHasPermission("support", "audit:read")).toBe(false)
    })

    it("finance has payment and analytics read permissions", () => {
      expect(roleHasPermission("finance", "payments:read")).toBe(true)
      expect(roleHasPermission("finance", "analytics:read")).toBe(true)

      // No tenants or audit
      expect(roleHasPermission("finance", "tenants:read")).toBe(false)
      expect(roleHasPermission("finance", "audit:read")).toBe(false)
    })
  })
})
