import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Calendar, Tag } from "lucide-react";
import { Subcategory } from "@/types/subcategory";

interface SubcategoryTableProps {
  subcategories: Subcategory[];
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (id: string) => void;
  onDetails: (subcategory: Subcategory) => void;
  actionLoading: boolean;
}

export const SubcategoryTable = ({
  subcategories,
  onEdit,
  onDelete,
  onDetails,
  actionLoading,
}: SubcategoryTableProps) => {
  return (
    <div className="mt-4">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block">
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Facilities</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories &&
              subcategories.map((subcategory) => (
                <TableRow key={subcategory._id}>
                  <TableCell className="font-medium">
                    <button
                      className="hover:underline text-left"
                      onClick={() => onDetails(subcategory)}
                    >
                      {subcategory?.name}
                    </button>
                  </TableCell>
                  <TableCell>{subcategory?.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subcategory?.facilities
                        ?.slice(0, 3)
                        .map((facility, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {facility.label}
                          </span>
                        ))}
                      {subcategory?.facilities?.length > 3 && (
                        <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                          +{subcategory.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        subcategory?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subcategory?.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(subcategory?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(subcategory)}
                      disabled={actionLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-[#1F058F]"
                      size="icon"
                      onClick={() => onDelete(subcategory._id)}
                      disabled={actionLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="md:hidden space-y-4">
        {subcategories &&
          subcategories.map((subcategory) => (
            <div
              key={subcategory._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <button
                  className="font-medium text-lg hover:underline text-left"
                  onClick={() => onDetails(subcategory)}
                >
                  {subcategory?.name}
                </button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(subcategory)}
                    disabled={actionLoading}
                    className="px-2 py-1"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-[#1F058F] hover:bg-[#1F058F]/90 px-2 py-1"
                    size="sm"
                    onClick={() => onDelete(subcategory._id)}
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 mb-3 line-clamp-2">
                {subcategory?.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    subcategory?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {subcategory?.status}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(subcategory?.createdAt).toLocaleDateString()}
                </div>
              </div>

              {subcategory?.facilities && subcategory.facilities.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Facilities ({subcategory.facilities.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {subcategory.facilities.slice(0, 4).map((facility, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {facility.label}
                      </span>
                    ))}
                    {subcategory.facilities.length > 4 && (
                      <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                        +{subcategory.facilities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
