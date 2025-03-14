"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Input2({ className, type, ...props }: React.ComponentProps<"input">) {
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  return (
  
    <div className="relative">
      <Input
        type={passwordShow ? "text" : "password"}
        id="password"
        data-slot="input"
        className={cn(
          "border-crown-border-grey items-center justify-between file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        placeholder=" "
      />
      {passwordShow ? (
        <Eye
          className="absolute size-5 min-[1500px]:top-4 right-4 top-2 z-10 cursor-pointer text-crown-black"
          onClick={() => setPasswordShow(!passwordShow)}
        />
      ) : (
        <EyeClosed
          className="absolute right-4 min-[1500px]:top-4 top-2 size-5 z-10 cursor-pointer text-crown-black"
          onClick={() => setPasswordShow(!passwordShow)}
        />
      )}
      
    </div>
  );
}
export { Input, Input2 };
