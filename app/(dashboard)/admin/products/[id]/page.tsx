import ProductDetailsClient from './product-details-client';
// import { Metadata } from 'next';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { id } = params;
  
  return <ProductDetailsClient productId={id} />;
}

export async function generateStaticParams() {
  // Pre-render the most popular products at build time
  return [];
}

export const dynamicParams = true;