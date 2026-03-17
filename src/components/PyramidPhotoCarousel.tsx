import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff, Search } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface PyramidPhotoCarouselProps {
  images: string[];
  googleUrl?: string;
  name: string;
}

const PyramidPhotoCarousel = ({ images, googleUrl, name }: PyramidPhotoCarouselProps) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Reset state when pyramid changes
  useEffect(() => {
    setCurrentIndex(0);
    setFailedImages(new Set());
  }, [name]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const searchUrl = googleUrl || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + ' pyramid archaeological site')}`;
  
  const workingImages = images.filter((_, i) => !failedImages.has(i));

  return (
    <section className="space-y-2">
      <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5">
        📷 {t.photos}
      </h3>

      {workingImages.length > 0 && (
        <div className="relative rounded-lg overflow-hidden bg-secondary/30 border border-border">
          <div className="aspect-video relative bg-muted/50">
            {!failedImages.has(currentIndex) ? (
              <img
                src={images[currentIndex]}
                alt={`${name} - ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(currentIndex)}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImageOff size={24} />
                <span className="text-[10px] font-mono">Image unavailable</span>
              </div>
            )}

            {workingImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}

            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm text-[10px] font-mono text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-1 p-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-colors ${
                    i === currentIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {!failedImages.has(i) ? (
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(i)}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageOff size={8} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Google Images search link - always visible */}
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/40 border border-border text-[11px] text-foreground/70 hover:text-primary hover:border-primary/30 transition-all font-mono"
      >
        <Search size={11} /> {t.searchMorePhotos}
      </a>
    </section>
  );
};

export default PyramidPhotoCarousel;
