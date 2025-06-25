import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Fab, Modal, Box, Typography, Rating, TextField, Button, Snackbar, Alert, } from '@mui/material';
import { Feedback as FeedbackIcon } from '@mui/icons-material';
import { useStorage } from '../hooks/useStorage';
export const FeedbackWidget = () => {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const { clearAllCaches } = useStorage();
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setRating(null);
        setComment('');
    };
    const handleSubmit = async () => {
        try {
            const feedback = {
                rating: rating || 0,
                comment,
                timestamp: Date.now(),
            };
            // Store feedback in localStorage
            const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
            existingFeedback.push(feedback);
            localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
            // Show success message
            setSnackbar({
                open: true,
                message: 'Thank you for your feedback!',
            });
            handleClose();
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to submit feedback. Please try again.',
            });
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Fab, { "aria-label": "feedback", color: "primary", sx: {
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                }, onClick: handleOpen, children: _jsx(FeedbackIcon, {}) }), _jsx(Modal, { "aria-labelledby": "feedback-modal", open: open, sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }, onClose: handleClose, children: _jsxs(Box, { sx: {
                        position: 'relative',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }, children: [_jsx(Typography, { gutterBottom: true, component: "h2", variant: "h6", children: "Share Your Feedback" }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { component: "legend", children: "How was your experience?" }), _jsx(Rating, { size: "large", value: rating, onChange: (_, newValue) => setRating(newValue) })] }), _jsx(TextField, { fullWidth: true, multiline: true, label: "Additional Comments", rows: 4, sx: { mb: 3 }, value: comment, onChange: e => setComment(e.target.value) }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'flex-end', gap: 2 }, children: [_jsx(Button, { onClick: handleClose, children: "Cancel" }), _jsx(Button, { disabled: !rating, variant: "contained", onClick: handleSubmit, children: "Submit" })] })] }) }), _jsx(Snackbar, { autoHideDuration: 6000, open: snackbar.open, onClose: () => setSnackbar({ ...snackbar, open: false }), children: _jsx(Alert, { severity: "success", sx: { width: '100%' }, onClose: () => setSnackbar({ ...snackbar, open: false }), children: snackbar.message }) })] }));
};
