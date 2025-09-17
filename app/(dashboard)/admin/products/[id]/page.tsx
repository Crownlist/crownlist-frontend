import ProductDetailsClient from './product-details-client';





export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
  
  return <ProductDetailsClient productId={productId} />;
}

