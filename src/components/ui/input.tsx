import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-black bg-white/80 backdrop-blur-sm px-3 py-2 text-base shadow-sm transition-colors text-bambu-brown file:border-0 file:bg-bambu-green file:text-white file:text-sm file:font-medium file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-bambu-green-dark placeholder:text-bambu-brown/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bambu-green/20 focus-visible:border-bambu-green hover:border-bambu-green/70 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
