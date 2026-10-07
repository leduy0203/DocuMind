import { Suspense } from "react";
import { ChatWorkspace } from "@/components/workspace/ChatWorkspace";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

async function ChatContent({ params }: ChatPageProps) {
  const { id } = await params;
  return <ChatWorkspace conversationId={id} />;
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-white dark:bg-slate-950 flex items-center justify-center text-xs text-slate-400">
          Loading conversation...
        </div>
      }
    >
      <ChatContent params={params} />
    </Suspense>
  );
}
