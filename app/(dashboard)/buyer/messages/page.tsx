
import MessagingInterface from "@/components/Home/Chat";
import { ChatProvider } from "@/notifications/chat-context";

export default function Home() {
    return (
        <div className="flex w-full h-full">
            <ChatProvider>
                <div className="flex w-full h-full mx-auto py-6 max-md:px-5">
                    <MessagingInterface />
                </div>
            </ChatProvider>
        </div>
    );
}
