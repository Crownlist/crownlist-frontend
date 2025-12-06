import { useState, useEffect } from "react";

export interface ScrollNavigationState {
  isNavbarVisible: boolean;
  scrollDirection: "up" | "down" | null;
  scrollPosition: number;
}

export const useScrollNavigation = (autoHideDelay: number = 2000) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      const direction: "up" | "down" =
        currentPosition > lastScrollPosition ? "down" : "up";

      setScrollPosition(currentPosition);
      setScrollDirection(direction);
      setLastScrollPosition(currentPosition);

      // Clear existing timer
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }

      // Show navbar when scrolling up
      if (direction === "up") {
        setIsNavbarVisible(true);

        // Auto-hide after delay when scrolling up stops
        const newTimer = setTimeout(() => {
          if (direction === "up" && scrollPosition > 0) {
            setIsNavbarVisible(false);
          }
        }, autoHideDelay);

        setAutoHideTimer(newTimer);
      } else {
        // Hide navbar when scrolling down
        setIsNavbarVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
    };
  }, [lastScrollPosition, autoHideTimer, autoHideDelay, scrollPosition]);

  // Show navbar when at top of page
  useEffect(() => {
    if (scrollPosition <= 0) {
      setIsNavbarVisible(true);
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
        setAutoHideTimer(null);
      }
    }
  }, [scrollPosition, autoHideTimer]);

  return {
    isNavbarVisible,
    scrollDirection,
    scrollPosition,
  };
};
