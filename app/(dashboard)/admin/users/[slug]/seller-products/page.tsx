import { SellerProducts } from "./seller-products";

export default async function SellerProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params since they're now async in Next.js 15
  const resolvedParams = await params;
  console.log("params", resolvedParams);
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sellers&apos; Products</h1>
      </div>
      <SellerProducts />
    </div>
  );
}