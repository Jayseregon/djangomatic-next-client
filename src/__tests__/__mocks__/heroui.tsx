import React from "react";

// Define shared interfaces
interface BaseProps {
  children?: React.ReactNode;
  className?: string;
  nonce?: string;
}

interface ButtonProps extends BaseProps {
  "aria-label"?: string;
  isIconOnly?: boolean;
  onPress?: PressHandler;
  color?: string;
  size?: string;
  variant?: string;
  id?: string;
  isDisabled?: boolean; // Add isDisabled prop
  disabled?: boolean; // Add standard HTML disabled prop
}

// Add a type for event handlers
type PressEvent = React.MouseEvent | React.KeyboardEvent;
type PressHandler = (e: PressEvent) => void;

// Modify createPressHandlers to fix unused variable 'e'
const createPressHandlers = (
  handler?: PressHandler,
  includeRole: boolean = true,
) => ({
  onClick: (e: React.MouseEvent) => {
    e.preventDefault();
    handler?.(e);
  },
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler?.(e);
    }
  },
  ...(includeRole && { role: "button" }),
  tabIndex: 0,
});

export const Button = ({
  children,
  className,
  nonce,
  "aria-label": ariaLabel,
  isIconOnly,
  onPress,
  color,
  id,
  isDisabled,
  ...props
}: ButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPress) {
      onPress(e);
    }
  };

  return (
    <button
      aria-label={
        ariaLabel || (typeof children === "string" ? children : undefined)
      }
      className={className}
      color={color} // Keep this
      data-color={color}
      data-icon-only={isIconOnly}
      data-testid={id || ariaLabel?.toLowerCase().replace(/\s+/g, "-")}
      disabled={isDisabled}
      id={id}
      nonce={nonce}
      role="button"
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Remove unused properties from AvatarProps
interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  name?: string;
}

// Update Avatar component without unused props
export const Avatar = ({
  src,
  alt,
  className,
  name,
  ...props
}: AvatarProps) => (
  <div
    aria-label={name || alt}
    className={className}
    data-name={name}
    data-testid="avatar-image"
    role="img"
  >
    <img alt={alt || name} src={src} {...props} />
  </div>
);

// Update Navbar component to fix accessibility issues
interface NavbarProps extends BaseProps {
  maxWidth?: string;
  isMenuOpen?: boolean;
  onMenuOpenChange?: (isOpen: boolean) => void;
}

export const Navbar = ({ children, className, ...props }: NavbarProps) => {
  const handleMenuToggle = () => {
    props.onMenuOpenChange?.(!props.isMenuOpen);
  };

  return (
    <nav
      className={className}
      data-is-menu-open={props.isMenuOpen}
      data-max-width={props.maxWidth}
      role="navigation"
    >
      <div
        {...createPressHandlers(handleMenuToggle)}
        data-testid="navbar-toggle"
      >
        {children}
      </div>
    </nav>
  );
};

interface NavbarContentProps extends BaseProps {
  justify?: string;
}

export const NavbarContent = ({
  children,
  justify,
  ...props
}: NavbarContentProps) => (
  <div data-justify={justify} {...props}>
    {children}
  </div>
);

export const NavbarItem = ({ children, ...props }: BaseProps) => (
  <div data-testid="navbar-item" {...props}>
    {children}
  </div>
);

export const NavbarBrand = ({ children, ...props }: BaseProps) => (
  <div data-testid="navbar-brand" {...props}>
    {children}
  </div>
);

export const NavbarMenuToggle = ({ children, ...props }: BaseProps) => (
  <button type="button" {...props}>
    {children}
  </button>
);

export const NavbarMenu = ({ children, ...props }: BaseProps) => (
  <div role="menu" {...props}>
    {children}
  </div>
);

export const NavbarMenuItem = ({ children, ...props }: BaseProps) => (
  <div data-testid="navbar-menu-item" {...props}>
    {children}
  </div>
);

export const Dropdown = ({ children, ...props }: BaseProps) => (
  <div data-testid="dropdown" {...props}>
    {children}
  </div>
);

export const DropdownTrigger = ({ children, ...props }: BaseProps) => (
  <div data-testid="dropdown-trigger" {...props}>
    {children}
  </div>
);

interface DropdownMenuProps extends Omit<BaseProps, "children"> {
  disallowEmptySelection?: boolean;
  selectedKeys?: Set<string>;
  selectionMode?: string;
  onSelectionChange?: (keys: Set<string>) => void;
  items?: Array<{ value: string; label: string }>;
  children?:
    | React.ReactNode
    | ((item: { value: string; label: string }) => React.ReactNode);
  disabledKeys?: string[]; // Add disabledKeys prop
}

export const DropdownMenu = ({
  children,
  disallowEmptySelection,
  selectedKeys,
  selectionMode,
  onSelectionChange,
  items,
  disabledKeys = [], // Provide default empty array
  ...props
}: DropdownMenuProps) => {
  // Handle function children with explicit type checking
  const renderChildren = (): React.ReactNode => {
    if (typeof children === "function" && items) {
      return (
        <>
          {items.map((item) =>
            (
              children as (item: {
                value: string;
                label: string;
              }) => React.ReactNode
            )(item),
          )}
        </>
      );
    }

    return typeof children === "function" ? null : children;
  };

  return (
    <div
      {...props}
      aria-disabled={disabledKeys?.length > 0}
      data-disabled-keys={disabledKeys?.join(",")}
      data-disallow-empty={disallowEmptySelection}
      data-selected-keys={Array.from(selectedKeys || []).join(",")}
      data-selection-mode={selectionMode}
      role="menu"
      tabIndex={0}
      onClick={() => onSelectionChange?.(new Set(["test"]))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelectionChange?.(new Set(["test"]));
        }
      }}
    >
      {renderChildren()}
    </div>
  );
};

interface DropdownItemProps extends BaseProps {
  textValue?: string;
  showDivider?: boolean;
  onPress?: PressHandler;
  color?: string;
}

export const DropdownItem = ({
  children,
  className,
  textValue,
  showDivider,
  onPress,
  color,
  ...props
}: DropdownItemProps) => {
  const pressHandlers = createPressHandlers(onPress, false);

  return (
    <div
      className={className}
      data-color={color}
      data-show-divider={showDivider}
      data-text-value={textValue}
      role="menuitem"
      {...pressHandlers}
      {...props}
    >
      {children}
    </div>
  );
};

interface LinkProps extends BaseProps {
  href?: string;
  color?: string;
  underline?: string;
}

export const Link = ({
  children,
  href,
  className,
  color,
  underline,
  ...props
}: LinkProps) => (
  <a
    className={className}
    data-color={color}
    data-underline={underline}
    href={href}
    {...props}
  >
    {children}
  </a>
);

interface SpinnerProps extends BaseProps {
  label?: string;
  color?: string;
  size?: string;
  "aria-label"?: string;
}

export const Spinner = ({
  label,
  color,
  size,
  "aria-label": ariaLabel,
  ...props
}: SpinnerProps) => (
  <div
    aria-label={ariaLabel}
    data-color={color}
    data-size={size}
    data-testid="loading-spinner"
    role="progressbar"
    {...props}
  >
    {label}
  </div>
);

export const Progress = ({
  value,
  className,
  "aria-label": ariaLabel,
}: any) => (
  <div
    aria-label={ariaLabel}
    className={className}
    data-testid="mock-progress"
    role="progressbar"
  >
    {value}%
  </div>
);

// Add the Input component mock
interface InputProps extends BaseProps {
  isClearable?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  startContent?: React.ReactNode;
  placeholder?: string;
  color?: string;
  radius?: string;
  classNames?: {
    input?: string;
    inputWrapper?: string;
  };
  labelPlacement?: string; // Add labelPlacement prop
}

export const Input = ({
  isClearable,
  value,
  onValueChange,
  onClear,
  startContent,
  placeholder,
  color,
  radius,
  classNames,
  labelPlacement, // extract but don't pass to DOM
  ...props
}: InputProps) => {
  const inputClasses = [
    classNames?.input,
    "text-sm",
    "border-none",
    "outline-none",
    "ring-0",
    "focus:border-none",
    "focus:outline-none",
    "focus:ring-0",
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClasses = [
    classNames?.inputWrapper,
    radius && `rounded-${radius}`,
    color && `border-${color}`,
    "text-sm",
    "border-none",
    "outline-none",
    "ring-0",
    "focus:border-none",
    "focus:outline-none",
    "focus:ring-0",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} data-label-placement={labelPlacement}>
      {startContent}
      <input
        className={inputClasses}
        placeholder={placeholder}
        role="searchbox"
        type="search"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      />
      {isClearable && value && (
        <button type="button" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
};

export const Tooltip = ({
  children,
  content,
  color,
  offset = 7, // Add default value
  placement,
  ...props
}: BaseProps & {
  content: React.ReactNode;
  color?: string;
  offset?: number;
  placement?: string;
}) => (
  <div className="relative inline-block" data-testid="tooltip-wrapper">
    {children}
    <div
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2 z-10 py-0.5 px-3 bg-blue-500 text-white dark:text-black text-sm rounded-full shadow-lg text-nowrap transition-opacity duration-500 ease-in-out opacity-0"
      data-color={color}
      data-content={content}
      data-offset={offset} // Add offset to data attributes
      data-placement={placement}
      data-testid="tooltip"
      style={{
        // Use offset in positioning
        marginBottom: `-${offset}px`,
      }}
      {...props}
    >
      {typeof content === "string" ? content : null}
    </div>
  </div>
);

export const Popover = ({ children }: { children: React.ReactNode }) => (
  <div role="dialog">{children}</div>
);
export const PopoverTrigger = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const PopoverContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

// Add Modal component mock
interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose?: () => void;
  closeButton?: boolean;
  backdrop?: string;
  classNames?: {
    base?: string;
    backdrop?: string;
    body?: string;
    header?: string;
    footer?: string;
  };
  size?: string;
}

export const Modal = ({
  isOpen,
  children,
  onClose,
  closeButton,
  backdrop,
  classNames,
  size,
  ...props
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      className={classNames?.base}
      data-backdrop={backdrop}
      data-size={size}
      data-testid="modal"
      role="dialog"
      tabIndex={0}
      onClick={(e) => {
        if (e.target === e.currentTarget && closeButton) {
          onClose?.();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && closeButton) {
          onClose?.();
        }
      }}
      {...props}
    >
      {closeButton && (
        <button
          aria-label="Close"
          className="close-button"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      )}
      <div className="modal-backdrop" data-testid="modal-backdrop" />
      <div className="modal-container" data-testid="modal-container">
        {children}
      </div>
    </div>
  );
};

export const ModalContent = ({ children, className, ...props }: BaseProps) => (
  <div className={className} data-testid="modal-content" {...props}>
    {children}
  </div>
);

export const ModalHeader = ({ children, className, ...props }: BaseProps) => (
  <div className={className} data-testid="modal-header" {...props}>
    {children}
  </div>
);

export const ModalBody = ({ children, className, ...props }: BaseProps) => (
  <div className={className} data-testid="modal-body" {...props}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className, ...props }: BaseProps) => (
  <div className={className} data-testid="modal-footer" {...props}>
    {children}
  </div>
);

// Add Snippet component mock
export const Snippet = ({
  children,
  hideCopyButton,
  hideSymbol,
  variant,
  ...props
}: BaseProps & {
  hideCopyButton?: boolean;
  hideSymbol?: boolean;
  variant?: string;
}) => (
  <div
    className={`inline-flex items-center justify-between h-fit gap-2 px-3 py-1.5 text-small rounded-medium ${
      variant === "flat" ? "bg-default/40" : ""
    } text-default-700`}
    data-hide-copy={hideCopyButton}
    data-hide-symbol={hideSymbol}
    data-testid="code-snippet"
    data-variant={variant}
    {...props}
  >
    <pre className="bg-transparent text-inherit font-mono font-normal inline-block whitespace-nowrap">
      {children}
    </pre>
  </div>
);

// Add Table component mock
interface TableProps extends BaseProps {
  isHeaderSticky?: boolean;
  removeWrapper?: boolean;
  selectionMode?: string;
  topContent?: React.ReactNode;
  emptyContent?: string;
  "aria-label"?: string;
  classNames?: {
    base?: string;
    th?: string;
  };
}

export const Table = ({
  children,
  topContent,
  classNames,
  isHeaderSticky,
  removeWrapper,
  selectionMode,
  ...props
}: TableProps) => (
  <div className={classNames?.base}>
    {topContent}
    <div className="overflow-x-auto">
      <table
        data-header-sticky={isHeaderSticky}
        data-remove-wrapper={removeWrapper}
        data-selection-mode={selectionMode}
        {...props}
      >
        {children}
      </table>
    </div>
  </div>
);

interface TableHeaderProps extends BaseProps {
  className?: string;
}

export const TableHeader = ({
  children,
  className,
  ...props
}: TableHeaderProps) => (
  <thead className={className} {...props}>
    <tr>{children}</tr>
  </thead>
);

export const TableBody = ({
  children,
  items = [],
  emptyContent, // extract but don't pass to DOM
  ...props
}: BaseProps & {
  items: any[];
  emptyContent?: string;
  children?: React.ReactNode | ((item: any) => React.ReactNode);
}) => (
  <tbody data-empty-content={emptyContent} {...props}>
    {typeof children === "function"
      ? items.map((item) => (children as (item: any) => React.ReactNode)(item))
      : children}
  </tbody>
);

export const TableColumn = ({ children, ...props }: BaseProps) => (
  <th {...props}>{children}</th>
);

export const TableRow = ({ children, ...props }: BaseProps) => (
  <tr {...props}>{children}</tr>
);

export const TableCell = ({ children, ...props }: BaseProps) => (
  <td {...props}>{children}</td>
);

// Add a test to satisfy Jest's requirement
describe("HeroUI Mocks", () => {
  it("exists", () => {
    expect(Button).toBeDefined();
  });
});
