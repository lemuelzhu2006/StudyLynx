"use client"

import { cn } from "@/lib/utils"

const SIZE_MAP = {
  xs: "w-7 h-7 text-xs",
  sm: "w-9 h-9 text-sm",
  md: "w-10 h-10 text-sm",
  lg: "w-11 h-11 text-sm",
  xl: "w-12 h-12 text-base",
  "2xl": "w-14 h-14 text-lg",
} as const

interface AvatarProps {
  src: string
  size?: keyof typeof SIZE_MAP
  className?: string
}

function isImageSrc(src: string) {
  return src.startsWith("data:image") || src.startsWith("http")
}

export function Avatar({ src, size = "md", className }: AvatarProps) {
  if (isImageSrc(src)) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        className={cn(
          "rounded-full object-cover flex-shrink-0",
          SIZE_MAP[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 flex items-center justify-center font-semibold",
        SIZE_MAP[size],
        className
      )}
    >
      {src}
    </div>
  )
}
