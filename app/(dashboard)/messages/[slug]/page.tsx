import Footer from "@/components/Footer";
import Header from "@/components/Header1";
import Message from "@/components/Home/Message";



export default function Home() {
    return (
        <div className="flex w-full h-full ">
            <div className="flex w-full h-full mx-auto  py-6 max-md:px-5">
                <Message/>
            </div>
        </div>
    )
}