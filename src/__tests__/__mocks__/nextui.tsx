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
  ...props
}: ButtonProps) => {
  const pressHandlers = createPressHandlers(onPress);

  return (
    <button
      aria-label={ariaLabel}
      className={className}
      data-icon-only={isIconOnly}
      nonce={nonce}
      type="button"
      {...pressHandlers}
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

export const DropdownMenu = ({
  children,
  disabledKeys,
  "aria-label": ariaLabel,
  ...props
}: BaseProps & {
  disabledKeys?: string[];
  "aria-label"?: string;
}) => (
  <div
    aria-label={ariaLabel}
    data-disabled-keys={disabledKeys?.join(",")}
    role="menu"
    {...props}
  >
    {children}
  </div>
);

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

// Add a test to satisfy Jest's requirement
describe("NextUI Mocks", () => {
  it("exists", () => {
    expect(Button).toBeDefined();
  });
});
