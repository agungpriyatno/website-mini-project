import { OrderDetail } from "@/components/order-detail";
import { orderFind } from "@/lib/server/actions/order";

type SaleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const SaleDetailPage = async ({ params }: SaleDetailPageProps) => {
  const { id } = await params;
  const data = await orderFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Sale not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <OrderDetail data={data} />
    </main>
  );
};

export default SaleDetailPage;
