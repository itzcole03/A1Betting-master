import React from 'react';
export interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
}
declare const Header: React.FC<HeaderProps>;
export default Header;
