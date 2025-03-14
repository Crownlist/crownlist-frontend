import SignupForm from "./signupForm";

export default function SignupPage() {
  return (
    <div className="font-inter">
      <div className="w-full">
        <SignupForm
          className="max-md:max-w-md mx-auto"
          imageUrl="../../../public/assets/images/authbg.jpg"
        />
      </div>
    </div>
  );
}
