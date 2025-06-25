import { jsx as _jsx } from "react/jsx-runtime";
import CyberSidebar from "./CyberSidebar";
// Adapter component to maintain backward compatibility
export const AdvancedSidebar = ({ currentSection, onSectionChange, isOpen, onClose, className, ...rest }) => {
    return (_jsx(CyberSidebar, { currentPage: currentSection, onPageChange: onSectionChange, isOpen: isOpen, onClose: onClose, className: className }));
};
export default AdvancedSidebar;
