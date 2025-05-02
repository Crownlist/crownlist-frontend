import Footer from "@/components/Footer";
import Header from "@/components/Header1";
import TermsAndConditions from "@/components/Home/TermsAndCondition";


export default function TermsAndConditionsPage() {
    return (
        <>
            <Header hidden={false} />
            <main className='flex bg-white w-full'>
                {/* min-h-[75dvh]  */}
                <TermsAndConditions />
            </main>
            <Footer />
        </>
    )
}
