import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../utils/classNames';
export function Table({ data, columns, loading = false, onSort, sortKey, sortDirection, className, rowClassName, onRowClick, emptyMessage = 'No data available', }) {
    const handleSort = (key) => {
        if (!onSort || !columns.find(col => col.key === key)?.sortable)
            return;
        const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(key, newDirection);
    };
    const renderSortIcon = (key) => {
        if (!columns.find(col => col.key === key)?.sortable)
            return null;
        return (_jsxs("span", { className: "ml-2 inline-flex flex-col", children: [_jsx("svg", { className: cn('w-2 h-2 -mb-0.5', sortKey === key && sortDirection === 'asc' ? 'text-primary-500' : 'text-gray-400'), fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 5l8 8H4z" }) }), _jsx("svg", { className: cn('w-2 h-2', sortKey === key && sortDirection === 'desc' ? 'text-primary-500' : 'text-gray-400'), fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 19l-8-8h16z" }) })] }));
    };
    if (loading) {
        return (_jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded" }), [...Array(5)].map((_, i) => (_jsx("div", { className: "h-16 bg-gray-200 dark:bg-gray-700 rounded" }, i)))] }));
    }
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: cn('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className), children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: _jsx("tr", { children: columns.map(column => (_jsx("th", { className: cn('px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap', column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200'), scope: "col", style: column.width ? { width: column.width } : undefined, onClick: () => handleSort(column.key), children: _jsxs("span", { className: "flex items-center", children: [column.title, renderSortIcon(column.key)] }) }, column.key.toString()))) }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800", children: data.length === 0 ? (_jsx("tr", { children: _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center", colSpan: columns.length, children: emptyMessage }) })) : (data.map((item, index) => (_jsx("tr", { className: cn('transition-colors hover:bg-gray-50 dark:hover:bg-gray-800', typeof rowClassName === 'function' ? rowClassName(item) : rowClassName, onRowClick && 'cursor-pointer'), onClick: () => onRowClick?.(item), children: columns.map(column => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: column.render ? column.render(typeof column.key === 'string'
                                ? item[column.key]
                                : item[column.key], item)
                                : typeof column.key === 'string'
                                    ? item[column.key]
                                    : item[column.key] }, column.key.toString()))) }, index)))) })] }) }));
}
