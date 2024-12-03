import { ProductDetail } from "@/components/product-detail";
import { productFind } from "@/lib/server/actions/product";


type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { id } = await params;
  const data = await productFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Customer not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <ProductDetail data={data} />
    </main>
  );
};

export default ProductDetailPage;
