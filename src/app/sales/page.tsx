import { SaleTable } from "@/components/sale-table";
import { saleFindMany } from "@/lib/server/actions/sale";
import { searchParamsSaleCache } from "@/lib/server/services/search-params";

type SalePageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const SalePage = async ({ searchParams }: SalePageProps) => {
  const params = await searchParamsSaleCache.parse(searchParams);
  const { data, totalPages } = await saleFindMany(params);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <SaleTable data={data} totalPages={totalPages} />
    </main>
  );
};

export default SalePage;
