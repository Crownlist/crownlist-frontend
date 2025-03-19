import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer
      className="min-h-[580px] bg-[#141414] bg-center bg-cover h-full w-full bg-no-repeat relative"
      style={{
        backgroundImage: "url(/assets/images/fashion-clothing-hangers.png)",
      }}
    >
      <div className="w-full h-full bg-linear-to-b from-[rgb(20,20,20,0.5)] to-[rgb(20,20,20)] z-50 absolute top-0 left-0 text-white flex flex-col justify-end pb-24">
        <div className="w-full max-w-[85%] mx-auto flex justify-between items-center gap-64">
          <h4 className="text-[48px] leading-[57px] max-w-[40%]">
            Sign up for news and special offers
          </h4>

          <div className="max-w-[482px]">
            <p className="text-lg font-normal mt-5">
              Get the latest cars, car news, buying tips and updates straight to
              your inbox. Sign up to our newsletter now.
            </p>

            <div className="w-full h-10 flex items-start relative mt-7">
              <Input
                type="email"
                className="border border-[#D6D6D6] bg-white text-black rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 h-full placeholder:text-[#141414]"
                placeholder="Enter your email"
              />

              <Button
                size="sm"
                className="bg-[#1F058F] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
