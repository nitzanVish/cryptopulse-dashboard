/**
 * Typed Redux hooks
 * 
 * These hooks provide TypeScript type safety when using Redux
 * throughout the application. They ensure that:
 * - useAppDispatch is typed with AppDispatch
 * - useAppSelector is typed with RootState
 * 
 * Usage:
 *   const dispatch = useAppDispatch();
 *   const coins = useAppSelector((state) => state.crypto.coins);
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../services/store';

/**
 * Typed dispatch hook
 * 
 * Use this instead of plain useDispatch() for type-safe dispatch calls
 * 
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setCoins(coins));
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed selector hook
 * 
 * Use this instead of plain useSelector() for type-safe state access
 * 
 * @example
 * const coins = useAppSelector((state) => state.crypto.coins);
 */
export const useAppSelector = useSelector.withTypes<RootState>();
