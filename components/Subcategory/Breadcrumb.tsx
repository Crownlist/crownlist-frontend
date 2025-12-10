import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  categorySlug: string;
  subcategorySlug: string;
}

export function Breadcrumb({ categorySlug, subcategorySlug }: BreadcrumbProps) {
  const formatTitle = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const categoryTitle = formatTitle(categorySlug);
  const subcategoryTitle = formatTitle(subcategorySlug);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-gray-700">
        Home
      </Link>
      <ChevronRight size={16} />
      <span className="hover:text-gray-700">{categoryTitle}</span>
      <ChevronRight size={16} />
      <span className="text-gray-700">{subcategoryTitle}</span>
    </div>
  );
}
