import React, { useState } from 'react';
import { logoCandidates, monogramDataUri } from '../../utils/toolVisuals';
import fallbackShot from '../../assets/images/cover-outils-fallback.jpg';

export const LogoImg: React.FC<{
  url: string;
  title: string;
  size?: number;
  className?: string;
}> = ({ url, title, size = 40, className }) => {
  const [i, setI] = useState(0);
  const chain = [...logoCandidates(url), monogramDataUri(title)];
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
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt, className, style }) => {
  const [broken, setBroken] = useState(false);
  return (
    <img
      src={!src || broken ? fallbackShot : src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      className={className}
      style={style}
    />
  );
};
