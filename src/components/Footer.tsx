'use client';

import Image from 'next/image';
import Link from 'next/link';
import footerLogo from '@/images/image.png';
import Reveal from './Reveal';

export default function Footer() {
  return (
    <Reveal animation="fade-up" delay={120}>
      <footer className="relative bg-black text-white">
        <div className="relative mx-auto w-[90%] px-4 sm:px-6 lg:px-8 py-10">
          {/* Main content grid - using flex for better control */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">
            {/* Column 1: Logo and Mission Statement - widest */}
            <div className="flex-shrink-0 lg:w-[42%]">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Logo on the left */}
                <div className="flex-shrink-0">
                  <Image
                    src={footerLogo}
                    alt="Waylott Revenue Growth Strategists"
                    width={120}
                    height={65}
                    className="h-auto w-20 sm:w-24 md:w-[120px]"
                    priority={false}
                  />
                </div>
                {/* Text content on the right */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-bold text-white mb-3">
                    Empower Your Business to Thrive.
                  </h3>
                  <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                    Equip your business with the dynamic strategies and expert mentorship that turn obstacles into opportunities for growth!
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Get In Touch */}
            <div className="flex-shrink-0 lg:w-[19%]">
              <h4 className="text-base sm:text-lg font-bold text-white mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm sm:text-base text-white/50">
                <li>
                  <a href="mailto:support@waylott.com" className="hover:text-white/70 transition-colors">
                    support@waylott.com
                  </a>
                </li>
                <li>
                  <a href="tel:+15879718369" className="hover:text-white/70 transition-colors">
                    (587) 971-8369
                  </a>
                </li>
                <li>Calgary, AB, Canada</li>
              </ul>
            </div>

            {/* Column 3: Assistance Hours */}
            <div className="flex-shrink-0 lg:w-[19%]">
              <h4 className="text-base sm:text-lg font-bold text-white mb-4">Assistance Hours</h4>
              <ul className="space-y-3 text-sm sm:text-base text-white/50">
                <li>Mon - Sun</li>
                <li>09:00am - 08:00pm</li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="flex-shrink-0 lg:w-[19%]">
              <h4 className="text-base sm:text-lg font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm sm:text-base text-white/50">
                <li>
                  <Link href="/privacy" className="hover:text-white/70 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white/70 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Separator line */}
          <hr className="mt-8 border-t border-gray-500" />

          {/* Copyright */}
          <div className="mt-4 text-sm text-gray-400">
            © 2025 Waylott Revenue Growth Strategists. All Rights Reserved.
          </div>
        </div>
      </footer>
    </Reveal>
  );
}
