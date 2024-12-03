import { OrderUpdate } from "@/components/order-update";
import { orderFind } from "@/lib/server/actions/order";


type SaleUpdatePageProps = {
  params: Promise<{ id: string }>;
};

const SaleUpdatePage = async ({ params }: SaleUpdatePageProps) => {
  const { id } = await params;
  const data = await orderFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Item not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <OrderUpdate data={data} />
    </main>
  );
};

export default SaleUpdatePage;
