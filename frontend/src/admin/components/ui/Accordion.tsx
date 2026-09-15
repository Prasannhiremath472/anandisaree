import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/admin/utils";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;

export function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between py-3 text-left font-heading text-sm font-semibold text-neutral-800 outline-none",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content className={cn("overflow-hidden text-sm", className)} {...props}>
      <div className="pb-4">{children}</div>
    </AccordionPrimitive.Content>
  );
}
