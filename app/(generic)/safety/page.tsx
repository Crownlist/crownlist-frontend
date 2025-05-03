import Footer from "@/components/Footer";
import Header from "@/components/Header1";
import Safety from "@/components/Home/Safety";

export default function Home() {
    return (
      <>
      <Header hidden={false} />
      <main className='flex bg-white   w-full  '>
        {/* min-h-[75dvh]  */}
        <Safety/>
      </main>
      <Footer/>
      </>
    )
  }
  