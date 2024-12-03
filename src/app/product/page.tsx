import { ProductTable } from "@/components/product-table";
import { productFindMany } from "@/lib/server/actions/product";
import { searchParamsCache } from "@/lib/server/services/search-params";

type ProductPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const ProductPage = async ({ searchParams }: ProductPageProps) => {
  const params = await searchParamsCache.parse(searchParams);
  const { data, totalPages } = await productFindMany(params);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <ProductTable data={data} totalPages={totalPages} />
    </main>
  );
};

export default ProductPage;
