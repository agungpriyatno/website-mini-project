import { ProductUpdate } from "@/components/product-update";
import { productFind } from "@/lib/server/actions/product";


type ProductUpdatePageProps = {
  params: Promise<{ id: string }>;
};

const ProductUpdatePage = async ({ params }: ProductUpdatePageProps) => {
  const { id } = await params;
  const data = await productFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Item not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <ProductUpdate data={data} />
    </main>
  );
};

export default ProductUpdatePage;
