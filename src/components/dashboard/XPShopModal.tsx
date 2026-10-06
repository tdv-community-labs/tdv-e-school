"use client";

import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Shield, Flame, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface XPShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xpBalance: number;
  onPurchase: (cost: number) => void;
}

export function XPShopModal({
  open,
  onOpenChange,
  xpBalance,
  onPurchase,
}: XPShopModalProps) {
  const shopItems = [
    {
      id: "streak-freeze",
      name: "Davamiyyət Qoruyucusu (Streak Freeze)",
      description: "1 gün dərs buraxsanız belə zərbə gününüzü sıfırlanmaqdan qoruyur.",
      cost: 500,
      icon: Flame,
      color: "amber",
    },
    {
      id: "double-xp",
      name: "2x İkiqat XP Gücləndiricisi (24 Saat)",
      description: "Həll etdiyiniz növbəti testlərdən ikiqat xal qazanın.",
      cost: 800,
      icon: Sparkles,
      color: "purple",
    },
    {
      id: "avatar-frame",
      name: "Qızıl Çərçivə (VIP Avatar)",
      description: "Liderlər lövhəsində adınızın yanında parıldayan çərçivə.",
      cost: 1500,
      icon: Award,
      color: "emerald",
    },
    {
      id: "anti-cheat-pass",
      name: "Sınaq Təkrarlama Biletı",
      description: "İstənilən BSQ və ya KSQ-ni təkrar sınaqdan keçirmək imkanı.",
      cost: 300,
      icon: Shield,
      color: "cyan",
    },
  ];

  const handleBuy = (item: (typeof shopItems)[0]) => {
    if (xpBalance < item.cost) {
      toast.error("Kifayət qədər XP yoxdur!", {
        description: `Bu əşya üçün daha ${item.cost - xpBalance} XP lazımdır. Test həll edərək qazanın.`,
      });
      return;
    }

    onPurchase(item.cost);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    toast.success(`${item.name} uğurla alındı!`, {
      description: `Hesabınızdan ${item.cost} XP çıxıldı.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>XP Mükafat Mağazası</span>
          </DialogTitle>
          <Badge variant="outline" className="border-purple-500/30 font-mono text-purple-300">
            Balans: {xpBalance} XP
          </Badge>
        </div>
        <DialogDescription>
          Akademik uğurlarınız və sınaqlardan qazandığınız XP ballarını xüsusi üstünlüklərə dəyişin.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-1">
        {shopItems.map((item) => {
          const Icon = item.icon;
          const canAfford = xpBalance >= item.cost;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[11px] text-zinc-400 leading-tight">{item.description}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant={canAfford ? "default" : "outline"}
                disabled={!canAfford}
                onClick={() => handleBuy(item)}
                className="h-8 text-xs font-mono font-bold shrink-0 ml-3"
              >
                {item.cost} XP
              </Button>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}
