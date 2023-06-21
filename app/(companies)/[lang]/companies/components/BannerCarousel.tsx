import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from 'components/Link'
import Image from "next/image";
/* Assets */
import styles from '../BannerCarousel.module.scss'

interface BannerCarouselProps {
  slides: any
}

const BannerCarousel = ({
  slides=[]
}: BannerCarouselProps) => {
  const autoplay = useRef(
    // eslint-disable-next-line
    Autoplay(
      { delay: 5000, stopOnInteraction: false },
      (emblaRoot) => emblaRoot.parentElement
    )
  );

  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
    embla
  ]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);


  const DotButton = ({ selected, onClick }: any) => (
    <button
      className={`${styles.bannerDot} ${selected ? styles.is_selected : ""}`}
      type="button"
      onClick={onClick}
    />
  );
  
  return (
    <div className={styles.bannerCarousel}>
      <div className={styles.banner}>
        <div className={styles.bannerViewport} ref={viewportRef}>
          <div className={styles.bannerContainer}>
            {slides.map((banner, index) => (
              <div className={styles.bannerSlide} key={index}>
                <Link
                  className={styles.bannerSlideInner}
                  to={banner.cta_url}
                  target="_blank"
                  external
                >
                  <Image 
                    fill={true}
                    src={banner.cover_pic_url}
                    alt={`${banner.title} photo`}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.bannerDots}>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel
