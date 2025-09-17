import UserDetailsClient from "./seller-products/user-details-client";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UserDetailsPage({ params }: PageProps) {
  // Await the params since they're now async in Next.js 15
  const resolvedParams = await params;
  const userId = Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug;
  
  return <UserDetailsClient userId={userId} />;
}