import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
export function copyArray(source: any[], array: any[] = []) {
  let index = -1;
  const length = source.length;

  array || (array = new Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * shuffle([1, 2, 3, 4])
 * // => [4, 1, 3, 2]
 */
export function shuffle<T>(array: T[], randomFunction?: () => number): T[] {
  if (!randomFunction) {
    randomFunction = Math.random;
  }
  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  let index = -1;
  const lastIndex = length - 1;
  const result = copyArray(array);
  while (++index < length) {
    const rand = index + Math.floor(randomFunction() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
}

export function getRandomFloat(
  min: number,
  max: number,
  randomFunction?: () => number
): number {
  if (!randomFunction) {
    randomFunction = Math.random;
  }
  return randomFunction() * (max - min) + min;
}

export function getRandomInt(
  min: number,
  max: number,
  randomFunction?: () => number
): number {
  return Math.floor(getRandomFloat(min, max, randomFunction));
}

export const getWidth = (): number => {
  if (window.innerWidth) {
    return Math.min(document.documentElement.clientWidth, window.innerWidth);
  }
  return document.documentElement.clientWidth;
};

export const getHeight = (): number => {
  if (window.innerHeight) {
    return Math.min(document.documentElement.clientHeight, window.innerHeight);
  }
  return document.documentElement.clientHeight;
};
