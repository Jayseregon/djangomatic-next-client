import React from "react";
import classNames from "classnames";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { FormSectionAccordionProps } from "@/src/interfaces/reports";

const FormSectionAccordion = ({
  title,
  children,
  menuKey,
  defaultOpen = false,
}: FormSectionAccordionProps) => (
  <Accordion.Root
    collapsible
    defaultValue={defaultOpen ? menuKey : undefined}
    type="single"
  >
    <AccordionItem className="mb-10" value={menuKey}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  </Accordion.Root>
);

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Item
    className={classNames(
      "mt-px overflow-hidden border-b border-emerald-700 dark:border-emerald-400",
      className,
    )}
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
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={classNames(
        "group flex h-[45px] flex-1 items-center rounded-t-xl justify-between uppercase font-semibold text-xl px-5 text-emerald-700 dark:text-emerald-400 outline-none hover:bg-emerald-100 dark:hover:bg-emerald-900",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        aria-hidden
        className="text-emerald-700 dark:text-emerald-400 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames(
      "overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown py-3 space-y-2",
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Content>
));

AccordionContent.displayName = "AccordionContent";

export default FormSectionAccordion;
