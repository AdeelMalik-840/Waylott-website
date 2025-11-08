"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard, { Review } from "./ReviewCard";
import useBodyLock from "@/hooks/useBodyLock";

type ReviewsCarouselProps = {
  reviews: Review[];
  intervalMs?: number;
  pauseOnHover?: boolean;
};

export default function ReviewsCarousel({
  reviews,
  intervalMs = 4000,
  pauseOnHover = true,
}: ReviewsCarouselProps) {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  // Two indices: active (business state) and vIndex (virtual track position)
  const [active, setActive] = useState(0); // Index in real list [0..N-1]
  const [vIndex, setVIndex] = useState(1); // Index in virtual list [1..N] (never 0 or N+1)
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousActive, setPreviousActive] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive dimensions
  const [slideWidth, setSlideWidth] = useState(580);
  const [slideHeight, setSlideHeight] = useState(200);
  const [isMobile, setIsMobile] = useState(false);
  
  // Calculate N early for use in hooks
  const N = reviews?.length || 0;
  
  // Lock body scroll when modal is open
  useBodyLock(selectedReview !== null);
  
  // Check if component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Focus management and keyboard handlers
  useEffect(() => {
    if (!selectedReview) return;
    
    // Focus close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    
    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReview(null);
        setIsPaused(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedReview]);
  
  // Focus trap
  useEffect(() => {
    if (!selectedReview || !modalRef.current) return;
    
    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [selectedReview]);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 768; // md breakpoint
        setIsMobile(mobile);
        if (mobile) {
          // On mobile: calculate width accounting for padding with extra safety margin
          const viewportWidth = window.innerWidth;
          // Account for: section px-4 (16*2) + outer padding (4*2) + viewport padding (4*2) + extra safety margin (8*2) = 64px
          setSlideWidth(Math.min(viewportWidth - 64, 500));
          // Reduced height for vertical layout to prevent clipping
          setSlideHeight(340);
        } else {
          setSlideWidth(520);
          setSlideHeight(180);
        }
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  const SLIDE_WIDTH = slideWidth;
  const SLIDE_HEIGHT = slideHeight;
  // Simple gap between cards (no scaling, so no need for extra spacing)
  const BASE_GAP = isMobile ? 16 : 24; // Gap between cards
  const UNIT = SLIDE_WIDTH + BASE_GAP; // Unit distance per slide

  // Calculate translateX to center virtual index vIndex
  const getTranslateX = useCallback((virtualIdx: number) => {
    if (!trackRef.current) return 0;
    
    const container = trackRef.current.parentElement;
    if (!container) return 0;
    
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = containerRect.width;
    const viewportCenter = viewportWidth / 2;
    
    // On mobile, no track padding - card should be centered
    // On desktop, track padding is 60px on each side
    const trackPadding = isMobile ? 0 : 60;
    
    // Calculate target center position from track start (after padding)
    const targetCenter = trackPadding + virtualIdx * UNIT + SLIDE_WIDTH / 2;
    
    // Translate to center the target slide
    return viewportCenter - targetCenter;
  }, [UNIT, SLIDE_WIDTH, isMobile]);

  // Apply translateX to the track
  const updateTransform = useCallback((virtualIdx: number) => {
    if (!trackRef.current) return;
    const translateX = getTranslateX(virtualIdx);
    trackRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`;
  }, [getTranslateX]);

  // Map virtual index to real index (supports infinite scrolling)
  const getRealIndex = useCallback((virtualIdx: number): number => {
    if (N < 3) return 0; // Safety check
    if (virtualIdx === 0) return N - 1; // clone of last
    if (virtualIdx === 4 * N + 1) return 0; // clone of first
    // For all other indices, use modulo to map back to real reviews
    // This allows infinite scrolling across multiple cycles
    const adjustedIdx = (virtualIdx - 1) % N;
    return adjustedIdx >= 0 ? adjustedIdx : N - 1;
  }, [N]);

  // Move to next slide (right to left) - infinite scrolling
  const next = useCallback(() => {
    if (N < 3) return; // Safety check
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const nextVIndex = vIndex + 1;
    
    // Track previous active for scale-out animation
    setPreviousActive(active);
    
    // Check if we need to wrap (when we exceed the extended track)
    // Extended track has length: 1 (clone last) + 4*N (four cycles) + 1 (clone first) = 4N + 2
    const maxVirtualIndex = 4 * N + 1;
    
    if (nextVIndex > maxVirtualIndex) {
      // We've scrolled through the extended track, seamlessly jump to equivalent position in second cycle
      // Calculate which review we're showing (should be the first review at this point)
      const currentRealIndex = getRealIndex(vIndex);
      // Jump to the same review in the second cycle (N+1 to 2N range) for seamless loop
      const jumpToVIndex = N + 1 + currentRealIndex;
      
      // First, move to the next position visually
      setVIndex(nextVIndex);
      const newRealIndex = getRealIndex(nextVIndex);
      setActive(newRealIndex);
      updateTransform(nextVIndex);
      
      // Then, after transition completes, jump seamlessly to equivalent position
      setTimeout(() => {
        if (!trackRef.current) return;
        
        // Disable transition for instant jump
        trackRef.current.style.transition = "none";
        setVIndex(jumpToVIndex);
        setActive(currentRealIndex);
        updateTransform(jumpToVIndex);
        
        // Re-enable transition after jump
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (trackRef.current) {
              trackRef.current.style.transition = "transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            }
            setPreviousActive(null);
            setIsTransitioning(false);
          });
        });
      }, 800); // Wait for transition to complete
    } else {
      // Normal forward movement - continue scrolling
      setVIndex(nextVIndex);
      const newRealIndex = getRealIndex(nextVIndex);
      setActive(newRealIndex);
      updateTransform(nextVIndex);
      
      // Clear previous active after animation completes
      setTimeout(() => {
        setPreviousActive(null);
        setIsTransitioning(false);
      }, 800);
    }
  }, [vIndex, active, isTransitioning, N, updateTransform, getRealIndex]);

  // Move to previous slide (left to right - reverse direction) - infinite scrolling
  const prev = useCallback(() => {
    if (N < 3) return; // Safety check
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const prevVIndex = vIndex - 1;
    
    // Track previous active for scale-out animation
    setPreviousActive(active);
    
    if (prevVIndex < 1) {
      // Wrapping backward: jump to equivalent position in a later cycle
      // Calculate which review we should show (last review)
      const newActive = (active - 1 + N) % N;
      // Find the virtual index in third cycle that represents this review (to give more room)
      const thirdCycleStart = 2 * N + 1; // Start of third cycle
      const targetVIndex = thirdCycleStart + newActive;
      
      // Disable transition for instant jump
      if (trackRef.current) {
        trackRef.current.style.transition = "none";
      }
      
      setVIndex(targetVIndex);
      setActive(newActive);
      setPreviousActive(active);
      updateTransform(targetVIndex);
      
      // Re-enable transition after jump
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = "transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          }
          setPreviousActive(null);
          setIsTransitioning(false);
        });
      });
    } else {
      // Normal backward movement
      setVIndex(prevVIndex);
      const newRealIndex = getRealIndex(prevVIndex);
      setActive(newRealIndex);
      updateTransform(prevVIndex);
      
      // Clear previous active after animation completes
      setTimeout(() => {
        setPreviousActive(null);
        setIsTransitioning(false);
      }, 800);
    }
  }, [vIndex, active, isTransitioning, N, updateTransform, getRealIndex]);

  // Auto-scroll
  useEffect(() => {
    if (N < 3 || !reviews) return; // Safety check
    if (isPaused || isTransitioning) {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
      return;
    }

    autoScrollTimerRef.current = setInterval(() => {
      next();
    }, intervalMs);

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isPaused, isTransitioning, intervalMs, next, N, reviews]);

  // Initial positioning
  useEffect(() => {
    if (N < 3 || !reviews) return; // Safety check
    const initTimeout = setTimeout(() => {
      updateTransform(1);
    }, 400);
    return () => clearTimeout(initTimeout);
  }, [updateTransform, N, reviews]);

  // Handle window resize with debounce
  useEffect(() => {
    if (N < 3 || !reviews) return; // Safety check
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateTransform(vIndex);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [vIndex, updateTransform, N, reviews]);

  // Handle keyboard navigation
  useEffect(() => {
    if (N < 3 || !reviews) return; // Safety check
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedReview && e.key === "Escape") {
        setSelectedReview(null);
        setIsPaused(false);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        next(); // Always advance forward (right→left visually)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, selectedReview, N, reviews]);

  // Pause on hover, focus, or touch
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };
  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };
  const handleFocus = () => {
    if (pauseOnHover) setIsPaused(true);
  };
  const handleBlur = () => {
    if (pauseOnHover) setIsPaused(false);
  };
  const handleTouchStart = () => {
    if (pauseOnHover) setIsPaused(true);
  };
  const handleTouchEnd = () => {
    if (pauseOnHover) {
      setTimeout(() => setIsPaused(false), 1000);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
      if (transitionEndTimeoutRef.current) {
        clearTimeout(transitionEndTimeoutRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Early return check AFTER all hooks
  if (!reviews || N < 3) {
    return null;
  }

  // Virtual track: [clone(last), ...reviews, ...reviews, ...reviews, clone(first)]
  // Extended with multiple cycles to support true infinite scrolling
  const virtualTrack = [
    reviews[N - 1], // clone of last (index 0)
    ...reviews,     // first cycle (indices 1 to N)
    ...reviews,     // second cycle (indices N+1 to 2N)
    ...reviews,     // third cycle (indices 2N+1 to 3N)
    ...reviews,     // fourth cycle (indices 3N+1 to 4N)
    reviews[0],     // clone of first for seamless wrap (index 4N+1)
  ];

  // Simple viewport height - account for scaling on desktop
  const VERTICAL_PADDING = 20;
  const SCALE_FACTOR = 1.25; // Maximum scale for active card
  const SCALE_EXTRA_HEIGHT = isMobile ? 0 : (SLIDE_HEIGHT * (SCALE_FACTOR - 1)); // Extra height needed for scaled card
  const DESKTOP_EXTRA_PADDING = isMobile ? 0 : 40; // Extra padding on desktop (20px top + 20px bottom)
  const VIEWPORT_HEIGHT = typeof SLIDE_HEIGHT === 'number' 
    ? SLIDE_HEIGHT + VERTICAL_PADDING + (isMobile ? 32 : SCALE_EXTRA_HEIGHT + DESKTOP_EXTRA_PADDING) // Extra space for scaling on desktop
    : 300;

  return (
    <div 
      className="relative w-full rounded-2xl overflow-x-hidden" 
      style={{ 
        borderRadius: "20px",
        minHeight: `${VIEWPORT_HEIGHT}px`,
        height: isMobile ? "auto" : `${VIEWPORT_HEIGHT}px`, // Auto height on mobile to accommodate full card
        marginTop: "0",
        padding: isMobile ? "4px" : "0", // Padding on mobile to prevent corner clipping
        paddingBottom: isMobile ? "8px" : "0", // Extra bottom padding on mobile
        overflowX: "hidden", // Prevent horizontal overflow
        overflowY: isMobile ? "visible" : "hidden", // Allow vertical overflow on mobile to show full card
      }}
    >
      {/* Edge fade masks with border-radius - hidden on mobile */}
      {!isMobile && (
        <>
          <div 
            className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"
            style={{ 
              height: `${VIEWPORT_HEIGHT}px`,
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
            }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
            style={{ 
              height: `${VIEWPORT_HEIGHT}px`,
              borderTopRightRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
          />
        </>
      )}

      {/* Viewport container */}
      <div
        className="relative"
        style={{
          width: "100%",
          height: isMobile ? "auto" : `${VIEWPORT_HEIGHT}px`, // Auto height on mobile to accommodate full card
          minHeight: isMobile ? `${SLIDE_HEIGHT + 40}px` : `${VIEWPORT_HEIGHT}px`, // Ensure minimum height on mobile
          paddingTop: isMobile ? "4px" : "20px", // Extra top padding on desktop for scaled card
          paddingBottom: isMobile ? `${VERTICAL_PADDING + 20}px` : `${VERTICAL_PADDING + 20}px`, // Extra bottom padding for scaled card
          paddingLeft: isMobile ? "4px" : "0px", // Padding on mobile to prevent corner clipping
          paddingRight: isMobile ? "4px" : "0px", // Padding on mobile to prevent corner clipping
          overflow: isMobile ? "visible" : "visible", // Allow overflow on mobile to show full card
          borderRadius: "14px", // Slightly smaller to account for outer padding
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Side Arrow Controls - Left */}
        {!isMobile && (
          <button
            onClick={prev}
            disabled={isTransitioning}
            aria-label="Previous review"
            className="
              absolute left-4 top-1/2 -translate-y-1/2 z-30
              w-12 h-12 rounded-full
              bg-white border-2 border-gray-300 shadow-lg
              flex items-center justify-center
              text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Side Arrow Controls - Right */}
        {!isMobile && (
          <button
            onClick={next}
            disabled={isTransitioning}
            aria-label="Next review"
            className="
              absolute right-4 top-1/2 -translate-y-1/2 z-30
              w-12 h-12 rounded-full
              bg-white border-2 border-gray-300 shadow-lg
              flex items-center justify-center
              text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center"
          style={{
            transition: "transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
            height: "100%",
            gap: `${BASE_GAP}px`,
            padding: isMobile ? "0" : "0 60px", // No padding on mobile, extra padding on desktop to show shadows
          }}
        >
          {virtualTrack.map((review, virtualIdx) => {
            const realIndex = getRealIndex(virtualIdx);
            // Allow active state for any virtual index that matches the current active real index
            const isActive = !isTransitioning && active === realIndex && virtualIdx === vIndex;
            
            // Scaling effect for centered card on desktop
            // Only opacity changes for non-active cards on desktop
            // On mobile, all cards are fully visible (no fade effect)
            const opacity = isMobile ? "1" : (isActive ? "1" : "0.4");
            const scale = isMobile ? "1" : (isActive ? "1.25" : "0.85");
            const transition = isMobile ? "none" : "opacity 400ms ease-in-out, transform 400ms ease-in-out";
            
            return (
              <div
                key={`virtual-${virtualIdx}`}
                className="flex-shrink-0"
                style={{
                  width: `${SLIDE_WIDTH}px`,
                  height: `${SLIDE_HEIGHT}px`,
                  flex: `0 0 ${SLIDE_WIDTH}px`,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Card with scaling effect on desktop */}
                <div
                  style={{
                    width: `${SLIDE_WIDTH}px`,
                    height: `${SLIDE_HEIGHT}px`,
                    opacity,
                    transform: `scale(${scale})`,
                    transition,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <ReviewCard
                    {...review}
                    isActive={isActive}
                    isPreviousActive={false}
                    isIncoming={false}
                    onReadMore={(review) => {
                      setSelectedReview(review);
                      setIsPaused(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows - Always visible */}
      <div className="flex justify-center items-center gap-3 mt-10 md:mt-12 relative z-20 w-full">
        <button
          onClick={prev}
          disabled={isTransitioning}
          aria-label="Previous review"
          className="
            w-12 h-12 rounded-full
            bg-white border-2 border-gray-300 shadow-md
            flex items-center justify-center
            text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
          "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={isTransitioning}
          aria-label="Next review"
          className="
            w-12 h-12 rounded-full
            bg-white border-2 border-gray-300 shadow-md
            flex items-center justify-center
            text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
          "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Modal for full testimonial - Rendered via Portal */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedReview && (
            <>
              {/* Backdrop Overlay - Full screen, not clipped */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 9998,
                }}
                onClick={() => {
                  setSelectedReview(null);
                  setIsPaused(false);
                }}
                aria-hidden="true"
              />
              
              {/* Modal Content */}
              <div
                className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 9999,
                }}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 20 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="review-modal-title"
                  aria-describedby="review-modal-description"
                >
                  {/* Close button */}
                  <button
                    ref={closeButtonRef}
                    onClick={() => {
                      setSelectedReview(null);
                      setIsPaused(false);
                    }}
                    className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    aria-label="Close modal"
                  >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
                  {/* Testimonial Card - Full Version */}
                  <div className="p-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg flex flex-col md:flex-row overflow-hidden">
                      {/* Image on the left */}
                      <div className="relative w-full md:w-64 h-64 md:h-auto flex-shrink-0">
                        <div className="relative w-full h-full">
                          {typeof selectedReview.imageUrl === 'string' ? (
                            <Image
                              src={selectedReview.imageUrl}
                              alt={`${selectedReview.name} portrait`}
                              fill
                              className="object-cover rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
                              loading="lazy"
                              quality={85}
                            />
                          ) : (
                            <Image
                              src={selectedReview.imageUrl?.src || selectedReview.imageUrl}
                              alt={`${selectedReview.name} portrait`}
                              fill
                              className="object-cover rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
                              loading="lazy"
                              quality={85}
                            />
                          )}
                          {/* Name and Title Overlay on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent rounded-b-2xl md:rounded-b-none md:rounded-bl-2xl">
                            <h2 id="review-modal-title" className="text-white font-bold text-lg mb-1">
                              {selectedReview.name}
                            </h2>
                            <p className="text-white text-sm opacity-95">{selectedReview.title}</p>
                          </div>
                        </div>
                      </div>
                      {/* Content on the right */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col">
                        {/* Star Rating */}
                        <div className="flex gap-1 mb-4 mt-4" role="img" aria-label={`${selectedReview.rating} out of 5 stars`}>
                          {[...Array(Math.floor(selectedReview.rating))].map((_, i) => (
                            <svg
                              key={i}
                              className="w-6 h-6"
                              style={{ color: "#F6C344" }}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          {selectedReview.ratingHalf && selectedReview.rating % 1 !== 0 && (
                            <svg
                              className="w-6 h-6"
                              style={{ color: "#F6C344" }}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <defs>
                                <clipPath id={`half-star-${selectedReview.id}`}>
                                  <rect x="0" y="0" width="10" height="20" />
                                </clipPath>
                              </defs>
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                clipPath={`url(#half-star-${selectedReview.id})`}
                              />
                            </svg>
                          )}
                        </div>
                        {/* Full Testimonial Text */}
                        <p id="review-modal-description" className="text-base text-gray-700 leading-relaxed">
                          &quot;{selectedReview.review}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
