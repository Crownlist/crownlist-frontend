import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  status: string;
  images: Array<{ url: string; isPrimary?: boolean }>;
  reasonForDecline?: string;
}

interface ProductCardProps {
  product: Product;
  statusColor: Record<string, string>;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onDeclineMessage: (reason: string, id: string) => void;
}

export function ProductCard({
  product,
  statusColor,
  onDelete,
  onPromote,
  onDeclineMessage,
}: ProductCardProps) {
  const router = useRouter();

  const primaryImg = Array.isArray(product?.images)
    ? product.images.find((img) => img?.isPrimary)?.url ||
      product.images[0]?.url
    : undefined;

  const status = String(
    product?.status || ""
  ).toLowerCase() as keyof typeof statusColor;

  // Desktop version (md and above)
  const DesktopCard = () => (
    <div className="hidden md:flex flex-row bg-white rounded-xl shadow p-4 gap-7 items-center overflow-hidden">
      <button
        onClick={() =>
          router.push(`/seller/product/product_details/${product?._id}`)
        }
        className="relative h-[200px] w-[400px] flex-shrink-0 rounded text-left"
      >
        <Image
          src={primaryImg || "/product1.png"}
          alt={product?.name || "Product"}
          fill
          className="object-cover rounded-md"
        />
      </button>
      <div className="flex flex-col gap-3 w-full h-[100%] justify-start align-middle">
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex flex-col">
            <h3 className="flex font-semibold text-base">{product?.name}</h3>
            <p className="flex text-sm text-gray-500 mt-1 line-clamp-2">
              {product?.description}
            </p>
          </div>
          <div
            className={`flex justify-start px-4 w-fit py-1 text-xs font-medium rounded-full ${
              statusColor[status] || ""
            }`}
          >
            {String(product?.status || "")
              .charAt(0)
              .toUpperCase() + String(product?.status || "").slice(1)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <Button
              className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]"
              onClick={() =>
                router.push(`/seller/product/edit/${product?._id}`)
              }
            >
              <div className="flex">
                <Image src={"/edit.svg"} width={15} height={15} alt="svg" />
              </div>
              <div className="text-[#525252] hover:text-[#1F058F] text-sm underline">
                Edit
              </div>
            </Button>
            <Button
              className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]"
              onClick={() => onDelete(product?._id)}
            >
              <div className="flex hover:text-[#1F058F]">
                <Image src={"/del.svg"} width={15} height={15} alt="svg" />
              </div>
              <div className="text-[#525252] text-sm underline hover:text-[#1F058F]">
                Delete
              </div>
            </Button>
            {status === "declined" && (
              <Button
                className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]"
                onClick={() =>
                  onDeclineMessage(
                    product?.reasonForDecline || "",
                    product?._id
                  )
                }
              >
                <div className="flex">
                  <Image src={"/post.svg"} width={15} height={15} alt="info" />
                </div>
                <div className="text-[#525252] hover:text-[#1F058F] text-sm underline">
                  Decline Message
                </div>
              </Button>
            )}
          </div>
          <Button
            className="text-[#1F058F] border border-[#1F058F] hover:bg-[#2e0a94] bg-transparent hover:text-white px-1 lg:px-4 py-1 rounded-full text-[12px]"
            onClick={() => onPromote(product?._id)}
            disabled={product?.status !== "live"}
          >
            Promote
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile version (below md)
  const MobileCard = () => (
    <Accordion type="single" collapsible className="w-full md:hidden">
      <AccordionItem value={product?._id} className="border rounded-xl shadow">
        <AccordionTrigger className="px-4 py-4 hover:no-underline">
          <div className="flex gap-4 items-center w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/seller/product/product_details/${product?._id}`);
              }}
              className="relative h-[100px] w-[120px] flex-shrink-0 rounded"
            >
              <Image
                src={primaryImg || "/product1.png"}
                alt={product?.name || "Product"}
                fill
                className="object-cover rounded-md"
              />
            </button>
            <div className="flex flex-col gap-2 justify-start text-left flex-1">
              <h3 className="font-semibold text-base">{product?.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {product?.description}
              </p>
              <div
                className={`flex justify-start px-3 w-fit py-1 text-xs font-medium rounded-full ${
                  statusColor[status] || ""
                }`}
              >
                {String(product?.status || "")
                  .charAt(0)
                  .toUpperCase() + String(product?.status || "").slice(1)}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1 flex-wrap">
              <Button
                className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]"
                onClick={() =>
                  router.push(`/seller/product/edit/${product?._id}`)
                }
              >
                <div className="flex">
                  <Image src={"/edit.svg"} width={15} height={15} alt="svg" />
                </div>
                <div className="text-[#525252] hover:text-[#1F058F] text-sm underline">
                  Edit
                </div>
              </Button>
              <Button
                className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]"
                onClick={() => onDelete(product?._id)}
              >
                <div className="flex hover:text-[#1F058F]">
                  <Image src={"/del.svg"} width={15} height={15} alt="svg" />
                </div>
                <div className="text-[#525252] text-sm underline hover:text-[#1F058F]">
                  Delete
                </div>
              </Button>
              {status === "declined" && (
                <Button
                  className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]"
                  onClick={() =>
                    onDeclineMessage(
                      product?.reasonForDecline || "",
                      product?._id
                    )
                  }
                >
                  <div className="flex">
                    <Image
                      src={"/post.svg"}
                      width={15}
                      height={15}
                      alt="info"
                    />
                  </div>
                  <div className="text-[#525252] hover:text-[#1F058F] text-sm underline">
                    Decline Message
                  </div>
                </Button>
              )}
            </div>
            <Button
              className="text-[#1F058F] border border-[#1F058F] hover:bg-[#2e0a94] bg-transparent hover:text-white px-3 py-1 rounded-full text-[12px]"
              onClick={() => onPromote(product?._id)}
              disabled={product?.status !== "live"}
            >
              Promote
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      <DesktopCard />
      <MobileCard />
    </>
  );
}
