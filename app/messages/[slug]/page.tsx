import Footer from "@/components/Footer";
import Header from "@/components/Header1";
import Message from "@/components/Home/Message";



export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <Header hidden={false} />
            <div className="container mx-auto  py-6 max-md:px-5">
                <Message/>
            </div>
            <Footer />
        </div>
    )
}