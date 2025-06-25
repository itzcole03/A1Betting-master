import React from "react";
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "@mui/material";
import { safeOnClick } from "../../utils/clickHandlerUtils";

/**
 * Safe Button wrapper that ensures onClick is always a function
 */
export const SafeButton: React.FC<ButtonProps> = ({ onClick, ...props }) => {
  return <Button {...props} onClick={safeOnClick(onClick)} />;
};

/**
 * Safe IconButton wrapper that ensures onClick is always a function
 */
export const SafeIconButton: React.FC<IconButtonProps> = ({
  onClick,
  ...props
}) => {
  return <IconButton {...props} onClick={safeOnClick(onClick)} />;
};

// Export default as SafeButton for convenience
export default SafeButton;
