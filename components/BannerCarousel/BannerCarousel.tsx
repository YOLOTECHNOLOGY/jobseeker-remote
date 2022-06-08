import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import classNames from 'classnames/bind'
import Link from 'components/Link'

/* Assets */
import styles from './BannerCarousel.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

interface BannerCarouselProps {
  slides: any
}

const BannerCarousel = ({
  slides
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
    <>
      <div className={styles.banner}>
        <div className={styles.bannerViewport} ref={viewportRef}>
          <div className={styles.bannerContainer}>
            {slides.map((banner, index) => (
              <div className={styles.bannerSlide} key={index}>
                <div className={styles.bannerSlideInner}>
                  <Link
                    to={banner.cta_url}
                    external
                  >
                    <img
                      src={banner.cover_pic_url}
                      alt={banner.title}
                      className={classNames([styles.bannerSlideImage, breakpointStyles.hideOnMobileAndTablet])}
                    />
                    <img
                      src={banner.tablet_cover_pic_url}
                      alt={banner.title}
                      className={classNames([styles.bannerSlideImage, breakpointStyles.hideOnMobileAndDesktop])}
                    />
                    <img
                      src={banner.mobile_cover_pic_url}
                      alt={banner.title}
                      className={classNames([styles.bannerSlideImage, breakpointStyles.hideOnTabletAndDesktop])}
                    />
                  </Link>
                </div>
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
    </>
  );
}

export default BannerCarousel
