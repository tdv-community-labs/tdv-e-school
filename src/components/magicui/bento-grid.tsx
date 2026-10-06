import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  children,
}: {
  name?: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description?: string;
  href?: string;
  cta?: string;
  children?: ReactNode;
}) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
      "bg-zinc-900/40 backdrop-blur-xl border border-white/10 [box-shadow:0_0_0_1px_rgba(255,255,255,.05),0_8px_30px_rgba(0,0,0,.3)]",
      "transition-all duration-300 hover:border-purple-500/40 hover:[box-shadow:0_0_30px_rgba(168,85,247,.15)]",
      className
    )}
  >
    {background}
    <div className="relative z-10 flex h-full flex-col justify-between p-6">
      {children ? (
        children
      ) : (
        <>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">{name}</h3>
              {description && (
                <p className="text-xs text-zinc-400 max-w-[260px] line-clamp-2">{description}</p>
              )}
            </div>
          </div>
          {cta && (
            <div className="pt-4 flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
              {cta} →
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
