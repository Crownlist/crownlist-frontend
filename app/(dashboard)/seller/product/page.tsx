/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteModal from "@/components/Home/DeleteModal";
import { PromoteProductModal } from "@/components/promote-product-modal";
import { apiClientUser } from "@/lib/interceptor";
import { toast } from "sonner";
import { ProductCard } from "./components/ProductCard";
import { StatusFilters } from "./components/StatusFilters";
import { PaginationControls } from "./components/PaginationControls";
import { ProductEmptyState } from "./components/ProductEmptyState";
import { DeclineMessageModal } from "./components/DeclineMessageModal";
import { FeedbackTab } from "./components/FeedbackTab";
import { ProductHeader } from "./components/ProductHeader";
import { statusColor } from "./constants";
import { useGetAuthUser } from "@/lib/useGetAuthUser";

export default function ProductDashboard() {
  const [activeTab, setActiveTab] = useState("product");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [promotingProductId, setPromotingProductId] = useState<string | null>(
    null
  );
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineMessage, setDeclineMessage] = useState<string | null>(null);
  const [declineProductId, setDeclineProductId] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get current authenticated seller
  const { data: authData } = useGetAuthUser("User");
  const currentSellerId = authData?.data?.loggedInAccount?._id
    ? String(authData.data.loggedInAccount._id)
    : null;

  const getProductSellerId = (product: any): string | null => {
    if (!product) return null;
    if (typeof product.seller === "string") return product.seller;
    if (product.seller?._id) return String(product.seller._id);
    if (product.seller?.id) return String(product.seller.id);
    if (product.sellerId) return String(product.sellerId);
    return null;
  };

  const belongsToCurrentSeller = (product: any): boolean => {
    if (!currentSellerId) return false;
    const sellerId = getProductSellerId(product);
    return !!sellerId && sellerId === currentSellerId;
  };

  // pagination from API
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  // const [totalProducts, setTotalProducts] = useState<number>(0);

  const fetchProducts = async (pageNo = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await apiClientUser.get(`/products/me`, {
        params: { page: pageNo, limit },
      });
      const payload = res?.data || res;
      const list = payload?.products || [];
      const scopedList = currentSellerId
        ? list.filter(belongsToCurrentSeller)
        : list;
      setProducts(scopedList);
      // setTotalProducts(payload?.totalProducts || list.length || 0);
      setTotalPages(payload?.totalPages || 1);
      setPage(payload?.currentPage || pageNo);
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.message || "Failed to fetch products";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineMessageClick = async (
    reasonForDecline: string,
    productId: string
  ) => {
    setDeclineProductId(productId);
    const message = reasonForDecline;
    setDeclineMessage(message);
    setDeclineModalOpen(true);
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentSellerId) return;
    setProducts((prev) => prev.filter(belongsToCurrentSeller));
  }, [currentSellerId]);

  // Client-side filter: Only show products belonging to the current seller
  const sellerProducts = useMemo(() => {
    if (!currentSellerId) return [];
    return products.filter(belongsToCurrentSeller);
  }, [products, currentSellerId]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return sellerProducts;
    return sellerProducts.filter(
      (p) => String(p?.status || "").toLowerCase() === activeFilter
    );
  }, [sellerProducts, activeFilter]);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Tabs */}
      <h1 className="text-2xl font-bold mb-5 justify-start flex ">Product</h1>
      <div className="hidden justify-between items-center mb-4 w-full ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className=" p-1 shadow-sm w-full  rounded-md"
        >
          <TabsList className="bg-white   flex justify-start ">
            <TabsTrigger
              value="product"
              className=" data-[state=active]:border-[#1F058F] data-[state=active]:text-[#1F058F] "
            >
              Post
            </TabsTrigger>
            {/* <TabsTrigger value="feedback" className=" data-[state=active]:border-[#1F058F] data-[state=active]:text-[#1F058F] ">Feedback</TabsTrigger> */}
          </TabsList>
        </Tabs>
      </div>

      {activeTab == "product" && (
        <>
          {/* <div className="font-bold mb-2">Post</div> */}
          <ProductHeader />

          {/* Status Filters */}
          <StatusFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Body: loading, empty, list */}
          {loading ? (
            <div className="flex flex-col h-64 items-center justify-center text-sm text-muted-foreground">
              Loading products...
            </div>
          ) : error ? (
            <div className="flex flex-col h-64 items-center justify-center text-sm text-red-600">
              {error}
            </div>
          ) : sellerProducts.length === 0 ? (
            <ProductEmptyState />
          ) : (
            <div className="space-y-4 gap-3 flex flex-col w-full h-full">
              {filtered.map((product: any) => (
                <ProductCard
                  key={product?._id}
                  product={product}
                  statusColor={statusColor}
                  onDelete={setDeletingId}
                  onPromote={setPromotingProductId}
                  onDeclineMessage={handleDeclineMessageClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {sellerProducts.length > 0 && (
            <PaginationControls
              page={page}
              totalPages={totalPages}
              limit={limit}
              filteredLength={filtered.length}
              totalProducts={sellerProducts.length}
              onPageChange={fetchProducts}
            />
          )}
        </>
      )}

      {/* Promote Product Modal */}
      <PromoteProductModal
        isOpen={!!promotingProductId}
        onClose={() => setPromotingProductId(null)}
        productId={promotingProductId || ""}
      />

      {/* Decline Message Modal */}
      <DeclineMessageModal
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        declineProductId={declineProductId}
        declineMessage={declineMessage}
      />

      {activeTab == "feedback" && <FeedbackTab />}
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
            toast.error(
              typeof err === "string"
                ? err
                : err?.message || "Failed to delete product",
              { id: "del" }
            );
          }
        }}
      />
    </div>
  );
}
