'use client'

import { useState } from "react";
import Image from "next/image";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ReturnData } from "@/types/anime-data";

export default function Hero({ trendingData }: { trendingData: ReturnData; }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const animes = trendingData?.results?.slice(0, 10) || [];
  
  if (animes.length === 0) return null;

  const activeAnime = animes[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
  };

  return (
    <div className="relative w-full min-h-[70vh] overflow-hidden text-foreground bg-background">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {activeAnime.bannerImage && (
            <Image
              fill
              priority
              alt={activeAnime.title?.userPreferred || "Anime background"}
              src={activeAnime.bannerImage}
              className="object-cover object-center"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-linear-to-r from-background via-background/60 to-transparent z-10" />

      <div className="container relative mx-auto h-full px-6 py-12 flex flex-col justify-end z-20 min-h-[70vh] pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground drop-shadow-xl line-clamp-2">
              {activeAnime.title?.userPreferred}
            </h1>

            <div className="flex items-center gap-x-4 gap-y-2 text-sm text-foreground/90 mb-4 flex-wrap">
              {activeAnime.status && (
                <Chip className="inline-flex items-center rounded-full bg-emerald-950 px-3 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                  {activeAnime.status}
                </Chip>
              )}
              {activeAnime.type && <Chip variant="soft">{activeAnime.type}</Chip>}
              {activeAnime.format && <Chip variant="soft">{activeAnime.format}</Chip>}
              {activeAnime.year && <Chip variant="soft">{activeAnime.year}</Chip>}
            </div>

            {activeAnime.genres && activeAnime.genres.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {activeAnime.genres.map((genre: string) => (
                  <Chip
                    key={genre}
                    variant="tertiary"
                    className="px-3 py-1 ring-1 ring-inset ring-foreground/20 backdrop-blur-sm"
                  >
                    {genre}
                  </Chip>
                ))}
              </div>
            )}

            <div 
              className="max-w-2xl text-sm text-foreground/80 mb-8 line-clamp-3 md:line-clamp-4"
              dangerouslySetInnerHTML={{ __html: activeAnime.description || "No description available." }}
            />

            <div className="flex items-center gap-4">
              <Button className="px-7 py-5 bg-foreground text-background font-semibold hover:-translate-y-0.5 transition-transform">
                <Play className="size-5 fill-background" />
                Watch Now
              </Button>
              
              <Button
                variant="outline"
                className="px-7 py-5 bg-background/20 backdrop-blur-md font-semibold hover:-translate-y-0.5 transition-transform border-foreground/20"
              >
                <Info className="size-5" />
                More Info
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-30 container mx-auto px-6 flex items-center justify-between pointer-events-none">
        
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {animes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Skip to anime ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                idx === currentIndex
                  ? "w-8 bg-focus"
                  : "w-2 bg-muted/30 hover:bg-muted/50"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <Button 
            isIconOnly 
            variant="tertiary" 
            onClick={handlePrev} 
            className="rounded-full bg-background/40 backdrop-blur-md hover:bg-background/70 text-foreground border border-foreground/10"
            aria-label="Previous anime"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button 
            isIconOnly 
            variant="tertiary" 
            onClick={handleNext} 
            className="rounded-full bg-background/40 backdrop-blur-md hover:bg-background/70 text-foreground border border-foreground/10"
            aria-label="Next anime"
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}