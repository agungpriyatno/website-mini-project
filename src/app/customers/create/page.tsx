import { CustomerCreate } from "@/components/customer-create";

const CreateCustomerPage = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <CustomerCreate />
    </main>
  );
};

export default CreateCustomerPage;
