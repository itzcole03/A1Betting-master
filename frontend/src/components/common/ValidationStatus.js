import { jsx as _jsx } from "react/jsx-runtime";
import { Tooltip, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
const getStatusConfig = (status) => {
    switch (status) {
        case 'valid':
            return {
                color: 'success',
                icon: _jsx(CheckCircleIcon, {}),
            };
        case 'invalid':
            return {
                color: 'error',
                icon: _jsx(ErrorIcon, {}),
            };
        case 'warning':
            return {
                color: 'warning',
                icon: _jsx(WarningIcon, {}),
            };
    }
};
export const ValidationStatus = ({ status, message, showIcon = true, }) => {
    const config = getStatusConfig(status);
    return (_jsx(Tooltip, { title: message, children: _jsx(Chip, { className: "transition-colors duration-300", color: config.color, icon: showIcon ? config.icon : undefined, label: message, size: "small", variant: "outlined" }) }));
};
