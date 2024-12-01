import { SaleDetail } from "@/components/sale-detail";
import { saleFind } from "@/lib/server/actions/sale";

type SaleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const SaleDetailPage = async ({ params }: SaleDetailPageProps) => {
  const { id } = await params;
  const data = await saleFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Sale not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <SaleDetail data={data} />
    </main>
  );
};

export default SaleDetailPage;
