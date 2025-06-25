import { jsx as _jsx } from "react/jsx-runtime";
import { Button, IconButton, } from "@mui/material";
import { safeOnClick } from "../../utils/clickHandlerUtils";
/**
 * Safe Button wrapper that ensures onClick is always a function
 */
export const SafeButton = ({ onClick, ...props }) => {
    return _jsx(Button, { ...props, onClick: safeOnClick(onClick) });
};
/**
 * Safe IconButton wrapper that ensures onClick is always a function
 */
export const SafeIconButton = ({ onClick, ...props }) => {
    return _jsx(IconButton, { ...props, onClick: safeOnClick(onClick) });
};
// Export default as SafeButton for convenience
export default SafeButton;
