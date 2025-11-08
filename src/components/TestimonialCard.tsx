"use client";

import { useState } from "react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  title: string;
  rating: number;
  review: string;
  image: string;
  link?: string;
}

export default function TestimonialCard({
  name,
  title,
  rating,
  review,
  image,
  link = "#",
}: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200
        shadow-[0px_8px_20px_rgba(0,0,0,0.1)]
        flex flex-col md:flex-row
        overflow-hidden
        transition-all duration-200 ease-in-out
        ${isHovered ? "transform -translate-y-0.5 shadow-lg" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image on the left */}
      <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
        <div className="relative w-full h-full">
          {/* Placeholder for image - replace with actual Image component when available */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 opacity-90 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl" />
          </div>
          {/* Name and Title Overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent rounded-b-2xl md:rounded-b-none md:rounded-bl-2xl">
            <div className="text-white font-bold text-lg mb-1">{name}</div>
            <div className="text-white text-sm opacity-95">{title}</div>
          </div>
        </div>
      </div>

      {/* Content on the right */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        {/* Name and Title (visible on mobile, hidden on desktop since it's on image) */}
        <div className="md:hidden mb-3">
          <div className="font-bold text-lg text-gray-900 mb-1">{name}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>

        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <svg
              key={i}
              className={`
                w-5 h-5 transition-transform duration-200 ease-in-out
                ${isHovered ? "transform scale-110" : ""}
              `}
              style={{ color: "#F6C344" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-base text-gray-700 leading-relaxed mb-0 flex-1 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          "{review}"
        </p>

        {/* Read More Link */}
        <a
          href={link}
          className="text-[#006B5F] text-sm font-medium self-start transition-all duration-200 hover:underline"
        >
          Read more
        </a>
      </div>
    </div>
  );
}

