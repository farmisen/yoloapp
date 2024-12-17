import React, { forwardRef } from "react"

import { cn } from "~/lib/utils"

type PrefixedInputProps = React.ComponentProps<"input"> & {
  prefix: string
}

const PrefixedInput = forwardRef<HTMLInputElement, PrefixedInputProps>(
  ({ className, type, prefix, ...props }, ref) => {
    return (
      <div
        className={cn(
          "focus-visible:ring-r0disabled:cursor-not-allowed flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50 md:text-sm",
          className
        )}>
        <span>{prefix}</span>
        <input
          type={type}
          ref={ref}
          {...props}
          className="flex w-full border-0 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>
    )
  }
)
PrefixedInput.displayName = "PrefixedInput"

export default PrefixedInput
