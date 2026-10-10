import { isLocalAdminApiOrigin } from "@/shared/lib/helpers/localAuth";

export const LOCAL_ADMIN_AUTH_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_LOCAL_ADMIN_AUTH === true;

export function canUseLocalAdminAuth(origin: string): boolean {
  return LOCAL_ADMIN_AUTH_ENABLED && isLocalAdminApiOrigin(origin);
}
