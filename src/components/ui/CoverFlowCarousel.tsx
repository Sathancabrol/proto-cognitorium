import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LogoImg, ShotImg } from './ToolVisual';

const ChevronLeftIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export interface CarouselItem {
  id?: string;
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img?: string;
  logo?: string;
  scene?: string;
  host?: string;
  href?: string;
  layout?: 'poster' | 'tool';
  tone?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface CoverFlowCarouselProps {
  items: CarouselItem[];
  sectionLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  onCtaClick?: (item: CarouselItem) => void;
  onBack?: () => void;
  backLabel?: string;
  header?: React.ReactNode;
}

export function CoverFlowCarousel({
  items,
  sectionLabel,
  autoplay = true,
  autoplayDelay = 6000,
  className = '',
  onCtaClick,
  onBack,
  backLabel = 'Retour',
  header
}: CoverFlowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => setCurrentIndex(idx % Math.max(total, 1));

  const itemsKey = items.map((i) => i.id || i.titleLine1).join('|');
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsKey]);

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return;
    const interval = window.setInterval(nextSlide, autoplayDelay);
    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, nextSlide, total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!items.length) return null;

  const current = items[currentIndex];

  return (
    <section
      className={`relative w-full min-h-[640px] flex items-center justify-center overflow-hidden py-8 select-none rounded-3xl ${className}`}
      style={{ backgroundColor: '#0c0a09', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 45) {
          if (diff < 0) nextSlide();
          else prevSlide();
        }
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {current?.img ? (
          <img
            src={current.img}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.22) blur(32px)',
              transform: 'scale(1.15)'
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: current?.tone || 'linear-gradient(160deg, #1e293b, #0c0a09)'
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(12,10,9,0.3) 0%, rgba(12,10,9,0.92) 100%)'
          }}
        />
      </div>

      {(onBack || header) && (
        <div className="absolute top-4 left-4 right-4 z-50 flex flex-wrap items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9999,
                backgroundColor: 'rgba(0,0,0,0.62)',
                border: '1px solid rgba(197,168,128,0.45)',
                color: '#f3f0ea',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              ← {backLabel}
            </button>
          )}
          {header}
        </div>
      )}

      <div className="relative w-full max-w-6xl mx-auto px-4 z-10 flex flex-col items-center">
        {sectionLabel && (
          <div className={`flex items-center gap-3 mb-6 ${onBack || header ? 'mt-10' : ''}`}>
            <span style={{ width: 36, height: 1, background: 'linear-gradient(90deg, transparent, #c5a880)' }} />
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#c5a880',
                margin: 0
              }}
            >
              {sectionLabel}
            </h3>
            <span style={{ width: 36, height: 1, background: 'linear-gradient(90deg, #c5a880, transparent)' }} />
          </div>
        )}

        <div className="relative w-full h-[480px] flex justify-center items-center mb-6" style={{ perspective: 1400 }}>
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;
            let transform = 'translateX(0px) scale(0.4) rotateY(0deg)';
            let opacity = 0;
            let zIndex = 0;
            let filter = 'brightness(0.4) blur(2px)';
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = 'translateX(0px) scale(1) rotateY(0deg)';
              opacity = 1;
              zIndex = 30;
              filter = 'brightness(1)';
            } else if (offset === 1) {
              transform = 'translateX(240px) scale(0.84) rotateY(-24deg)';
              opacity = 0.65;
              zIndex = 20;
              filter = 'brightness(0.75)';
            } else if (offset === 2) {
              transform = 'translateX(430px) scale(0.68) rotateY(-38deg)';
              opacity = 0.38;
              zIndex = 10;
              filter = 'brightness(0.55) blur(1px)';
            } else if (offset === total - 1) {
              transform = 'translateX(-240px) scale(0.84) rotateY(24deg)';
              opacity = 0.65;
              zIndex = 20;
              filter = 'brightness(0.75)';
            } else if (offset === total - 2) {
              transform = 'translateX(-430px) scale(0.68) rotateY(38deg)';
              opacity = 0.38;
              zIndex = 10;
              filter = 'brightness(0.55) blur(1px)';
            }

            const nearby = offset === 0 || offset === 1 || offset === 2 || offset === total - 1 || offset === total - 2;
            const isTool = item.layout === 'tool';

            return (
              <div
                key={item.id || idx}
                onClick={() => !isCenter && goToSlide(idx)}
                style={{
                  position: 'absolute',
                  width: 280,
                  height: 430,
                  borderRadius: 18,
                  overflow: 'hidden',
                  backgroundColor: '#171311',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  transformOrigin: 'center center',
                  transition: 'all 800ms cubic-bezier(0.25, 1, 0.5, 1)',
                  boxShadow: isCenter
                    ? '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(197,168,128,0.25)'
                    : '0 15px 35px rgba(0,0,0,0.5)',
                  cursor: isCenter ? 'default' : 'pointer'
                }}
              >
                {isTool ? (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#0b1220' }}>
                    <div
                      style={{
                        height: 28,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '0 10px',
                        background: '#111827',
                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171' }} />
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24' }} />
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399' }} />
                      <span
                        style={{
                          marginLeft: 6,
                          flex: 1,
                          fontSize: 9,
                          color: 'rgba(226,232,240,0.7)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.host || 'page officielle'}
                      </span>
                    </div>
                    <div style={{ height: 228, flexShrink: 0, position: 'relative', background: '#0f172a' }}>
                      {nearby && (
                        <ShotImg
                          src={item.img}
                          alt={`${item.titleLine1} — page d’accueil`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        />
                      )}
                    </div>
                  </div>
                ) : item.img && nearby ? (
                  <img
                    src={item.img}
                    alt={item.titleLine1}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: item.tone || 'linear-gradient(160deg, #1e293b, #0c0a09)'
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isTool
                      ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 48%, rgba(11,18,32,0.92) 68%, #0b1220 100%)'
                      : 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.96) 100%)',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    padding: '20px 18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    zIndex: 20,
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? 'translateY(0px)' : 'translateY(16px)',
                    transition: 'opacity 500ms ease, transform 500ms ease',
                    pointerEvents: isCenter ? 'auto' : 'none'
                  }}
                >
                  <div style={{ textAlign: 'right', width: '100%' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                      {item.tag}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                    {isTool && item.href && nearby && (
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 14,
                          padding: 4,
                          background: '#fff',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                          marginBottom: 6
                        }}
                      >
                        <LogoImg url={item.href} title={item.titleLine1} local={item.logo} size={44} />
                      </div>
                    )}
                    <h2
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        margin: 0,
                        lineHeight: 1.1
                      }}
                    >
                      {item.titleLine1}
                    </h2>
                    {item.titleLine2 && (
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: '#f3f0ea' }}>
                        {item.titleLine2}
                      </span>
                    )}
                    <div style={{ width: 34, height: 2, backgroundColor: '#c5a880', margin: '6px auto' }} />
                    {item.desc && (
                      <p
                        style={{
                          fontSize: '0.78rem',
                          fontStyle: 'italic',
                          color: 'rgba(255,255,255,0.9)',
                          maxWidth: 240,
                          margin: '0 0 10px',
                          lineHeight: 1.35
                        }}
                      >
                        {item.desc}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => onCtaClick?.(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 18px',
                        borderRadius: 9999,
                        background: 'linear-gradient(135deg, #c5a880 0%, #a48256 100%)',
                        color: '#110d0c',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{item.ctaText || 'Ouvrir'}</span>
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Précédent"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 40
              }}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Suivant"
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 40
              }}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, zIndex: 30 }}>
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Carte ${idx + 1}`}
              style={{
                height: 8,
                width: idx === currentIndex ? 28 : 8,
                borderRadius: 9999,
                backgroundColor: idx === currentIndex ? '#c5a880' : 'rgba(255,255,255,0.25)',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
