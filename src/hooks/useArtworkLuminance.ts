import { useState, useEffect } from 'react';

interface LuminanceResult {
  isLight: boolean;
  luminance: number; // 0 to 255
}

/**
 * Samples the top region of an artwork image using an offscreen canvas
 * to determine whether the area under overlaid badges is predominantly light or dark.
 * Formula: L = 0.299*R + 0.587*G + 0.114*B (per ITU-R BT.601)
 */
export function useArtworkLuminance(imageUrl?: string): LuminanceResult {
  const [result, setResult] = useState<LuminanceResult>({ isLight: false, luminance: 0 });

  useEffect(() => {
    if (!imageUrl) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw top 25% of the image where badges reside
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * 0.25, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;

        let totalLuminance = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3] / 255;
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) * a;
          totalLuminance += lum;
          count++;
        }

        const avgLuminance = count > 0 ? totalLuminance / count : 0;
        if (isMounted) {
          setResult({
            isLight: avgLuminance > 155,
            luminance: avgLuminance,
          });
        }
      } catch {
        // Fallback for CORS or local loading restrictions
        if (isMounted) {
          setResult({ isLight: false, luminance: 30 });
        }
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setResult({ isLight: false, luminance: 30 });
      }
    };

    img.src = imageUrl;

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return result;
}
