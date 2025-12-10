import Image from "next/image";
import { Check } from "lucide-react";
import { Category } from "../types";

interface CategorySelectionStepProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  loading: boolean;
}

export const CategorySelectionStep = ({
  categories,
  selectedCategory,
  onCategorySelect,
  loading,
}: CategorySelectionStepProps) => {
  if (loading) {
    return (
      <div className="flex-1">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Category</h2>
        <p className="text-gray-500 mb-6">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-1">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Category</h2>
        <p className="text-gray-500 mb-6">Select post category below</p>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between gap-10 flex-1">
        <div className="order-2 md:order-1 grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => onCategorySelect(cat._id)}
              className={`relative rounded-lg overflow-hidden group cursor-pointer border transition ${
                selectedCategory === cat._id
                  ? "border-[#1F058F] border-2 shadow-lg"
                  : "border-gray-200 hover:shadow-md"
              }`}
            >
              <Image
                src={cat.imageUrl || "/assets/images/default-category.png"}
                alt={cat.name}
                width={400}
                height={250}
                className="w-full h-28 sm:h-36 md:h-60 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-end p-3 md:p-4">
                <span className="text-white text-sm md:text-lg font-semibold">
                  {cat.name}
                </span>
              </div>
              {selectedCategory === cat._id && (
                <div className="absolute -top-0.5 -right-0.5 bg-[#1F058F] rounded-bl-[30px] p-2 md:p-5">
                  <Check className="text-white w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
