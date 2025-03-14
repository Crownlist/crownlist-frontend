import { VerifyForm } from "./verifyForm";

export default function Verify() {
  return (
    <div className="font-i">
      <div className="w-full">
        <VerifyForm
          className="max-md:max-w-md mx-auto"
          imageUrl="../../../public/assets/images/authbg.jpg"
        />{" "}
      </div>
    </div>
  );
}
