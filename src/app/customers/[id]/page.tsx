import { CustomerDetail } from "@/components/customer-detail";
import { customerFind } from "@/lib/server/actions/customer";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

const CustomerDetailPage = async ({ params }: CustomerDetailPageProps) => {
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
      <CustomerDetail data={data} />
    </main>
  );
};

export default CustomerDetailPage;
