import { ApiError, resumeItem } from "@/shared/api/server/menu-store";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const item = await resumeItem(id);
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
