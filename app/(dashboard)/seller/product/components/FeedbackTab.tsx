import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function FeedbackTab() {
  return (
    <div className="pt-3 flex flex-col w-full h-full">
      <div className="w-full mx-auto">
        <h1 className="text-md font-bold mb-1 justify-start flex">Feedback</h1>
        <p className="text-gray-600 mb-12">Manage your post feedback</p>
        <div className="flex flex-col h-full justify-center items-center">
          <div className="mb-4 flex justify-center">
            <Image src={"/feed.svg"} width={80} height={80} alt="box" />
          </div>

          <h2 className="text-xl font-semibold mb-2">No feedback</h2>
          <p className="text-gray-500 mb-8">
            You currently have no post feedback to display
          </p>

          <Link href={"/seller/product/1"}>
            <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">
              Post product
            </Button>
          </Link>
          <div className="mt-16 text-center text-gray-600 text-sm">
            <p>For further assistance reach out via our 24/7</p>
            <p>
              via email at{" "}
              <a href="mailto:support@crownlist.com" className="text-[#1F058F]">
                support@crownlist.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
