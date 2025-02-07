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
  label?: string;
  isReadOnly?: boolean;
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
  label,
  isReadOnly,
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

  const inputId = React.useId();

  return (
    <div className={wrapperClasses} data-label-placement={labelPlacement}>
      {startContent}
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        className={inputClasses}
        id={inputId}
        placeholder={placeholder}
        readOnly={isReadOnly}
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
  hideCloseButton?: boolean; // Add to interface
  closeButton?: boolean; // Add back the original prop
  backdrop?: string;
  classNames?: {
    base?: string;
    backdrop?: string;
    body?: string;
    header?: string;
    footer?: string;
  };
  size?: string;
  "aria-labelledby"?: string;
}

export const Modal = ({
  isOpen,
  children,
  onClose,
  hideCloseButton,
  closeButton,
  backdrop,
  classNames,
  size,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ModalProps) => {
  if (!isOpen) return null;

  // Support both hideCloseButton and closeButton props
  const shouldShowCloseButton = closeButton ?? !hideCloseButton;

  return (
    <div
      aria-labelledby={ariaLabelledBy}
      aria-modal="true"
      className={classNames?.base}
      data-backdrop={backdrop}
      data-size={size}
      data-testid="modal"
      role="dialog"
      tabIndex={0}
      onClick={(e) => {
        if (e.target === e.currentTarget && shouldShowCloseButton) {
          onClose?.();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && shouldShowCloseButton) {
          onClose?.();
        }
      }}
      {...props}
    >
      {shouldShowCloseButton && (
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
  "aria-label"?: string;
  isHeaderSticky?: boolean;
  removeWrapper?: boolean;
  selectionMode?: string;
  topContent?: React.ReactNode;
  emptyContent?: string;
  classNames?: {
    base?: string;
    th?: string;
  };
  sortDescriptor?: {
    column?: string;
    direction?: "ascending" | "descending";
  };
  onSortChange?: (descriptor: any) => void;
}

export const Table: React.FC<TableProps> = ({
  children,
  topContent,
  classNames,
  "aria-label": ariaLabel,
}) => (
  <div className={classNames?.base}>
    {topContent}
    <div className="overflow-x-auto">
      <table aria-label={ariaLabel}>{children}</table>
    </div>
  </div>
);

// Update TableBodyProps to not extend BaseProps
interface TableBodyProps {
  className?: string;
  nonce?: string;
  items?: any[];
  emptyContent?: string;
  isLoading?: boolean;
  loadingContent?: React.ReactNode;
  children?: React.ReactNode | ((item: any) => React.ReactNode);
}

// Add missing TableHeaderProps interface
interface TableHeaderProps extends BaseProps {
  className?: string;
}

// Update TableBody to handle both function and element children
export const TableBody = ({
  children,
  items = [],
  emptyContent = "No entries found",
  isLoading,
  loadingContent,
}: TableBodyProps) => {
  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={2}>{loadingContent}</td>
        </tr>
      </tbody>
    );
  }
  if (!items?.length) {
    return (
      <tbody>
        <tr>
          <td colSpan={2}>{emptyContent}</td>
        </tr>
      </tbody>
    );
  }
  if (typeof children === "function") {
    return (
      <tbody>
        {items.map((item: any, index: number) => (
          <React.Fragment key={index}>{children(item)}</React.Fragment>
        ))}
      </tbody>
    );
  }

  return <tbody>{children}</tbody>;
};

interface TableColumnProps extends BaseProps {
  allowsSorting?: boolean;
  key?: string;
}

export const TableColumn: React.FC<TableColumnProps> = ({
  children,
  allowsSorting,
  ...props
}) => (
  <th data-allows-sorting={allowsSorting} {...props}>
    {children}
  </th>
);

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
  ...props
}) => (
  <thead className={className} {...props}>
    <tr>{children}</tr>
  </thead>
);

export const TableRow = ({ children, ...props }: BaseProps) => (
  <tr {...props}>{children}</tr>
);

export const TableCell = ({ children, ...props }: BaseProps) => (
  <td {...props}>{children}</td>
);

// Add Tabs component mock
interface TabsProps extends BaseProps {
  "aria-label"?: string;
  variant?: string;
  classNames?: {
    tabList?: string;
    cursor?: string;
    tab?: string;
    tabContent?: string;
  };
}

export const Tabs: React.FC<TabsProps> = ({
  children,
  "aria-label": ariaLabel,
  variant,
  classNames,
  ...props
}) => {
  const [selectedKey, setSelectedKey] = React.useState<string>();

  // Convert children to array and filter out non-Tab elements
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab,
  );

  // Set initial selected tab
  React.useEffect(() => {
    if (tabs.length > 0 && !selectedKey) {
      const firstTabKey = (tabs[0] as React.ReactElement).key?.toString() || "";

      setSelectedKey(firstTabKey);
    }
  }, [tabs, selectedKey]);

  return (
    <div
      aria-label={ariaLabel}
      className={classNames?.tabList}
      data-variant={variant}
      role="tablist"
      {...props}
    >
      {tabs.map((tab) => {
        const tabElement = tab as React.ReactElement<TabProps>;
        const key = tabElement.key?.toString() || "";

        return React.cloneElement(tabElement, {
          key,
          isSelected: selectedKey === key,
          onSelect: () => setSelectedKey(key),
        });
      })}
    </div>
  );
};

interface TabProps extends BaseProps {
  key?: string;
  title: string | React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const Tab: React.FC<TabProps> = ({
  children,
  title,
  isSelected,
  onSelect,
  ...props
}) => {
  return (
    <div role="tabpanel" {...props}>
      {/* Fix click-events-have-key-events and interactive-supports-focus */}
      <div
        role="tab"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSelect?.();
          }
        }}
      >
        <span
          data-testid={`tab-${typeof title === "string" ? title : "content"}`}
        >
          {title}
        </span>
      </div>
      {isSelected && (
        <div data-testid="tab-content" role="tabcontent">
          {children}
        </div>
      )}
    </div>
  );
};

// Add RadioGroup and Radio component mocks
export const RadioGroup = ({
  children,
  value,
  onValueChange,
  orientation,
  label,
  "aria-label": ariaLabel,
  className,
}: any) => (
  <div
    aria-label={ariaLabel}
    className={className}
    data-orientation={orientation}
    data-value={value}
    role="radiogroup"
  >
    <div className="radio-label">{label}</div>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { groupValue: value, onChange: onValueChange }),
    )}
  </div>
);

export const Radio = ({ value, groupValue, onChange, children }: any) => (
  <button
    aria-checked={value === groupValue}
    name={children}
    role="radio"
    value={value}
    onClick={() => onChange(value)}
  >
    {children}
  </button>
);

// Update Card components with proper exports and accessibility
interface CardProps extends BaseProps {
  onPress?: () => void;
  isPressable?: boolean;
}

export const Card = ({
  children,
  onPress,
  isPressable,
  ...props
}: CardProps) => (
  <div
    data-testid="card"
    role={isPressable ? "button" : undefined}
    tabIndex={isPressable ? 0 : undefined}
    onClick={onPress}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onPress?.();
      }
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, ...props }: BaseProps) => (
  <div data-testid="card-header" {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, ...props }: BaseProps) => (
  <div data-testid="card-body" {...props}>
    {children}
  </div>
);

interface ChipProps extends BaseProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "solid";
}

export const Chip = ({
  children,
  className,
  color,
  size,
  variant,
  ...props
}: ChipProps) => (
  <span
    className={className}
    data-color={color}
    data-size={size}
    data-variant={variant}
    {...props}
  >
    {children}
  </span>
);

// Add Select & SelectItem components
interface SelectProps extends BaseProps {
  "aria-label"?: string;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: { currentKey: string }) => void;
  labelPlacement?: string;
  placeholder?: string;
  variant?: string;
  classNames?: {
    trigger?: string;
    label?: string;
    popoverContent?: string;
  };
  renderValue?: (selected: Set<any>) => React.ReactNode;
  label?: string | React.ReactNode;
}

export const Select = ({
  children,
  "aria-label": ariaLabel,
  selectedKeys,
  onSelectionChange,
  labelPlacement,
  placeholder,
  label,
  variant,
  classNames, // Keep but use
  renderValue, // Keep but use
  ...props
}: SelectProps) => {
  // Use classNames and renderValue props
  const containerClasses = [
    classNames?.trigger,
    classNames?.label,
    classNames?.popoverContent,
  ]
    .filter(Boolean)
    .join(" ");

  const selectedValue = Array.from(selectedKeys || [])[0];
  const displayValue = renderValue
    ? renderValue(selectedKeys || new Set())
    : selectedValue;

  // Modify to properly handle rendering
  const getOptionLabel = (child: unknown): string | undefined => {
    if (React.isValidElement<SelectItemProps>(child)) {
      if (child.props.children && typeof child.props.children === "object") {
        return child.props.textValue || child.props.value;
      }

      return child.props.children as string;
    }

    return undefined;
  };

  return (
    <div
      aria-controls={`select-${ariaLabel}-popup`}
      aria-expanded="false"
      aria-label={ariaLabel}
      className={containerClasses}
      data-label-placement={labelPlacement}
      data-variant={variant}
      role="combobox"
      {...props}
    >
      {label && <label>{label}</label>}
      <div className="selected-value">{displayValue}</div>
      <select
        value={selectedValue}
        onChange={(e) => onSelectionChange?.({ currentKey: e.target.value })}
      >
        <option value="">{placeholder}</option>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<SelectItemProps>(child)) return null;
          const childProps = child.props;

          return React.cloneElement(
            child as React.ReactElement<SelectItemProps>,
            {
              ...childProps,
              children: getOptionLabel(child),
            },
          );
        })}
      </select>
    </div>
  );
};

interface SelectItemProps extends BaseProps {
  key?: string;
  value?: string;
  textValue?: string;
  classNames?: {
    base?: string;
  };
}

export const SelectItem = ({
  children,
  value,
  textValue,
  classNames: _classNames, // Prefix unused props with underscore
  ...props
}: SelectItemProps) => (
  <option value={value} {...props}>
    {typeof children === "object" ? textValue || value : children}
  </option>
);

// Add Textarea component
interface TextareaProps extends BaseProps {
  value?: string;
  onValueChange?: (value: string) => void;
  labelPlacement?: string;
  maxRows?: number;
  minRows?: number;
  variant?: string;
  classNames?: {
    input?: string;
    inputWrapper?: string;
  };
  placeholder?: string;
}

export const Textarea = ({
  value,
  onValueChange,
  labelPlacement,
  maxRows, // Keep but use
  minRows,
  variant,
  classNames, // Keep but use
  placeholder,
  ...props
}: TextareaProps) => {
  // Use maxRows and classNames props
  const textareaStyles = {
    maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined,
  };

  const wrapperClasses = [classNames?.inputWrapper, classNames?.input]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={wrapperClasses}
      data-label-placement={labelPlacement}
      data-variant={variant}
    >
      <textarea
        placeholder={placeholder}
        rows={minRows}
        style={textareaStyles}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      />
    </div>
  );
};

// Add a test to satisfy Jest's requirement
describe("HeroUI Mocks", () => {
  it("exists", () => {
    expect(Button).toBeDefined();
  });
});
