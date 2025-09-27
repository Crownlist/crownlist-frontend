"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const FormSchema = z.object({
  pin: z.string().min(5, {
    message: "Your one-time password must be 5 characters.",
  }),
});

export function VerifyForm({
  className
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push("/auth/reset-password");
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

  }

  return (
    <div className={cn("flex w-full h-full font-inter", className)}>
      <div className="w-full h-full flex flex-row justify-between relative ">
        <div
          className="min-h-screen flex flex-col gap-5 max-md:px-7 justify-center w-full items-center md:mt-2"
        // className="p-6 md:p-10 mt-10 md:col-span-3 lg:col-span-2"
        >
          <div className="flex flex-col gap-6  justify-center">
            <div className="flex flex-col items-center md:items-start md:mb-[10px]">
              <h1 className="text-2xl">Verify your email</h1>
              <p className="text-sm text-center mt-2">
                Please enter the code sent to <br className="hidden md:block" />
                &quot;Sample@gmail.com&quot;
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                // className="min-h-screen flex flex-col gap-5 max-md:px-7 justify-center w-full items-center md:mt-2"   
                className="w-full flex gap-3 flex-col max-md:justify-center max-md:items-center"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>One-Time Password</FormLabel> */}
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="space-x-4">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="mt-2 text-[13px] text-black text-center md:text-left">
                        Didn&apos;t get the code?{" "}
                        <span>
                          {" "}
                          <Link
                            href="#"
                            className="underline underline-offset-3 font-medium"
                          >
                            Resend{" "}
                          </Link>
                        </span>
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Link href='/auth/check/sucess'>
                <Button type="submit" className=" justify-center mt-2 w-full h-[43px] max-w-[250px]">
                  <div className="flex py-3">Continue</div>
                </Button>
                </Link>{" "}
                <p className="text-center text-sm mt-4">
                  Do you have an account?{" "}
                  <Link
                    href="/auth/check/sign-in"
                    className="underline underline-offset-3"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
