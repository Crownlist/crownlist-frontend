import { LoginForm } from "./_components/loginform";


export default function LoginPage() {
  return (
    <div className="font-inter">
      <div className="w-full min-h-screen">
        <LoginForm className="max-md:max-w-md mx-auto" />
      </div>
    </div>
  );
}
