import { useState } from "react";
import { toast } from "sonner";
import { useLikedProducts } from "@/hooks/useLikedProducts";

export const useProductLike = () => {
  const [liked, setLiked] = useState<boolean>(false);
  const [toggling, setToggling] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { toggleLike } = useLikedProducts();

  const handleLike = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggling) return;

    // Check authentication
    const isAuthenticated =
      typeof window !== "undefined" && !!localStorage.getItem("leoKey");
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setToggling(true);
    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await toggleLike(productId);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setLiked(!newLiked); // revert
      toast.error(error.message || "Failed to toggle like");
    } finally {
      setToggling(false);
    }
  };

  return {
    liked,
    setLiked,
    toggling,
    showLoginPrompt,
    setShowLoginPrompt,
    handleLike,
  };
};
