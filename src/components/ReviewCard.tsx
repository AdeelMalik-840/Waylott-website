import React, { useId } from "react";
import Image, { type StaticImageData } from "next/image";

export type Review = {
  id: string;
  name: string;
  title: string;
  rating: number; // Can be 4.5 for half stars
  ratingHalf?: boolean;
  review: string;
  imageUrl: string | StaticImageData;
  linkHref?: string;
};

type ReviewCardProps = Review & {
  _isActive?: boolean; // Reserved for future use
  _isPreviousActive?: boolean; // Reserved for future use
  _isIncoming?: boolean; // Reserved for future use
  onReadMore?: (review: Review) => void;
};

const Star = ({ filled, half, starIndex }: { filled: boolean; half?: boolean; starIndex?: number }) => {
  const id = useId();
  const clipId = `clip-${id}-${starIndex}`;
  
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="shrink-0"
    >
      {half ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width="10" height="20" />
            </clipPath>
          </defs>
          {/* Filled left half */}
          <path
            d="M10 1.7l2.22 4.5 4.98.72-3.6 3.5.85 4.96L10 13.9l-4.45 2.39.85-4.96-3.6-3.5 4.98-.72L10 1.7z"
            fill="#F6C344"
            clipPath={`url(#${clipId})`}
          />
          {/* Outline for right half */}
          <path
            d="M10 1.7l2.22 4.5 4.98.72-3.6 3.5.85 4.96L10 13.9l-4.45 2.39.85-4.96-3.6-3.5 4.98-.72L10 1.7z"
            fill="none"
            stroke="#F6C344"
            strokeWidth="1"
          />
        </>
      ) : (
        <path
          d="M10 1.7l2.22 4.5 4.98.72-3.6 3.5.85 4.96L10 13.9l-4.45 2.39.85-4.96-3.6-3.5 4.98-.72L10 1.7z"
          fill={filled ? "#F6C344" : "none"}
          stroke="#F6C344"
          strokeWidth="1"
        />
      )}
    </svg>
  );
};

export default function ReviewCard({
  id,
  name,
  title,
  rating,
  ratingHalf = false,
  review,
  imageUrl,
  linkHref = "#",
  onReadMore,
}: ReviewCardProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = ratingHalf && rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Card is 580x200 on desktop - scaling is handled by parent scale-shell
  // On mobile, card becomes vertical with flexible height and responsive width
  return (
    <article
      className="bg-white w-full max-w-[500px] md:w-[520px] md:h-[180px] md:shadow-[0_8px_20px_rgba(0,0,0,0.10)]"
      style={{
        border: "1px solid rgba(221, 221, 221, 0.7)",
        borderRadius: "16px",
        boxSizing: "border-box",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
      role="figure"
      aria-label={`Testimonial by ${name}`}
    >
      {/* Desktop Layout: Image left, content right */}
      <div className={`hidden md:flex h-full p-4 md:grid md:grid-cols-[180px_1fr] gap-4`}>
        {/* Left: Image panel */}
        <div className="relative w-full h-full md:w-[180px] flex-shrink-0 md:self-start">
          {typeof imageUrl === 'string' ? (
            <Image
              src={imageUrl}
              alt={`${name} portrait`}
              fill
              className="object-cover rounded-lg"
              loading="lazy"
              quality={85}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={`${name} portrait`}
              fill
              className="object-cover rounded-lg"
              loading="lazy"
              quality={85}
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.95) 100%)",
            }}
          />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 
              className="text-white font-bold text-lg leading-tight mb-1"
              style={{
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {name}
            </h3>
            <p 
              className="text-white text-xs font-medium"
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col flex-1 min-w-0 justify-start md:self-start">
          {/* Star Rating */}
          <div
            className="flex gap-2 mb-2 mt-4"
            role="img"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star key={`full-${i}`} filled={true} starIndex={i} />
            ))}
            {hasHalfStar && <Star key="half" filled={false} half={true} starIndex={fullStars} />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star key={`empty-${i}`} filled={false} starIndex={fullStars + (hasHalfStar ? 1 : 0) + i} />
            ))}
          </div>

          {/* Review Text */}
          <blockquote className="text-[#334155] text-sm leading-6 mb-3 flex-1 min-h-0">
            <p
              className="overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              &quot;{review}&quot;
            </p>
          </blockquote>

          {/* Read More Link */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onReadMore) {
                onReadMore({ id, name, title, rating, ratingHalf, review, imageUrl, linkHref });
              }
            }}
            className="text-[#176B5E] text-sm font-medium underline-offset-4 hover:underline focus:underline focus:outline-none self-start text-left"
            aria-label={`Read full review of ${name}`}
          >
            Read more
          </button>
        </div>
      </div>

      {/* Mobile Layout: Vertical - Image with overlay, Stars, Review, Read more */}
      <div className="md:hidden flex flex-col h-full">
        {/* 1. Image at top with name/title overlay */}
        <div className="w-full px-4 pt-4">
          <div className="relative w-full h-56 flex-shrink-0 overflow-hidden rounded-lg">
            {typeof imageUrl === 'string' ? (
              <Image
                src={imageUrl}
                alt={`${name} portrait`}
                fill
                className="object-cover object-center rounded-lg"
                loading="lazy"
                quality={85}
              />
            ) : (
              <Image
                src={imageUrl}
                alt={`${name} portrait`}
                fill
                className="object-cover object-center rounded-lg"
                loading="lazy"
                quality={85}
              />
            )}
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.95) 100%)",
              }}
            />
            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 
                className="text-white font-bold text-base leading-tight mb-1"
                style={{
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {name}
              </h3>
              <p 
                className="text-white text-xs font-medium"
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {title}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Content section with padding */}
        <div className="flex flex-col flex-1 px-4 pb-4 pt-2">
          {/* Star Rating */}
          <div
            className="flex gap-2 mb-3"
            role="img"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star key={`full-${i}`} filled={true} starIndex={i} />
            ))}
            {hasHalfStar && <Star key="half" filled={false} half={true} starIndex={fullStars} />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star key={`empty-${i}`} filled={false} starIndex={fullStars + (hasHalfStar ? 1 : 0) + i} />
            ))}
          </div>

          {/* Review Text */}
          <blockquote className="text-[#334155] text-sm leading-6 mb-3 flex-1">
            <p
              className="overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              &quot;{review}&quot;
            </p>
          </blockquote>

          {/* Read More Link */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onReadMore) {
                onReadMore({ id, name, title, rating, ratingHalf, review, imageUrl, linkHref });
              }
            }}
            className="text-[#176B5E] text-sm font-medium underline-offset-4 hover:underline focus:underline focus:outline-none self-start text-left"
            aria-label={`Read full review of ${name}`}
          >
            Read more
          </button>
        </div>
      </div>
    </article>
  );
}
