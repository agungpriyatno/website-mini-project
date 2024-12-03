
import { OrderTable } from "@/components/order-table";
import { orderFindMany } from "@/lib/server/actions/order";
import { searchParamsSaleCache } from "@/lib/server/services/search-params";

type OrderPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const OrderPage = async ({ searchParams }: OrderPageProps) => {
  const params = await searchParamsSaleCache.parse(searchParams);
  const { data, totalPages } = await orderFindMany(params);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <OrderTable data={data} totalPages={totalPages} />
    </main>
  );
};

export default OrderPage;
