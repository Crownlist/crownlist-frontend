import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import { EditCategoryModal } from "./EditCategoryModal";

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

interface CategoryTableProps {
  categories: Category[];
  onCategoryUpdated: () => void;
  onCategoryDeleted: () => void;
}

export function CategoryTable({
  categories,
  onCategoryUpdated,
  onCategoryDeleted,
}: CategoryTableProps) {
  const router = useRouter();

  // Delete category (standalone delete button)
  const handleDeleteCategory = async (id: string) => {
    try {
      await apiClientAdmin.delete(`/categories/delete/${id}`);
      toast.success("Category deleted successfully");
      onCategoryDeleted();
    } catch (error) {
      toast.error(`Failed to delete category, ${error}`);
    }
  };

  return (
    <div className="hidden lg:block">
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.length > 0 &&
            categories?.map((category) => (
              <TableRow key={category?._id}>
                <TableCell
                  className="font-medium cursor-pointer text-[#1F058F]"
                  onClick={() =>
                    router.push(`/admin/categories/${category._id}`)
                  }
                >
                  {category?.name}
                </TableCell>
                <TableCell>{category?.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      category?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category?.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(category?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <EditCategoryModal
                    category={category}
                    onCategoryUpdated={onCategoryUpdated}
                    onCategoryDeleted={onCategoryDeleted}
                  />
                  <Button
                    className="bg-[#1F058F]"
                    size="icon"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
