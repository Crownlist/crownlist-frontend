import { SellerProducts } from "./seller-products";

export default function SellerProductsPage({
  params,
}: {
  params: { slug: string };
}) {
  console.log("params", params)
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Seller &apos; s Products</h1>
      </div>
      <SellerProducts />
    </div>
  );
}
