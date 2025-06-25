import React from 'react';
export interface Column<T> {
    key: keyof T | string;
    title: string;
    render?: (value: unknown, item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}
export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    onSort?: (key: keyof T | string, direction: 'asc' | 'desc') => void;
    sortKey?: keyof T | string;
    sortDirection?: 'asc' | 'desc';
    className?: string;
    rowClassName?: string | ((item: T) => string);
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}
export declare function Table<T>({ data, columns, loading, onSort, sortKey, sortDirection, className, rowClassName, onRowClick, emptyMessage, }: TableProps<T>): import("react/jsx-runtime").JSX.Element;
