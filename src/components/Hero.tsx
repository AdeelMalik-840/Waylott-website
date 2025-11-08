"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import heroBlob from "@/images/hero-blov.svg";
import videoThumbnail from "@/images/video-thumbnail.png";
import Reveal from "./Reveal";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [offset, setOffset] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [showBlob, setShowBlob] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);

  // subtle scroll parallax
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const t = Math.min(14, Math.max(0, y * 0.15));
      setOffset(t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // Fade-in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // respectful autoplay - disabled to show thumbnail first
  // useEffect(() => {
  //   const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  //   if (!prefersReduced && videoRef.current) {
  //     const v = videoRef.current;
  //     v.muted = true;
  //     const p = v.play();
  //     if (p) p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  //   }
  // }, []);

  const togglePlayback = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // Hide thumbnail when starting to play
      setShowThumbnail(false);
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const newTime = parseFloat(e.target.value);
    v.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const container = videoContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Update video progress and duration
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const updateTime = () => setCurrentTime(v.currentTime);
    const updateDuration = () => setDuration(v.duration);
    const handleLoadedMetadata = () => {
      setDuration(v.duration);
    };

    v.addEventListener('timeupdate', updateTime);
    v.addEventListener('loadedmetadata', handleLoadedMetadata);
    v.addEventListener('durationchange', updateDuration);

    return () => {
      v.removeEventListener('timeupdate', updateTime);
      v.removeEventListener('loadedmetadata', handleLoadedMetadata);
      v.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden pt-24 md:pt-28 pb-14 sm:pb-16">
      {/* Hero blob background - behind main title - moved to be behind heading */}

      {/* top fade to prevent "blob cut" under the transparent nav */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 z-[2]"
        style={{
          height: "calc(var(--nav-h) + 12px)",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 80%)",
        }}
      />

      {/* inside hero section background div */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(80% 90% at 50% 0%, #FFF6E6 0%, #FBF9F3 45%, #FFFFFF 100%)',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-[900px] text-center relative z-10">
          {/* Sentinel for navbar scroll detection - positioned at heading */}
          <div id="hero-heading-sentinel" className="absolute left-0 w-full h-1 pointer-events-none z-20" style={{ top: 0 }} />
          
          {/* Hero blob background - behind main heading text */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[20%] md:-translate-y-[30%] w-full max-w-[1800px] aspect-[1500/1620] opacity-70 md:opacity-100 pointer-events-none -z-10">
            <div className="relative w-full h-full" style={{ filter: 'hue-rotate(-25deg) saturate(1.4) brightness(1.2) contrast(0.9)' }}>
              <Image
                src={heroBlob}
                alt=""
                fill
                className="object-contain"
                style={{ objectPosition: 'center top', opacity: 1 }}
                priority
              />
            </div>
          </div>
          
          {/* HEADLINE 48px, one line */}
          <Reveal animation="fade-up" delay={40}>
            <h1 
              ref={headingRef}
              className="text-[40px] md:text-[48px] leading-[1.08] tracking-[-0.01em] font-extrabold text-[#0B1423] relative z-10"
              style={{ 
                transform: `translateY(${offset * 0.25}px)`, 
                transition: "transform 120ms cubic-bezier(0.16, 1, 0.3, 1)",
                textShadow: 'none',
                WebkitTextStroke: '0px transparent',
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility'
              }}
            >
              <span 
                className="text-[#1D573D] relative z-10"
                style={{ 
                  textShadow: 'none',
                  WebkitTextStroke: '0px transparent'
                }}
              >
                Frustrated?
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#DAA518_0%,#B98D1B_100%)] text-[40px] md:text-[48px]">
                Overworked?
              </span>{" "}
              <span>Underpaid?</span>
            </h1>
          </Reveal>

          {/* SUBHEAD smaller + calmer */}
          <Reveal animation="fade-up" delay={80}>
            <p className="mt-6 text-base sm:text-lg md:text-[20px] leading-[1.6] text-[#333] max-w-[720px] mx-auto px-4">
              Find out how much money your business is leaving on the table with our guaranteed revenue blueprint.
            </p>
          </Reveal>

          {/* CTAs compact */}
          <Reveal animation="fade-up" delay={120}>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
            <a
              href="https://app.waylott.com/widget/booking/dR4kyj64ZOULbqZ7TOx6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] font-semibold text-white shadow-[0_10px_20px_rgba(29,87,61,0.18)]
                         transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D573D]/50 w-full sm:w-auto"
              style={{ 
                backgroundColor: '#1D573D',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#164a3a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1D573D';
              }}
            >
              Schedule a Consultation
            </a>
            <a
              href="#about"
                     className="inline-flex items-center justify-center rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] font-semibold
                                  border border-[#1D573D] text-[#1D573D] bg-transparent hover:bg-[#1D573D] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D573D]/50 w-full sm:w-auto"
            >
              Learn More
            </a>
            </div>
          </Reveal>

          {/* Video spacing compact */}
          <Reveal animation="fade-up" delay={160}>
            <div className="mt-8" style={{ transform: `translateY(${offset}px)`, transition: "transform 80ms linear" }}>
              <div className="relative mx-auto max-w-5xl w-full">
              {/* soft halo behind the card (very subtle) */}
              <div className="pointer-events-none absolute inset-0 translate-y-4 blur-[18px] rounded-[28px] bg-black/8" />

              <div 
                ref={videoContainerRef}
                className="group relative z-10 rounded-[28px] overflow-hidden border-2 border-white shadow-[0_16px_48px_rgba(16,24,40,0.16)] bg-white"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
              {videoError ? (
                <img src="/window.svg" alt="Hero visual" className="w-full h-auto block" />
              ) : (
                <>
                  {/* Video element */}
                  <video
                    ref={videoRef}
                    src="/hero-video.mp4"
                    onError={() => setVideoError(true)}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="none"
                    onClick={togglePlayback}
                    onPlay={() => {
                      setIsPlaying(true);
                      setShowThumbnail(false);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full h-auto block aspect-[4/3] md:aspect-video object-cover antialiased border-4 border-white"
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                  </video>

                  {/* Thumbnail overlay with fade animation */}
                  <AnimatePresence>
                    {showThumbnail && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      >
                        <div className="relative w-full h-full aspect-[4/3] md:aspect-video">
                          <Image
                            src={videoThumbnail}
                            alt="Video thumbnail"
                            fill
                            className="object-cover"
                            priority
                            quality={90}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Video Controls Bar */}
                  {!showThumbnail && (
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: showControls || isPlaying ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #CFAE57 0%, #CFAE57 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                        }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Play/Pause Button */}
                        <button
                          type="button"
                          aria-label={isPlaying ? "Pause video" : "Play video"}
                          title={isPlaying ? "Pause video" : "Play video"}
                          onClick={togglePlayback}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
                        >
                          {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <rect x="6" y="5" width="4" height="14" rx="1" />
                              <rect x="14" y="5" width="4" height="14" rx="1" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M8 5v14l11-7-11-7z" />
                            </svg>
                          )}
                        </button>

                        {/* Mute/Unmute Button */}
                        <button
                          type="button"
                          aria-label={isMuted ? "Unmute video" : "Mute video"}
                          title={isMuted ? "Unmute video" : "Mute video"}
                          onClick={toggleMute}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
                        >
                          {isMuted ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          )}
                        </button>

                        {/* Time Display */}
                        <span className="text-white text-sm font-medium">
                          {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Fullscreen Button */}
                      <button
                        type="button"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        onClick={toggleFullscreen}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
                      >
                        {isFullscreen ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    </motion.div>
                  )}

                  {/* Center play/pause button (only when paused or thumbnail showing) */}
                  {(!isPlaying || showThumbnail) && (
                    <button
                      type="button"
                      aria-label="Play video"
                      title="Play video"
                      onClick={togglePlayback}
                      className="absolute inset-0 m-auto flex items-center justify-center rounded-full
                                  text-white ring-1 ring-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.18)]
                                  transition-opacity duration-300 active:scale-95 z-20
                                  w-16 h-16 md:w-20 md:h-20"
                      style={{ backgroundColor: '#DAA518' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7-11-7z" />
                      </svg>
                    </button>
                  )}
                </>
              )}
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
