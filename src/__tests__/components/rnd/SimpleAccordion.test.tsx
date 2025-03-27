import { render, screen, fireEvent } from "@testing-library/react";

import SimpleAccordion from "@/components/rnd/SimpleAccordion";

// Mock Radix UI components
jest.mock("@radix-ui/react-accordion", () => {
  const React = require("react");

  // Create a context to track open items
  const AccordionContext = React.createContext({
    open: null as string | null,
    // setOpen: (value: string | null) => {},
  });

  // Root component that manages state
  const Root = ({ defaultValue, children, type, collapsible }: any) => {
    const [open, setOpen] = React.useState(defaultValue || null);

    return (
      <AccordionContext.Provider value={{ open, setOpen }}>
        <div
          data-collapsible={collapsible}
          data-testid="accordion-root"
          data-type={type}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  };

  // Item component
  const Item = ({ value, children, className, ...props }: any) => {
    return (
      <div
        className={className}
        data-testid="accordion-item"
        data-value={value}
        {...props}
      >
        {children}
      </div>
    );
  };

  // Header component
  const Header = ({ children }: any) => (
    <div data-testid="accordion-header">{children}</div>
  );

  // Trigger component that toggles open state
  const Trigger = ({ children, className, ...props }: any) => {
    const { open, setOpen } = React.useContext(AccordionContext);
    const itemValue = React.useContext(ItemContext);

    return (
      <button
        className={className}
        data-state={open === itemValue ? "open" : "closed"}
        data-testid="accordion-trigger"
        onClick={() => setOpen(open === itemValue ? null : itemValue)}
        {...props}
      >
        {children}
      </button>
    );
  };

  // Content component that shows/hides based on open state
  const Content = ({ children, className, ...props }: any) => {
    const { open } = React.useContext(AccordionContext);
    const itemValue = React.useContext(ItemContext);

    return (
      <div
        className={className}
        data-state={open === itemValue ? "open" : "closed"}
        data-testid="accordion-content"
        style={{ display: open === itemValue ? "block" : "none" }}
        {...props}
      >
        {children}
      </div>
    );
  };

  // Context to pass item value to children
  const ItemContext = React.createContext(null as string | null);

  // Wrap Item to provide context
  const WrappedItem = ({ value, ...props }: any) => (
    <ItemContext.Provider value={value}>
      <Item value={value} {...props} />
    </ItemContext.Provider>
  );

  return {
    Root,
    Item: WrappedItem,
    Header,
    Trigger,
    Content,
  };
});

// Mock ChevronDownIcon
jest.mock("@radix-ui/react-icons", () => ({
  ChevronDownIcon: () => <div data-testid="chevron-icon">▼</div>,
}));

describe("SimpleAccordion", () => {
  const defaultProps = {
    title: "Accordion Title",
    menuKey: "test-accordion",
    children: <div>Accordion Content</div>,
  };

  it("renders with the provided title", () => {
    render(<SimpleAccordion {...defaultProps} />);

    expect(screen.getByText("Accordion Title")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
  });

  it("renders as collapsed by default", () => {
    render(<SimpleAccordion {...defaultProps} />);

    const content = screen.getByTestId("accordion-content");

    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveStyle({ display: "none" });
  });

  it("renders as expanded when defaultOpen is true", () => {
    render(<SimpleAccordion {...defaultProps} defaultOpen={true} />);

    const content = screen.getByTestId("accordion-content");

    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveStyle({ display: "block" });
  });

  it("expands when the header is clicked", () => {
    render(<SimpleAccordion {...defaultProps} />);

    const trigger = screen.getByTestId("accordion-trigger");
    const content = screen.getByTestId("accordion-content");

    // Initially closed
    expect(content).toHaveAttribute("data-state", "closed");

    // Click to open
    fireEvent.click(trigger);

    // Should be open now
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveStyle({ display: "block" });
  });

  it("collapses when clicked while expanded", () => {
    render(<SimpleAccordion {...defaultProps} defaultOpen={true} />);

    const trigger = screen.getByTestId("accordion-trigger");
    const content = screen.getByTestId("accordion-content");

    // Initially open
    expect(content).toHaveAttribute("data-state", "open");

    // Click to close
    fireEvent.click(trigger);

    // Should be closed now
    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveStyle({ display: "none" });
  });

  it("renders the children when expanded", () => {
    render(
      <SimpleAccordion {...defaultProps} defaultOpen={true}>
        <div data-testid="child-content">Custom Child Content</div>
      </SimpleAccordion>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Custom Child Content")).toBeInTheDocument();
  });

  it("applies the expected CSS classes", () => {
    render(<SimpleAccordion {...defaultProps} />);

    const item = screen.getByTestId("accordion-item");
    const trigger = screen.getByTestId("accordion-trigger");
    const content = screen.getByTestId("accordion-content");

    expect(item).toHaveClass("border-b-2 border-foreground");
    expect(trigger).toHaveClass(
      "flex items-center justify-between w-full p-4 text-4xl font-bold text-foreground bg-background",
    );
    expect(content).toHaveClass(
      "overflow-hidden pb-4 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
    );
  });

  it("passes menuKey as the accordion value", () => {
    render(<SimpleAccordion {...defaultProps} menuKey="custom-key" />);

    const item = screen.getByTestId("accordion-item");

    expect(item).toHaveAttribute("data-value", "custom-key");
  });

  it("sets up accordion as single type and collapsible", () => {
    render(<SimpleAccordion {...defaultProps} />);

    const root = screen.getByTestId("accordion-root");

    expect(root).toHaveAttribute("data-type", "single");
    expect(root).toHaveAttribute("data-collapsible", "true");
  });
});
