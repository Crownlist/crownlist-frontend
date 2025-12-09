import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProductEmptyState() {
  const router = useRouter();

  return (
    <div className="pt-3 flex flex-col w-full h-full">
      <div className="flex flex-col h-full justify-center text-center items-center">
        <div className="mb-4 flex justify-center">
          <Image src={"/feed.svg"} width={80} height={80} alt="box" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No products yet</h2>
        <p className="text-gray-500 mb-8">
          You currently have no products to display
        </p>
        <Button
          onClick={() => router.push("/seller/product/post-product")}
          className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full"
        >
          Add product
        </Button>
      </div>
    </div>
  );
}
