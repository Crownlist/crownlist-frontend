import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ProductHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center mb-4 justify-between text-center">
      <p className="text-sm text-muted-foreground flex">
        Keep track and manage your post
      </p>
      <Button
        onClick={() => router.push("/seller/product/post-product")}
        className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-5 py-2 rounded-full text-[13px]"
      >
        Add product
      </Button>
    </div>
  );
}
