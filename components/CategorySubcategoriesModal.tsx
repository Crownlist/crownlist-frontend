"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category, Subcategory } from "@/types/category/category";
import { useRouter } from "next/navigation";

interface CategorySubcategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function CategorySubcategoriesModal({
  isOpen,
  onClose,
  category,
}: CategorySubcategoriesModalProps) {
  const router = useRouter();

  if (!category) return null;

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    router.push(`/${category.slug}/${subcategory.slug}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category.name} Subcategories</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {category.subCategories?.map((subcategory) => (
            <Button
              key={subcategory._id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              {subcategory.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
