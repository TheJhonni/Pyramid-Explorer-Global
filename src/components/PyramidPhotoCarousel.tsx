import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff } from 'lucide-react';
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

  const validImages = images.filter((_, i) => !failedImages.has(i));

  if (validImages.length === 0 && !googleUrl) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  const searchUrl = googleUrl || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + ' pyramid archaeological site')}`;

  return (
    <section>
      <h3 className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1.5 mb-3">
        📷 {t.photos || 'Photos'}
      </h3>

      {images.length > 0 && (
        <div className="relative rounded-lg overflow-hidden bg-secondary/30 border border-border">
          <div className="aspect-video relative">
            {!failedImages.has(currentIndex) ? (
              <img
                src={images[currentIndex]}
                alt={`${name} - ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(currentIndex)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageOff size={32} />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-border hover:bg-background/90 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-border hover:bg-background/90 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}

            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/70 backdrop-blur-sm text-[10px] font-mono text-muted-foreground">
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
                      loading="lazy"
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

      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-1.5 text-[11px] text-primary/70 hover:text-primary transition-colors font-mono"
      >
        <ExternalLink size={10} /> {t.searchMorePhotos || 'Search more photos on Google'}
      </a>
    </section>
  );
};

export default PyramidPhotoCarousel;
