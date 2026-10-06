"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AITutorWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salam! Mən TDV E-School AI Təhsil Müəllimiyəm. Riyaziyyat, Fizika, Kimya və ya digər fənlərdən nəyi izah etməyimi istəyirsiniz?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });
      const json = await res.json();
      if (json.success && json.data?.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: json.data.reply }]);
      } else {
        throw new Error(json.error || "Xəta baş verdi");
      }
    } catch (err: any) {
      toast.error("AI cavab verə bilmədi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Kəsrlərin toplanması qaydası",
    "Nyutonun II Qanunu nədir?",
    "Böhran nöqtələri necə tapılır?",
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-xl flex flex-col h-[480px]">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Dərs Köməkçisi</h3>
            <p className="text-[11px] text-zinc-400">Addım-addım Chain-of-Thought izahlar</p>
          </div>
        </div>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 text-xs">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-white/5 border border-white/10 text-zinc-200 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 items-center text-zinc-400 text-xs">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
            <span>AI izah hazırlayır...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 py-2 border-t border-white/5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(qp);
            }}
            className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-white/10">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sualınızı bura yazın (məs: törəmə düsturu)..."
          className="text-xs h-9 bg-white/5 border-white/10"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !input.trim()}
          className="h-9 px-3 bg-purple-600 hover:bg-purple-500 text-white"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
