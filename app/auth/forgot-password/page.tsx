import { ForgotForm } from "./forgotForm";

export default function ForgotPasswordPage() {
  return (
    <div className="font-inter">
      <div className="w-full min-h-screen">
        <ForgotForm className="max-md:max-w-md mx-auto" imageUrl="../../../public/assets/images/authbg.jpg" />
      </div>
    </div>
  );
}
