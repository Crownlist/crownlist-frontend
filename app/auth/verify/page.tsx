import { VerifyForm } from "./verifyForm";

export default function Verify() {
  return (
    <div className="font-inter">
      <div className="w-full min-h-screen">
        <VerifyForm
          className="max-md:max-w-md mx-auto"
          imageUrl="../../../public/assets/images/authbg.jpg"
        />{" "}
      </div>
    </div>
  );
}
