
import Message from "@/components/Home/Message";
import { ChatProvider } from "@/notifications/chat-context";



export default function Home() {
    return (
        <ChatProvider>
            <div className="flex w-full h-full ">
                <div className="flex w-full h-full mx-auto  py-6 max-md:px-5">
                    <Message/>
                </div>
            </div>
        </ChatProvider>
    )
}
