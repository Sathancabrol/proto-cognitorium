import React, { useState } from 'react';
import { logoCandidates, monogramDataUri } from '../../utils/toolVisuals';
import fallbackShot from '../../assets/images/cover-outils-fallback.jpg';

export const LogoImg: React.FC<{
  url: string;
  title: string;
  local?: string;
  size?: number;
  className?: string;
}> = ({ url, title, local, size = 40, className }) => {
  const [i, setI] = useState(0);
  const chain = [local, ...logoCandidates(url), monogramDataUri(title)].filter(Boolean) as string[];
  const src = chain[Math.min(i, chain.length - 1)];
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={() => setI((n) => Math.min(n + 1, chain.length - 1))}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        background: '#fff',
        borderRadius: 10
      }}
    />
  );
};

export const ShotImg: React.FC<{
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, fallback, alt, className, style }) => {
  const [broken, setBroken] = useState(false);
  return (
    <img
      src={!src || broken ? fallback || fallbackShot : src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      className={className}
      style={style}
    />
  );
};
