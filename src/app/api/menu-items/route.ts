import { NextRequest } from "next/server";
import { shopSchema, statusFilterSchema } from "@/entities/menu-item";
import { listMenuItems } from "@/shared/api/server/menu-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const shopValue = shopSchema.safeParse(
    request.nextUrl.searchParams.get("shop"),
  );
  const statusValue = statusFilterSchema.safeParse(
    request.nextUrl.searchParams.get("status"),
  );
  const items = await listMenuItems({
    shop: shopValue.success ? shopValue.data : undefined,
    status: statusValue.success ? statusValue.data : undefined,
  });
  return Response.json(items, {
    headers: { "Cache-Control": "no-store" },
  });
}
