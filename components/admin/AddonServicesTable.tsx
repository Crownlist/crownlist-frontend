import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AddOnService } from "@/types/addon-services";

interface AddonServicesTableProps {
  services: AddOnService[];
  loading: boolean;
  highlightId?: string | null;
  onEdit: (service: AddOnService) => void;
  onDelete: (service: AddOnService) => void;
}

export const AddonServicesTable: React.FC<AddonServicesTableProps> = ({
  services,
  loading,
  highlightId,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading add-ons...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">No add-on services found</p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Billing Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow
                key={s._id ?? s.name}
                id={s._id ? `addon-row-${s._id}` : undefined}
                className={
                  highlightId && s._id === highlightId
                    ? "bg-yellow-50"
                    : undefined
                }
              >
                <TableCell
                  className="font-medium cursor-pointer text-[#1F058F]"
                  onClick={() =>
                    s._id && router.push(`/admin/addon-services/${s._id}`)
                  }
                >
                  {s.name}
                </TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell>₦{Number(s.amount).toLocaleString()}</TableCell>
                <TableCell className="capitalize">{s.billing_cycle}</TableCell>
                <TableCell className="capitalize">{s.billing_type}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(s.status)}
                    className="capitalize"
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {s.createdAt
                    ? new Date(s.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(s);
                      }}
                    >
                      <Pencil className="h-4 w-4 text-[#1F058F]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Accordion View */}
      <div className="md:hidden space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {services.map((s) => (
            <AccordionItem
              key={s._id ?? s.name}
              value={s._id ?? s.name}
              className={`border rounded-lg ${
                highlightId && s._id === highlightId ? "bg-yellow-50" : ""
              }`}
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full text-left">
                  <div className="flex-1">
                    <div className="font-medium text-[#1F058F]">{s.name}</div>
                    <div className="text-sm text-gray-600">{s.category}</div>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <Badge
                      variant={getStatusVariant(s.status)}
                      className="capitalize"
                    >
                      {s.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(s);
                        }}
                      >
                        <Pencil className="h-3 w-3 text-[#1F058F]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(s);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Amount:</span>
                      <div className="font-medium">
                        ₦{Number(s.amount).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Billing Cycle:
                      </span>
                      <div className="capitalize">{s.billing_cycle}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Billing Type:
                      </span>
                      <div className="capitalize">{s.billing_type}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Created:
                      </span>
                      <div>
                        {s.createdAt
                          ? new Date(s.createdAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>
                  {s.description && (
                    <div>
                      <span className="font-medium text-gray-600 text-sm">
                        Description:
                      </span>
                      <div className="text-sm mt-1 text-gray-700">
                        {s.description}
                      </div>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        s._id && router.push(`/admin/addon-services/${s._id}`)
                      }
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};
