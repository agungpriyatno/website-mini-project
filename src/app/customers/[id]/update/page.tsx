import { CustomerUpdate } from "@/components/customer-update";
import { customerFind } from "@/lib/server/actions/customer";

type CustomerUpdatePageProps = {
  params: Promise<{ id: string }>;
};

const CustomerUpdatePage = async ({ params }: CustomerUpdatePageProps) => {
  const { id } = await params;
  const data = await customerFind(id);
  if (!data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Customer not found</h1>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <CustomerUpdate data={data} />
    </main>
  );
};

export default CustomerUpdatePage;
