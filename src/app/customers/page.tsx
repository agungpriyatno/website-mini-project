import { CustomerTable } from "@/components/customer-table";
import { customerFindMany } from "@/lib/server/actions/customer";
import { searchParamsCache } from "@/lib/server/services/search-params";

type CustomerPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const CustomerPage = async ({ searchParams }: CustomerPageProps) => {
  const params = await searchParamsCache.parse(searchParams);
  const { data, totalPages } = await customerFindMany(params);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <CustomerTable data={data} totalPages={totalPages} />
    </main>
  );
};

export default CustomerPage;
