"use client";

import ReviewsCarousel from "./ReviewsCarousel";
import { Review } from "./ReviewCard";
import Reveal from "./Reveal";
import glennTorresImage from "@/images/Glenn Torres.png";
import jamieMayerImage from "@/images/Jamie Mayer.png";
import jimiBinghamImage from "@/images/jimi bingham-img.webp";
import kobyDumasImage from "@/images/Koby Dumas-img.webp";
import chrisSmithImage from "@/images/Chris Smith-img.webp";
import michelleIhegborowImage from "@/images/Michelle Ihegborow-img.webp";

export default function Testimonials() {
  const reviews: Review[] = [
    {
      id: "1",
      name: "Glenn Torres",
      title: "The Godfather Of Marketing",
      rating: 5,
      ratingHalf: false,
      review: "Brian is a master on what he does. I had the opportunity to work with him and within 2 hours into the assessment he already had found over $5M dollars that i am missing in my business. He was able to identify broken processes and provide the solution to fix it. If you really want to double or triple your current business you need to talk to Brian",
      imageUrl: glennTorresImage,
      linkHref: "#glenn",
    },
    {
      id: "2",
      name: "Jamie Meyer",
      title: "Jamie Meyer Enterprises",
      rating: 5,
      ratingHalf: false,
      review: "Brian is someone who operates with a rare level of integrity—an increasingly valuable quality in any field. His commitment to learning, ensuring access to the best resources, and securing top-tier accreditations speaks to his dedication to excellence. Whether in business or broader initiatives, he is unwavering in his pursuit of the best possible solutions for every application he is involved in. Beyond his expertise, Brian brings an infectious energy and enthusiasm that makes working with him both inspiring and productive. An all-around stellar guy, he is the kind of person you want in your corner.",
      imageUrl: jamieMayerImage,
      linkHref: "#jamie",
    },
    {
      id: "3",
      name: "Jimi Bingham",
      title: "CEO Great Employees Matter",
      rating: 5,
      ratingHalf: false,
      review: "Waylott is a game-changer for business owners looking to maximize their revenue potential. Their in-depth financial business assessments provide clear, actionable insights into the untapped opportunities many companies overlook—whether it's consultation services, physical products, or optimizing social media for growth. Brian Livingston and his team at Waylott take a strategic, data-driven approach that empowers businesses to capture lost revenue and create new streams of income. Their expertise is invaluable for any entrepreneur serious about scaling their success.",
      imageUrl: jimiBinghamImage,
      linkHref: "#jimi",
    },
    {
      id: "4",
      name: "Koby Dumas",
      title: "Founder, Ego Lens Media",
      rating: 5,
      ratingHalf: false,
      review: "As a business owner and media professional at Ego Lens Media, I know firsthand how important it is to have the right strategies in place to scale and thrive. That's why I highly recommend Waylott's Proven Anchor Revenue Review Blueprint—it's a game-changer for any entrepreneur looking to uncover hidden revenue, optimize operations, and separate themselves from the competition. What sets them apart? Customized, actionable strategies—not generic advice you could find anywhere. Their team of highly trained strategists genuinely cares about your business, ensuring you leave with insights that increase profits without extra ad spend. Whether you're looking to grow, scale, or prepare your business for sale, Waylott provides the clarity and direction needed to make it happen. I've seen firsthand how the right guidance can turn struggles into success, and I have no doubt their expertise will do the same for you. If you're serious about levelling up, book a consultation today! You don't know what you don't know—but they do.",
      imageUrl: kobyDumasImage,
      linkHref: "#koby",
    },
    {
      id: "5",
      name: "Chris Smith",
      title: "With Or Without You",
      rating: 5,
      ratingHalf: false,
      review: "To say Brian was amazing, is an understatement! The man brought what was in the dark to me into the light & literally within our first 15 minutes together he helped me generate 25k of immediate cash flow by implementing while we were on the call & a further what is looking to be 600k in revenue this year JUST from that 1 source! Talk about \"what I was leaving on the table\" he showed me exactly what I was leaving on mine! Looking forward to our further sessions... because that return on investment was mind blowing!!",
      imageUrl: chrisSmithImage,
      linkHref: "#chris",
    },
    {
      id: "6",
      name: "Michelle Ihegborow",
      title: "Real Estate Professional",
      rating: 5,
      ratingHalf: false,
      review: "Recently, I decided to run my real estate business through Brian's assessment, knowing there was lost revenue and thinking I had a good idea of where the gaps were. What I didn't expect was just how much I was leaving on the table—and, more importantly, how to identify and fix those gaps. The assessment process was both eye-opening and challenging, but Brian's ability to pinpoint key areas for growth and provide actionable solutions made all the difference. Not only did he highlight what I was missing, but he also delivered a clear follow-up plan to help me tackle those gaps head-on. If you're serious about maximizing your business potential, I can't recommend Brian enough. His insights, support, and practical strategies are invaluable for anyone looking to take their business to the next level.",
      imageUrl: michelleIhegborowImage,
      linkHref: "#michelle",
    },
    {
      id: "7",
      name: "Koby Dumas",
      title: "Founder, Ego Lens Media",
      rating: 5,
      ratingHalf: false,
      review: "As a business owner and media professional at Ego Lens Media, I know firsthand how important it is to have the right strategies in place to scale and thrive. That's why I highly recommend Waylott's Proven Anchor Revenue Review Blueprint—it's a game-changer for any entrepreneur looking to uncover hidden revenue, optimize operations, and separate themselves from the competition. What sets them apart? Customized, actionable strategies—not generic advice you could find anywhere. Their team of highly trained strategists genuinely cares about your business, ensuring you leave with insights that increase profits without extra ad spend. Whether you're looking to grow, scale, or prepare your business for sale, Waylott provides the clarity and direction needed to make it happen. I've seen firsthand how the right guidance can turn struggles into success, and I have no doubt their expertise will do the same for you. If you're serious about levelling up, book a consultation today! You don't know what you don't know—but they do.",
      imageUrl: kobyDumasImage,
      linkHref: "#koby-2",
    },
    {
      id: "8",
      name: "Chris Smith",
      title: "With Or Without You",
      rating: 5,
      ratingHalf: false,
      review: "To say Brian was amazing, is an understatement! The man brought what was in the dark to me into the light & literally within our first 15 minutes together he helped me generate 25k of immediate cash flow by implementing while we were on the call & a further what is looking to be 600k in revenue this year JUST from that 1 source! Talk about \"what I was leaving on the table\" he showed me exactly what I was leaving on mine! Looking forward to our further sessions... because that return on investment was mind blowing!!",
      imageUrl: chrisSmithImage,
      linkHref: "#chris-2",
    },
    {
      id: "9",
      name: "Michelle Ihegborow",
      title: "Real Estate Professional",
      rating: 5,
      ratingHalf: false,
      review: "Recently, I decided to run my real estate business through Brian's assessment, knowing there was lost revenue and thinking I had a good idea of where the gaps were. What I didn't expect was just how much I was leaving on the table—and, more importantly, how to identify and fix those gaps. The assessment process was both eye-opening and challenging, but Brian's ability to pinpoint key areas for growth and provide actionable solutions made all the difference. Not only did he highlight what I was missing, but he also delivered a clear follow-up plan to help me tackle those gaps head-on. If you're serious about maximizing your business potential, I can't recommend Brian enough. His insights, support, and practical strategies are invaluable for anyone looking to take their business to the next level.",
      imageUrl: michelleIhegborowImage,
      linkHref: "#michelle-2",
    },
  ];

  return (
    <section id="testimonials" className="relative py-14 md:py-20 bg-white">
      <span id="results" className="absolute -top-24 h-1 w-1" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal animation="fade-up">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] mb-4">
              Fuelling Success, Expanding Influence
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-10 md:mb-20">
            Anchor Revenue Review Blueprint
            </p>
          </div>
        </Reveal>

        {/* Reviews Carousel */}
        <Reveal animation="fade-up" delay={90}>
          <ReviewsCarousel reviews={reviews} intervalMs={4000} />
        </Reveal>
      </div>
    </section>
  );
}
