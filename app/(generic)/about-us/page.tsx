import Footer from "@/components/Footer";
import Header from "@/components/Header1";
import AboutUs from "@/components/Home/AboutUs";

export default function Home() {
  return (
    <>
      <Header hidden={false} />

      <main className='flex bg-white   w-full  '>
        <AboutUs />
      </main>
      <Footer />
    </>
  )
}
