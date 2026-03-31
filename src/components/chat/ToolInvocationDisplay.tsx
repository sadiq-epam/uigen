import { Loader2 } from "lucide-react";
import { getToolMessage } from "@/lib/utils/tool-messages";

interface ToolInvocationDisplayProps {
  toolInvocation: {
    toolName: string;
    args: any;
    state: "partial-call" | "call" | "result";
    result?: any;
  };
}

export function ToolInvocationDisplay({
  toolInvocation,
}: ToolInvocationDisplayProps) {
  const message = getToolMessage(toolInvocation);
  const isCompleted =
    toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isCompleted ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
