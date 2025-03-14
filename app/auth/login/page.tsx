import { LoginForm } from "./loginForm";

export default function LoginPage() {
  return (
    <div className="font-inter">
      <div className="w-full">
        <LoginForm className="max-md:max-w-md mx-auto" imageUrl="../../../public/assets/images/authbg.jpg" />
      </div>
    </div>
  );
}
