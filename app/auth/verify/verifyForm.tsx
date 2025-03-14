"use client";
import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";
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


const FormSchema = z.object({
  pin: z.string().min(5, {
    message: "Your one-time password must be 5 characters.",
  }),
});

export function VerifyForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-5">
          <div className="h-screen relative hidden md:block md:col-span-2 lg:col-span-3">
            {imageUrl && (
              <Image
                fill
                src={login}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
                priority={true}
              />
            )}
          </div>
          <div className="p-6 md:p-10 mt-10 md:col-span-3 lg:col-span-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center md:items-start md:mb-[10px]">
                <h1 className="text-2xl">Verify your email</h1>
                <p className="text-sm text-balance mt-1">
                  Please enter the code sent to <br className="hidden md:block" />
                  &quot;Sample@gmail.com&quot;
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-12 max-md:flex max-md:flex-col max-md:justify-center max-md:items-center"
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
                            <a
                              href="#"
                              className="underline underline-offset-3 font-medium"
                            >
                              Resend{" "}
                            </a>
                          </span>
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-">
                    Continue
                  </Button>{" "}
                  <p className="text-center text-sm mt-4">
                    Do you have an account?{" "}
                    <a
                      href="/auth/login"
                      className="underline underline-offset-3"
                    >
                      Login
                    </a>
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
