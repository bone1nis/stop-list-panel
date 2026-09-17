import { parseFilters } from "@/features/stop-list/model/filters";
import { StopList } from "@/widgets/stop-list";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filters = parseFilters(params);
  return <StopList filters={filters} />;
}
