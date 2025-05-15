import AdminMessage from "@/components/AdminMessage";


export default function Home() {
    return (
        <div className="flex w-full h-full p-3 md:p-6 ">
            <div className="flex w-full h-full mx-auto  py-6 max-md:px-5">
            <AdminMessage/>
            </div>
        </div>
    )
}