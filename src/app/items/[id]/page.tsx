import { ItemDetail } from "@/components/item-detail";
import { itemFind } from "@/lib/server/actions/item";

type ItemDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ItemDetailPage = async ({ params }: ItemDetailPageProps) => {
  const { id } = await params;
  const data = await itemFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Customer not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <ItemDetail data={data} />
    </main>
  );
};

export default ItemDetailPage;
