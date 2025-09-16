import UserDetailsClient from "./seller-products/user-details-client";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function UserDetailsPage({ params }: PageProps) {
  const userId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  return <UserDetailsClient userId={userId} />;
}

export function generateStaticParams() {
  return [];
}
