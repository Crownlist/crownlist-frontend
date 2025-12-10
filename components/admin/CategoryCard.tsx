import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryIcon: string;
  status: string;
  createdAt: string;
}

interface CategoryCardProps {
  category: Category;
  onEditCategory: (category: Category) => void;
  onCategoryDeleted: () => void;
}

export function CategoryCard({
  category,
  onEditCategory,
  onCategoryDeleted,
}: CategoryCardProps) {
  const router = useRouter();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      await apiClientAdmin.delete(`/categories/delete/${id}`);
      toast.success("Category deleted successfully");
      onCategoryDeleted();
      setActiveDropdown(null);
    } catch (error) {
      toast.error(`Failed to delete category, ${error}`);
    }
  };

  const isExpanded = expandedCards.has(category._id);

  return (
    <div className="bg-white rounded-lg border shadow-sm relative">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {category.imageUrl && (
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div
                className="font-medium text-base text-gray-900 cursor-pointer hover:text-[#1F058F]"
                onClick={() => router.push(`/admin/categories/${category._id}`)}
              >
                {category.name}
              </div>
              <p className="text-sm text-gray-500 truncate mb-2">
                {category.slug}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    category.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCardExpansion(category._id)}
                  className="p-1 h-8 w-8"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Card Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="mt-1">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="mt-1 text-gray-700">{category.description}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDropdown(category._id)}
                className="h-8"
              >
                <MoreHorizontal className="h-4 w-4 mr-1" />
                Actions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Actions Dropdown - positioned outside card to avoid clipping */}
      {activeDropdown === category._id && (
        <div className="absolute top-full right-4 mt-1 w-40 bg-white rounded-md shadow-lg z-50 border">
          <div className="py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onEditCategory(category);
                setActiveDropdown(null);
              }}
            >
              Edit Category
            </button>
            <button
              onClick={() => {
                handleDeleteCategory(category._id);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Delete Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
