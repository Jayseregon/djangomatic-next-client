import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface SimpleAccordionProps {
  title: string;
  children: React.ReactNode;
  menuKey: string;
  defaultOpen?: boolean;
}

const SimpleAccordion: React.FC<SimpleAccordionProps> = ({
  title,
  children,
  menuKey,
  defaultOpen = false,
}) => (
  <Accordion.Root
    collapsible
    defaultValue={defaultOpen ? menuKey : undefined}
    type="single"
  >
    <AccordionItem value={menuKey}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  </Accordion.Root>
);

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Item
    className="border-b-2 border-foreground"
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Header>
    <Accordion.Trigger
      className="flex items-center justify-between w-full p-4 text-4xl font-bold text-foreground bg-background"
      {...props}
      ref={forwardedRef}
    >
      <span className="text-left capitalize">{children}</span>
      <ChevronDownIcon
        aria-hidden
        className="transition-transform duration-300 data-[state=open]:rotate-180"
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Content
    {...props}
    ref={forwardedRef}
    className="overflow-hidden pb-4 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown"
  >
    {children}
  </Accordion.Content>
));

AccordionContent.displayName = "AccordionContent";

export default SimpleAccordion;
