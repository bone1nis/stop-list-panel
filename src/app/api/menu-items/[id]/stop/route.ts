import { stopItemPayloadSchema } from "@/entities/menu-item";
import { ApiError, stopItem } from "@/shared/api/server/menu-store";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Некорректное тело запроса" },
      { status: 400 },
    );
  }

  const parsed = stopItemPayloadSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Некорректные данные";
    return Response.json({ message }, { status: 400 });
  }

  try {
    const item = await stopItem(id, parsed.data);
    return Response.json(item);
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
