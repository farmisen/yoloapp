import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const objectUrlMimeType = (url: string) =>
  url.split(";base64,").shift()?.split(":").pop()
