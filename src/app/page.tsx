import { TotalPriceCard } from "@/components/total-price-card";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <TotalPriceCard/>
      </div>
    </main>
  );
}
