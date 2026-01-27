/**
 * PriceTag Component
 * 
 * Displays price with color-coded animation on change (green/red).
 * Uses useRef for prevPrice to avoid unnecessary re-renders.
 */

import { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '@/features/crypto/cryptoUtils';
import type { PriceChangeDirection } from '@/types/crypto';
import {
  PRICE_CHANGE_DIRECTION,
  PRICE_CHANGE_COLORS,
  PRICE_CHANGE_ANIMATIONS,
  PRICE_TAG_BASE_CLASSES,
} from '@/constants/styles';

interface PriceTagProps {
  price: number;
  className?: string;
}

export function PriceTag({ price, className = '' }: PriceTagProps) {
  const [animationState, setAnimationState] = useState<PriceChangeDirection>(null);
  // useRef instead of useState: prevPrice doesn't need to trigger re-renders
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevPriceRef.current === null) {
      prevPriceRef.current = price;
      return;
    }

    if (price > prevPriceRef.current) {
      setAnimationState(PRICE_CHANGE_DIRECTION.UP);
    } else if (price < prevPriceRef.current) {
      setAnimationState(PRICE_CHANGE_DIRECTION.DOWN);
    }

    prevPriceRef.current = price;

    // Clear animation after 1 second
    const timeoutId = setTimeout(() => {
      setAnimationState(null);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [price]);
  const colorClass = animationState
    ? PRICE_CHANGE_COLORS[animationState]
    : PRICE_CHANGE_COLORS.neutral;
  
  const animationClass = animationState
    ? PRICE_CHANGE_ANIMATIONS[animationState]
    : PRICE_CHANGE_ANIMATIONS.neutral;

  return (
    <span
      className={`${PRICE_TAG_BASE_CLASSES} ${colorClass} ${animationClass} ${className}`}
    >
      {formatCurrency(price)}
    </span>
  );
}
