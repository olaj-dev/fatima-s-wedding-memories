import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Slide = { src: string; caption: string };

export function Carousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [go]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-gold/30 shadow-elegant sm:aspect-[16/9]">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.caption}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
              i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-6 pt-16">
          <p className="font-display text-lg text-primary-foreground sm:text-xl">
            {slides[index]?.caption}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-gold" : "w-3 bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="rounded-full border border-gold/50 p-2 text-foreground transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next photo"
            onClick={() => go(1)}
            className="rounded-full border border-gold/50 p-2 text-foreground transition-colors hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
