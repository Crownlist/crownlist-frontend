/* eslint-disable */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserSignupHook } from "@/lib/signup-hook";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2, Target } from "lucide-react";

export default function SignupForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [lastName, setLastName] = useState('')
 const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    errors,
    isLoading,
    googleLoading,
    handleSubmit,
    onSubmit,
    handleGoogleSignup,
  } = useUserSignupHook();

  const handleFormSubmit = (data: any) => {
    console.log('reg', data)
    if (data.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
      // Combine firstname and lastname into fullname
  const requestData = {
    fullName: `${data.fullName} ${lastName}`,
    phoneNumber: data.phoneNumber,
    accountType: data.accountType,
    email: data.email,
    password: data.password
  };
    onSubmit(requestData);
  };

  return (
    <div className={cn("flex w-full h-full font-inter", className)} {...props}>
      <div className="w-full h-full flex flex-row justify-between relative">
        <div className="h-screen relative hidden md:flex w-[100%]">
          {imageUrl && (
            <Image
              fill
              src={"/assets/images/authbg.jpg"}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              priority={true}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        </div>
        
        <form 
          className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="flex flex-col gap-6 justify-center w-full max-w-md">
            <div className="flex flex-col items-start text-start mb-[10px]">
              <h1 className="text-2xl font-semibold">Sign up to Crownlist</h1>
              <p className="text-sm text-balance mt-1">
                Enter your details below to create an account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder=""
                  {...register("fullName", {
                    required: "Firstname is required",
                  })}
                  disabled={isLoading || googleLoading}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder=""
                  onChange={e => setLastName(e.target.value)}
                  // {...register("lastname", {
                  //   required: "Lastname is required",
                  // })}
                  disabled={isLoading || googleLoading}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                {...register("email", {
                  required: "Email is required",
                })}
                disabled={isLoading || googleLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter a phone number (e.g., 08012345678)"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^(\+234|0)[789][01]\d{8}$/,
                    message: "Please enter a valid Nigerian phone number (e.g., 08012345678, +2348012345678)"
                  },
                  validate: {
                    notEmail: (value) => {
                      if (!value) return true;
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      return !emailRegex.test(value) || "Please enter a phone number, not an email";
                    }
                  }
                })}
                disabled={isLoading || googleLoading}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                {...register("accountType", { required: "Account type is required" })}
                disabled={isLoading || googleLoading}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>Select account type</option>
                <option value="User">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
              {errors.accountType && (
                <p className="text-sm text-red-500">{errors.accountType.message}</p>
              )}
            </div>

            <div className="grid gap-3">
  <Label htmlFor="password">Password</Label>
  <div className="relative">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder=""
      {...register("password", {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      })}
      disabled={isLoading || googleLoading}
      className="pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      disabled={isLoading || googleLoading}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
  {errors.password && (
    <p className="text-sm text-red-500">{errors.password.message}</p>
  )}
</div>

<div className="grid gap-3">
  <Label htmlFor="confirm_password">Confirm Password</Label>
  <div className="relative">
    <Input
      id="confirm_password"
      type={showConfirmPassword ? "text" : "password"}
      placeholder=""
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      disabled={isLoading || googleLoading}
      className="pr-10"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      disabled={isLoading || googleLoading}
      tabIndex={-1}
    >
      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
</div>

            <p className="text-[12px] text-center text-balance">
              By clicking &quot;continue&quot;, you agree to Crownlist`&apos;s{" "}
              <Link href="#" className="underline underline-offset-3 font-medium">
                Terms of use
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline underline-offset-3 font-medium">
                Privacy Policy
              </Link>
            </p>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading || googleLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>

            <div className="flex flex-col w-full h-full gap-1 justify-center items-center">
              <div className="flex flex-row w-full h-full gap-1 justify-center items-center">
                <div className="flex border border-[#525252] h-[1px] w-[100%] justify-center" />
                <div className="text-[#525252] flex align-middle justify-center h-full">OR</div>
                <div className="border border-[#525252] h-[1px] w-[100%]" />
              </div>
              <Button
                type="button"
                className="w-full h-full bg-white text-black border border-[#D6D6D6] hover:bg-primary hover:text-white"
                onClick={handleGoogleSignup}
                disabled={isLoading || googleLoading}
              >
                <div className="flex flex-row gap-3 py-1 items-center">
                  <Image src="/google.svg" width={20} height={20} alt="Google icon" />
                  <div className="flex">
                    {googleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Continue with Google"
                    )}
                  </div>
                </div>
              </Button>
            </div>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-3">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      {/* {isLoading && <LoadingPage />} */}
          {/* <SnackbarComp
            snackBarOpen={snackBarOpen}
            setSnackBarOpen={setSnackBarOpen}
            alert={handleSnack.alert}
            message={handleSnack.message}
          /> */}
    </div>
  );
}

// export default SignupForm;

// "use client";
// import Image from "next/image";
// import login from "../../../public/assets/images/authbg.jpg";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Input, Input2 } from "@/components/ui/custom-input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useUserSignupHook } from "@/lib/signup-hook";
// import { useState } from "react";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

// export function SignupForm({
//   className,
//   imageUrl,
//   ...props
// }: React.ComponentProps<"div"> & {
//   imageUrl?: string;
// }) {
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [pwdVisible, setPwdVisible] = useState(false);
//   const [pwdVisible2, setPwdVisible2] = useState(false);

//   const {
//     handleSnack,
//     snackBarOpen,
//     setSnackBarOpen,
//     register,
//     errors,
//     isLoading,
//     handleSubmit,
//     onSubmit,
//     googleLoading,
//     handleGoogleSignup,
//   } = useUserSignupHook();

//   // Function to handle form submission
//   const handleFormSubmit = (data: any) => {
//     // Check if password and confirm password match
//     if (data.password !== confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Passwords do not match!",
//         variant: "destructive",
//       });
//       return; // Stop form submission
//     }
//     // Proceed with form submission if passwords match
//     onSubmit(data);
//   };

  // return (
  //   <div className={cn("flex w-full h-full font-inter", className)} {...props}>
  //     <div className="w-full h-full flex flex-row justify-between relative">
  //       <div className="h-screen relative hidden md:flex w-[100%]">
  //         {imageUrl && (
  //           <Image
  //             fill
  //             src={login}
  //             alt="Image"
  //             className="absolute inset-0 h-full w-full object-cover"
  //             priority={true}
  //           />
  //         )}
  //         {/* Overlay */}
  //         <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
  //       </div>
  //       <form
  //         className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2"
  //         onSubmit={handleSubmit(handleFormSubmit)}
  //       >
  //         <div className="flex flex-col gap-6 justify-center w-full max-w-md">
  //           <div className="flex flex-col items-start text-start mb-[10px]">
  //             <h1 className="text-2xl font-semibold">Create Account!</h1>
  //             <p className="text-sm text-balance mt-1">
  //               Create your account and start achieving your goals with us!
  //             </p>
  //           </div>

  //           <Button
  //             type="button"
  //             variant="outline"
  //             className="w-full h-full bg-white text-black border border-[#D6D6D6] hover:text-white hover:bg-primary"
  //             onClick={handleGoogleSignup}
  //             disabled={isLoading || googleLoading}
  //           >
  //             <div className="flex flex-row gap-3 py-1 items-center">
  //               <div className="flex">
  //                 <Image src="/google.svg" width={20} height={20} alt="icon" />
  //               </div>
  //               <div className="flex">
  //                 {googleLoading ? (
  //                   <Loader2 className="h-4 w-4 animate-spin" />
  //                 ) : (
  //                   "Continue with Google"
  //                 )}
  //               </div>
  //             </div>
  //           </Button>

  //           <div className="flex flex-row w-full h-full gap-1 justify-center items-center">
  //             <div className="flex border border-[#525252] h-[1px] w-[100%] justify-center" />
  //             <div className="text-[#525252] flex align-middle justify-center h-full">
  //               OR
  //             </div>
  //             <div className="border border-[#525252] h-[1px] w-[100%]" />
  //           </div>

  //           <div className="grid grid-cols-2 gap-4">
  //             <div className="grid gap-3">
  //               <Label htmlFor="firstname">Firstname</Label>
  //               <Input
  //                 id="firstname"
  //                 type="text"
  //                 placeholder=""
  //                 disabled={isLoading || googleLoading}
  //                 {...register("firstname", {
  //                   required: "Firstname is required",
  //                 })}
                 
  //               />
  //             </div>
  //             <div className="grid gap-3">
  //               <Label htmlFor="lastname">Lastname</Label>
  //               <Input
  //                 id="lastname"
  //                 type="text"
  //                 placeholder=""
  //                 disabled={isLoading || googleLoading}
  //                 {...register("lastname", {
  //                   required: "Lastname is required",
  //                 })}
                  
  //               />
  //             </div>
  //           </div>

  //           <div className="grid gap-3">
  //             <Label htmlFor="email">Email</Label>
  //             <Input
  //               id="email"
  //               type="email"
  //               placeholder=""
  //               disabled={isLoading || googleLoading}
  //               {...register("email", {
  //                 required: "Email is required",
  //               })}
               
  //             />
  //           </div>

  //           <div className="grid gap-3">
  //             <Label htmlFor="phoneNumber">Phone Number</Label>
  //             <Input
  //               id="phoneNumber"
  //               type="tel"
  //               placeholder=""
  //               disabled={isLoading || googleLoading}
  //               {...register("phoneNumber", {
  //                 required: "Phone number is required",
  //               })}
                
  //             />
  //           </div>

  //           <div className="grid gap-3">
  //             <Label htmlFor="password">Password</Label>
  //             <Input2
  //               id="password"
  //               type={pwdVisible ? "text" : "password"}
  //               disabled={isLoading || googleLoading}
  //               {...register("password", {
  //                 required: "Password is required",
  //                 minLength: {
  //                   message: "Password must be minimum of 8 characters.",
  //                   value: 8,
  //                 },
  //               })}
              
  //               // icon={
  //               //   <button
  //               //     type="button"
  //               //     className="absolute right-3 top-1/2 transform -translate-y-1/2"
  //               //     onClick={() => setPwdVisible(!pwdVisible)}
  //               //   >
  //               //     {pwdVisible ? (
  //               //       <EyeOff className="h-4 w-4" />
  //               //     ) : (
  //               //       <Eye className="h-4 w-4" />
  //               //     )}
  //               //   </button>
  //               // }
  //             />
  //           </div>

  //           <div className="grid gap-3">
  //             <Label htmlFor="confirm_password">Confirm Password</Label>
  //             <Input2
  //               id="confirm_password"
  //               type={pwdVisible2 ? "text" : "password"}
  //               value={confirmPassword}
  //               onChange={(e) => setConfirmPassword(e.target.value)}
  //               disabled={isLoading || googleLoading}
  //               // icon={
  //               //   <button
  //               //     type="button"
  //               //     className="absolute right-3 top-1/2 transform -translate-y-1/2"
  //               //     onClick={() => setPwdVisible2(!pwdVisible2)}
  //               //   >
  //               //     {pwdVisible2 ? (
  //               //       <EyeOff className="h-4 w-4" />
  //               //     ) : (
  //               //       <Eye className="h-4 w-4" />
  //               //     )}
  //               //   </button>
  //               // }
  //             />
  //           </div>

  //           <p className="text-[12px] text-center text-balance">
  //             By clicking "continue", you agree to Crownlist's{" "}
  //             <a
  //               href="#"
  //               className="underline underline-offset-3 font-medium"
  //             >
  //               Terms of use
  //             </a>{" "}
  //             and{" "}
  //             <a
  //               href="#"
  //               className="underline underline-offset-3 font-medium"
  //             >
  //               Privacy Policy
  //             </a>
  //             .
  //           </p>

  //           <Button
  //             type="submit"
  //             className="w-full mt-2"
  //             disabled={isLoading || googleLoading}
  //           >
  //             {isLoading ? (
  //               <Loader2 className="h-4 w-4 animate-spin" />
  //             ) : (
  //               "Continue"
  //             )}
  //           </Button>

  //           <p className="text-center text-sm">
  //             Already have an account?{" "}
  //             <a
  //               href="/auth/login"
  //               className="underline underline-offset-3 text-primary"
  //             >
  //               Login
  //             </a>
  //           </p>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
// }

// export default SignupForm;
// "use client"
// import Image from "next/image";
// import login from "../../../public/assets/images/authbg.jpg";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// import { Input, Input2 } from "@/components/ui/custom-input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useUserSignupHook } from "@/lib/signup-hook";
// import { useState } from "react";

// export function SignupForm({
//   className,
//   imageUrl,
//   ...props
// }: React.ComponentProps<"div"> & {
//   imageUrl?: string;
// }) {
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const {
//     handleSnack,
//     snackBarOpen,
//     setSnackBarOpen,
//     register,
//     errors,
//     isLoading,
//     handleSubmit,
//     onSubmit,
//     googleLoading,
//     handleGoogleSignup,
//   } = useUserSignupHook();

//    // Function to handle form submission
//    const handleFormSubmit = (data:any) => {
//     // Check if password and confirm password match
//     if (data.password !== confirmPassword) {
//       // Show alert if passwords don't match
//       alert("Passwords do not match!");
//       //handleMessage("Passwords do not match!");
//       return; // Stop form submission
//     }
//     // Proceed with form submission if passwords match
//     onSubmit(data);
//   };

//   return (
//     <div className={cn("flex w-full h-full font-inter", className)} {...props} > 
//       <div className="w-full h-full flex flex-row justify-between relative ">
//         <div className="h-screen relative hidden md:flex  w-[100%] ">
//           {imageUrl && (
//             <Image
//               fill
//               src={login}
//               alt="Image"
//               className="absolute inset-0 h-full w-full object-cover"
//               priority={true}
//             />
//           )}
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent "></div>
//         </div>
//         <form className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2"  onSubmit={handleSubmit(handleFormSubmit)}>
//           <div className="flex flex-col gap-6 justify-center">
//             <div className="flex flex-col items-start text-start mb-[10px]">
//               <h1 className="text-2xl font-semibold">Sign up in to Crownlist</h1>
//               <p className="text-sm text-balance mt-1">
//                 Enter your login details below
//               </p>
//             </div>

//             <div className="grid gap-3">
//               <Label htmlFor="name">Full name</Label>
//               <Input id="name" type="text" placeholder="" required 
//                {...register("firstname", {
//                 required: "Firstname is required",
//               })}
//               error={errors?.email ? true : false}
//                 helperText={
//                   errors?.email ? (
//                     <p className="text-red-500 text-[12px]">
//                       {errors?.email?.message}
//                     </p>
//                   ) : (
//                     <></>
//                   )
//                 }
//               />
//             </div>

//             <div className="grid gap-3">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="" required />
//             </div>

//             <div className="grid gap-3">
//               <Label htmlFor="password">Password</Label>
//               <Input2 id="password" type="password" required />
//             </div>

//             <div className="grid gap-3">
//               <Label htmlFor="confirm_password">Confirm Password</Label>
//               <Input2 id="confirm_password" type="password" required />
//               <p className="text-[12px] *:[a]:hover:text-primary text-center text-balance *:[a]:underline *:[a]:underline-offset-4">
//                 By clicking &quot;continue&quot;, you agree to Crownlist&apos;s{" "}
//                 <a
//                   href="#"
//                   className="underline underline-offset-3 font-medium"
//                 >
//                   Terms of use
//                 </a>{" "}
//                 and{" "}
//                 <a
//                   href="#"
//                   className="underline underline-offset-3 font-medium"
//                 >
//                   Privacy Policy
//                 </a>
//                 .
//               </p>
//             </div>

//             <Link href="/auth/signup/verify">
//               <Button type="submit" className="w-full mt-2 h-full">
//                 <div className="flex py-1"> Continue</div>

//               </Button>
//             </Link>
//             <div className="flex flex-col w-full h-full gap-1 justify-center  items-center">
//               <div className="flex flex-row w-full h-full gap-1 justify-center  items-center">
//                 <div className="flex border border-[#525252] h-[1px] w-[100%] justify-center" />
//                 <div className="text-[#525252] flex align-middle justify-center h-full ">OR</div>
//                 <div className="border border-[#525252] h-[1px] w-[100%]" />
//               </div>
//               <Button className="w-full h-full bg-white text-black  border border-[#D6D6D6] hover:text-white">
//                 <div className="flex flex-row gap-3 py-1 items-center ">
//                   <div className="flex">
//                     <Image
//                       src='/google.svg'
//                       width={20}
//                       height={20}
//                       alt="icon"
//                     />
//                   </div>
//                   <div className="flex ">Continue with Google</div>
//                 </div>
//               </Button>
//             </div>
//             <p className="text-center text-sm">
//               Do you have an account?{" "}
//               <a href="/auth/login" className="underline underline-offset-3">
//                 Login
//               </a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// export default SignupForm;
