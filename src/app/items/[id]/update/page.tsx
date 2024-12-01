import { ItemUpdate } from "@/components/item-update";
import { itemFind } from "@/lib/server/actions/item";

type ItemUpdatePageProps = {
  params: Promise<{ id: string }>;
};

const ItemUpdatePage = async ({ params }: ItemUpdatePageProps) => {
  const { id } = await params;
  const data = await itemFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Item not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <ItemUpdate data={data} />
    </main>
  );
};

export default ItemUpdatePage;
