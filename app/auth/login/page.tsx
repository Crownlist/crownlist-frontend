import Header from "@/components/Header1";
import { LoginForm } from "./loginForm";

export default function LoginPage() {
  return (
    <div className="font-inter">
      <div className="w-full min-h-screen">
        {/* Header */}
      <Header hidden={true} />
        <LoginForm className="max-md:max-w-md mx-auto" imageUrl="../../../public/assets/images/authbg.jpg" />
      </div>
    </div>
  );
}
