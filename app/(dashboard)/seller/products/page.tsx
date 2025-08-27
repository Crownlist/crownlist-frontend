/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClientUser } from "@/lib/interceptor";
import { toast } from "sonner";
import DeleteModal from "@/components/Home/DeleteModal";

export default function ProductsDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("product");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // pagination from API
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const fetchProducts = async (pageNo = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await apiClientUser.get(`/products`, {
        params: { page: pageNo, limit },
      });
      // Expecting shape: { status, data: { products, totalProducts, totalPages, currentPage, limit } }
      const payload = res?.data || res; // interceptor returns res.data; keep fallback
      const list = payload?.products || [];
      setProducts(list);
      setTotalProducts(payload?.totalProducts || list.length || 0);
      setTotalPages(payload?.totalPages || 1);
      setPage(payload?.currentPage || pageNo);
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err?.message || "Failed to fetch products";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => String(p?.status || "").toLowerCase() === activeFilter);
  }, [products, activeFilter]);

  const statusColor = {
    live: "bg-green-100 text-green-700",
    reviewing: "bg-yellow-100 text-yellow-800",
    decline: "bg-red-100 text-red-700",
  } as const;

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Tabs */}
      <h1 className="text-2xl font-bold mb-5 justify-start flex ">Products</h1>
      <div className="flex justify-between items-center mb-4 w-full ">
        <Tabs value={activeTab} onValueChange={setActiveTab} className=" p-1 shadow-sm w-full  rounded-md">
          <TabsList className="bg-white   flex justify-start ">
            <TabsTrigger value="product" className=" data-[state=active]:border-[#1F058F] data-[state=active]:text-[#1F058F] ">Post</TabsTrigger>
            <TabsTrigger value="feedback" className=" data-[state=active]:border-[#1F058F] data-[state=active]:text-[#1F058F] ">Feedback</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab == 'product' && (
        <>
          <div className="font-bold mb-2">Post</div>
          <div className="flex flex-row items-center  mb-4 justify-between text-center">
            <p className="text-sm text-muted-foreground flex">Keep track and manage your post</p>
            <Button onClick={() => router.push('/seller/product/post-product')} className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-5 py-2 rounded-full text-[13px]">
              Add product
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-1 sm:gap-2 mb-6 border-[1.5px] border-[#1F058F] p-2 rounded-md">
            {["all", "live", "reviewing", "decline"].map((status) => (
              <Button
                key={status}
                className={`px-4 sm:px-5 rounded-md ${activeFilter === status ? "bg-[#1F058F] hover:bg-[#2f0a94dc]" : ' text-black shadow-none bg-transparent hover:bg-transparent hover:text-[#1F058F]'} `}
                onClick={() => setActiveFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Body: loading, empty, list */}
          {loading ? (
            <div className="flex flex-col h-64 items-center justify-center text-sm text-muted-foreground">Loading products...</div>
          ) : error ? (
            <div className="flex flex-col h-64 items-center justify-center text-sm text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="pt-3 flex flex-col w-full h-full">
              <div className=" flex flex-col h-full  justify-center items-center">
                <div className="mb-4 flex justify-center">
                  <Image src={'/feed.svg'} width={80} height={80} alt="box" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No products yet</h2>
                <p className="text-gray-500 mb-8">You currently have no products to display</p>
                <Button onClick={() => router.push('/seller/product/post-product')} className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">Add product</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 gap-3 flex flex-col w-full h-full">
              {filtered.map((product: any) => {
                const primaryImg = Array.isArray(product?.images)
                  ? (product.images.find((img: any) => img?.isPrimary)?.url || product.images[0]?.url)
                  : undefined;
                const status = String(product?.status || '').toLowerCase() as keyof typeof statusColor;
                return (
                  <div key={product?._id} className="flex max-md:flex-col flex-row bg-white rounded-xl shadow p-4 gap-5 md:gap-7  md:items-center  overflow-hidden">
                    <button
                      onClick={() => router.push(`/seller/product/product_details/${product?._id}`)}
                      className="relative h-[200px] md:w-[400px] flex-shrink-0 rounded text-left"
                    >
                      <Image
                        src={primaryImg || "/product1.png"}
                        alt={product?.name || "Product"}
                        fill
                        className="object-cover rounded-md"
                      />
                    </button>
                    <div className="flex flex-col gap-3 w-full h-[100%] justify-start  align-middle">
                      <div className="flex flex-col gap-2 justify-start ">
                        <div className="flex flex-col ">
                          <h3 className="flex font-semibold text-base">{product?.name}</h3>
                          <p className="flex text-sm text-gray-500 mt-1 line-clamp-2">{product?.description}</p>
                        </div>
                        <div className={`flex justify-start px-4 w-fit  py-1 text-xs font-medium rounded-full  ${statusColor[status] || ''}`}>
                          {String(product?.status || '').charAt(0).toUpperCase() + String(product?.status || '').slice(1)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <Button className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]" onClick={() => router.push(`/seller/product/edit/${product?._id}`)}>
                            <div className="flex">
                              <Image src={'/edit.svg'} width={15} height={15} alt='svg' />
                            </div>
                            <div className="text-[#525252] hover:text-[#1F058F] text-sm underline">Edit</div>
                          </Button>
                          <Button className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]" onClick={() => { setDeletingId(product?._id); setIsModalOpen(true); }}>
                            <div className="flex hover:text-[#1F058F]">
                              <Image src={'/del.svg'} width={15} height={15} alt='svg' />
                            </div>
                            <div className="text-[#525252] text-sm underline hover:text-[#1F058F] ">Delete</div>
                          </Button>
                        </div>
                        <Button className="text-[#1F058F] border border-[#1F058F] hover:bg-[#2e0a94] bg-transparent  hover:text-white px-1 lg:px-4 py-1  rounded-full text-[12px]">Promote</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="flex justify-between max-md:flex-col max-md:items-start max-md:gap-2  py-4 items-center text-sm text-gray-600">
              <p>
                Showing {(page - 1) * limit + Math.min(filtered.length, 1)}-
                {(page - 1) * limit + filtered.length} of {totalProducts}
              </p>
              <div className="flex gap-2 w-fit">
                <Button variant="outline" className="max-sm:text-[10px] px-2 py-1" disabled={page <= 1} onClick={() => fetchProducts(page - 1)}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Button key={idx} variant={page === idx + 1 ? undefined : "outline"} onClick={() => fetchProducts(idx + 1)}>
                    {idx + 1}
                  </Button>
                ))}
                <Button variant="outline" className="max-sm:text-[10px] px-2 py-1" disabled={page >= totalPages} onClick={() => fetchProducts(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab == 'feedback' && (
        <>
          <div className="pt-3 flex flex-col w-full  h-full">
            <div className=" w-full mx-auto">
              <h1 className="text-md font-bold mb-1 justify-start flex ">Feedback</h1>
              <p className="text-gray-600 mb-12">Manage your post feedback</p>
              <div className=" flex flex-col h-full  justify-center items-center">
                <div className="mb-4 flex justify-center">
                  <Image src={'/feed.svg'} width={80} height={80} alt="box" />
                </div>

                <h2 className="text-xl font-semibold mb-2">No feedback</h2>
                <p className="text-gray-500 mb-8">You currently have no post feedback to display</p>

                <Link href={'/seller/product/1'}>
                  <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">Post product</Button>
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
        </>
      )}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={async () => {
          if (!deletingId) return;
          try {
            toast.loading("Deleting product...", { id: "del" });
            await apiClientUser.delete(`/products/delete/${deletingId}`);
            toast.success("Product deleted", { id: "del" });
            setIsModalOpen(false);
            setDeletingId(null);
            fetchProducts(page);
          } catch (err: any) {
            toast.error(typeof err === "string" ? err : err?.message || "Failed to delete product", { id: "del" });
          }
        }}
      />
    </div>
  );
}
