import { SaleUpdate } from "@/components/sale-update";
import { saleFind } from "@/lib/server/actions/sale";

type SaleUpdatePageProps = {
  params: Promise<{ id: string }>;
};

const SaleUpdatePage = async ({ params }: SaleUpdatePageProps) => {
  const { id } = await params;
  const data = await saleFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Item not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <SaleUpdate data={data} />
    </main>
  );
};

export default SaleUpdatePage;
