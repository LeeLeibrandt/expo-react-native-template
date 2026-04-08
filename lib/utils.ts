import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong.') => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

export const sanitizeText = (value: string) => value.replace(/\u0000/g, '').trim();

export const toArrayBufferFromUri = async (uri: string) => {
  const response = await fetch(uri);
  return response.arrayBuffer();
};
