import { Loader2 } from "lucide-react";

export default function CustomLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
      <Loader2 className="animate-spin h-10 w-10 text-crown-primary mb-4" />
      <span className="text-crown-primary text-lg font-semibold">{text}</span>
    </div>
  );
}