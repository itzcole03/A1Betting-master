import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, Chip, TextField, MenuItem, Grid, Paper, CircularProgress, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { riskManagement } from '@/services/riskManagement';
const HistoryCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));
const headCells = [
    { id: 'timestamp', label: 'Date', numeric: false },
    { id: 'type', label: 'Type', numeric: false },
    { id: 'recommendationId', label: 'Recommendation', numeric: false },
    { id: 'odds', label: 'Odds', numeric: true },
    { id: 'amount', label: 'Amount', numeric: true },
    { id: 'payout', label: 'Payout', numeric: true },
    { id: 'status', label: 'Status', numeric: false },
];
const filterOptions = {
    type: ['Single', 'Parlay', 'Teaser', 'Prop'],
    status: ['pending', 'won', 'lost'],
};
export const BettingHistory = () => {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('timestamp');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
    });
    useEffect(() => {
        const loadBets = async () => {
            setLoading(true);
            try {
                const userBets = riskManagement.getBets();
                setBets(userBets);
            }
            catch (error) {
                console.error('Error loading bets:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadBets();
    }, []);
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'won':
                return 'success';
            case 'lost':
                return 'error';
            default:
                return 'default';
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };
    const filteredBets = bets.filter(bet => {
        return ((filters.type === '' || bet.type === filters.type) &&
            (filters.status === '' || bet.status === filters.status));
    });
    const sortedBets = filteredBets.sort((a, b) => {
        const isAsc = order === 'asc';
        if (orderBy === 'timestamp') {
            return isAsc
                ? a.timestamp - b.timestamp
                : b.timestamp - a.timestamp;
        }
        if (orderBy === 'odds' || orderBy === 'amount' || orderBy === 'payout') {
            return isAsc
                ? (a[orderBy] || 0) - (b[orderBy] || 0)
                : (b[orderBy] || 0) - (a[orderBy] || 0);
        }
        return isAsc
            ? String(a[orderBy]).localeCompare(String(b[orderBy]))
            : String(b[orderBy]).localeCompare(String(a[orderBy]));
    });
    const paginatedBets = sortedBets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const winRate = filteredBets.length > 0
        ? (filteredBets.filter(bet => bet.status === 'won').length / filteredBets.length) * 100
        : 0;
    const totalAmount = filteredBets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalPayout = filteredBets.reduce((sum, bet) => sum + (bet.payout || 0), 0);
    return (_jsx(Box, { sx: { width: '100%' }, children: _jsx(HistoryCard, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Betting History" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(TextField, { select: true, fullWidth: true, label: "Bet Type", value: filters.type, onChange: (e) => handleFilterChange('type', e.target.value), children: [_jsx(MenuItem, { value: "", children: "All" }), filterOptions.type.map((type) => (_jsx(MenuItem, { value: type, children: type }, type)))] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(TextField, { select: true, fullWidth: true, label: "Status", value: filters.status, onChange: (e) => handleFilterChange('status', e.target.value), children: [_jsx(MenuItem, { value: "", children: "All" }), filterOptions.status.map((status) => (_jsx(MenuItem, { value: status, children: status.charAt(0).toUpperCase() + status.slice(1) }, status)))] }) })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 0, sx: { p: 2, bgcolor: 'background.default' }, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Total Bets" }), _jsx(Typography, { variant: "h6", children: filteredBets.length })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 0, sx: { p: 2, bgcolor: 'background.default' }, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Win Rate" }), _jsxs(Typography, { variant: "h6", children: [winRate.toFixed(1), "%"] })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 0, sx: { p: 2, bgcolor: 'background.default' }, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Total Amount" }), _jsx(Typography, { variant: "h6", children: formatCurrency(totalAmount) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 0, sx: { p: 2, bgcolor: 'background.default' }, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Total Payout" }), _jsx(Typography, { variant: "h6", children: formatCurrency(totalPayout) })] }) })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsx(TableRow, { children: headCells.map((headCell) => (_jsx(TableCell, { align: headCell.numeric ? 'right' : 'left', sortDirection: orderBy === headCell.id ? order : false, children: _jsx(TableSortLabel, { active: orderBy === headCell.id, direction: orderBy === headCell.id ? order : 'asc', onClick: () => handleRequestSort(headCell.id), children: headCell.label }) }, headCell.id))) }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: headCells.length, align: "center", children: _jsx(CircularProgress, {}) }) })) : paginatedBets.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: headCells.length, align: "center", children: "No bets found" }) })) : (paginatedBets.map((bet) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: formatDate(bet.timestamp) }), _jsx(TableCell, { children: bet.type }), _jsx(TableCell, { children: bet.recommendationId }), _jsx(TableCell, { align: "right", children: bet.odds }), _jsx(TableCell, { align: "right", children: formatCurrency(bet.amount) }), _jsx(TableCell, { align: "right", children: bet.payout ? formatCurrency(bet.payout) : '-' }), _jsx(TableCell, { children: _jsx(Chip, { label: bet.status.charAt(0).toUpperCase() + bet.status.slice(1), color: getStatusColor(bet.status), size: "small" }) })] }, bet.id)))) })] }) }), _jsx(TablePagination, { rowsPerPageOptions: [5, 10, 25], component: "div", count: filteredBets.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }) }) }));
};
