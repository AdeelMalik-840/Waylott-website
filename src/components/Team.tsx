"use client";

import Image from "next/image";
import { ShieldCheck, Users, Award } from "lucide-react";
import brianPhoto from "@/images/Brian-photo.png";
import cpeLogo from "@/images/CPE-logo.png";
import Reveal from "./Reveal";

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden py-14 md:py-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#FFF6E6_12%,#FBF9F3_55%,#FFFFFF_85%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_10%,rgba(0,0,0,0.06),transparent_60%)] [mask-image:radial-gradient(90%_80%_at_50%_18%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Reveal animation="fade-up">
          <div className="text-center" style={{ marginBottom: "40px" }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] mb-4">
              The Team Behind The Transformation
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Led by Brian Livingston, Waylott combines two decades of real-world business growth expertise with a proven methodology that consistently delivers measurable results.
            </p>
          </div>
        </Reveal>

        {/* Profile Card */}
        <Reveal animation="fade-up" delay={90}>
          <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0px_8px_20px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Image */}
              <div className="lg:w-2/5 flex-shrink-0">
                <div className="relative w-full p-4 sm:p-6 lg:p-6 lg:pr-0 flex justify-center lg:justify-start">
                  <div className="relative w-full max-w-[300px] sm:max-w-[380px] h-[280px] sm:h-[320px] md:h-[370px] rounded-2xl overflow-hidden">
                    <Image
                      src={brianPhoto}
                      alt="Brian Livingston"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="lg:w-3/5 p-6 sm:p-8 lg:pl-0 lg:-ml-2 lg:py-12 flex flex-col">
                {/* Role */}
                <div className="mb-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D573D]">
                    FOUNDER & COACH
                  </span>
                </div>

                {/* Name */}
                         <h3 className="text-xl sm:text-2xl md:text-[24px] font-bold text-[#000000] mb-2">
                  Brian Livingston
                </h3>

                {/* Biography */}
                <p className="text-base text-slate-600 leading-relaxed mb-4">
                  Brian has personally helped hundreds of business owners uncover millions in hidden revenue — turning struggling operations into scalable, profitable enterprises. His mission is simple: help you reclaim time, maximize profitability, and run your business with clarity and control.
                </p>

                {/* Achievement Badges */}
                <div className="flex flex-col md:flex-row md:flex-wrap gap-3 mb-8">
                  {/* 10X Elite Certified */}
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#F8F1DF] w-full md:w-auto md:inline-flex">
                    <ShieldCheck className="w-5 h-5 text-[#DAA10B]" />
                    <span className="text-sm font-semibold text-[#DAA10B]">10X Elite Certified</span>
                  </div>

                  {/* 200+ owners coached */}
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#EAF3EE] w-full md:w-auto md:inline-flex">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900">200+ owners coached</span>
                  </div>

                  {/* $150M+ unlocked */}
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#ECF7FF] w-full md:w-auto md:inline-flex">
                    <Award className="w-5 h-5 text-[#23699C]" />
                    <span className="text-sm font-semibold text-[#23699C]">$150M+ unlocked</span>
                  </div>
                </div>

                {/* Certification */}
                <div className="mt-auto">
                  <div 
                    className="inline-flex items-center rounded-full shadow-sm p-[1px]"
                    style={{ 
                      background: 'linear-gradient(to right, #DAA518, #1D573D)'
                    }}
                  >
                    <div className="inline-flex items-center rounded-full px-6 py-1 gap-4" style={{ backgroundColor: '#F9F9F8' }}>
                      <span className="text-base font-semibold text-[#1D573D] uppercase tracking-[1px]">CERTIFICATION BY</span>
                      <div className="h-8 w-px bg-gray-400" />
                      <Image
                        src={cpeLogo}
                        alt="CPE Logo"
                        className="h-16 w-auto"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

