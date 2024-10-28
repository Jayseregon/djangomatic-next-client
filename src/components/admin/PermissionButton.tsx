import { Button } from "@nextui-org/react";

import { CheckIcon, UncheckIcon } from "@/components/icons";

export interface PermissionSwitchProps {
  user: any;
  fieldName: string;
  borderType?: string;
  handleToggle: (id: string, field: string, value: boolean) => void;
  disabled?: boolean;
}

/**
 * PermissionButton component renders a button to toggle user permissions.
 * The button's color and icon change based on the user's current permission state.
 *
 * @param {Object} props - The props for the PermissionButton component.
 * @param {UserSchema} props.user - The user object containing permission data.
 * @param {string} props.fieldName - The name of the permission field to toggle.
 * @param {Function} props.handleToggle - The function to handle the toggle action.
 * @returns {JSX.Element} The rendered PermissionButton component.
 */
export const PermissionButton = ({
  user,
  fieldName,
  handleToggle,
  disabled = false,
}: PermissionSwitchProps): JSX.Element => {
  return (
    <Button
      isIconOnly
      className="ps-0.5 pt-0.5"
      color={user[fieldName] ? "success" : "danger"}
      disabled={disabled}
      radius="full"
      size="sm"
      variant="light"
      onClick={() => handleToggle(user.id, fieldName, !user[fieldName])}
    >
      {/* Render the appropriate icon based on the user's permission state */}
      {user[fieldName] ? <CheckIcon size={24} /> : <UncheckIcon size={24} />}
    </Button>
  );
};
