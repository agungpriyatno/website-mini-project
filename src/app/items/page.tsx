import { ItemTable } from "@/components/item-table";
import { itemFindMany } from "@/lib/server/actions/item";
import { searchParamsCache } from "@/lib/server/services/search-params";

type ItemPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const ItemPage = async ({ searchParams }: ItemPageProps) => {
  const params = await searchParamsCache.parse(searchParams);
  const { data, totalPages } = await itemFindMany(params);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <ItemTable data={data} totalPages={totalPages} />
    </main>
  );
};

export default ItemPage;
