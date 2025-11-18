import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-black bg-bambu-beige backdrop-blur-sm px-3 py-3 text-base shadow-sm text-bambu-brown placeholder:text-bambu-brown/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bambu-green/20 focus-visible:border-bambu-green hover:border-bambu-green/70 transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
