import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, Shield, Key, Edit3, Save, X, Camera, Mail, Phone, MapPin, Calendar, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
export const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Alex Chen",
        email: "alex.chen@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        joinDate: "January 2023",
        tier: "Pro",
        verified: true,
        twoFactorEnabled: true,
        bio: "Professional sports bettor and analytics enthusiast. Focused on data-driven betting strategies and machine learning applications in sports prediction.",
    });
    const [editedProfile, setEditedProfile] = useState(profile);
    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };
    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };
    const handleAvatarUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (isEditing) {
                    setEditedProfile((prev) => ({ ...prev, avatar: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "\uD83D\uDC64 Account & Profile" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Manage your personal information and account preferences" })] }), _jsx(Card, { className: "glass-card", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center gap-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden", children: (isEditing ? editedProfile.avatar : profile.avatar) ? (_jsx("img", { src: isEditing ? editedProfile.avatar : profile.avatar, alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx(User, { size: 32, className: "text-white" })) }), isEditing && (_jsxs("label", { className: "absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors", children: [_jsx(Camera, { size: 16, className: "text-white" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleAvatarUpload, className: "hidden" })] }))] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 dark:text-white", children: isEditing ? (_jsx("input", { type: "text", value: editedProfile.name, onChange: (e) => setEditedProfile((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    })), className: "bg-transparent border-b-2 border-blue-500 outline-none" })) : (profile.name) }), _jsx(Badge, { variant: profile.verified ? "success" : "secondary", children: profile.verified ? "Verified" : "Unverified" }), _jsx(Badge, { variant: "primary", children: profile.tier })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4", children: [_jsx(Calendar, { size: 16 }), _jsxs("span", { children: ["Member since ", profile.joinDate] })] }), isEditing ? (_jsx("textarea", { value: editedProfile.bio, onChange: (e) => setEditedProfile((prev) => ({
                                            ...prev,
                                            bio: e.target.value,
                                        })), className: "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-none", rows: 3, placeholder: "Tell us about yourself..." })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-400", children: profile.bio }))] }), _jsx("div", { className: "flex gap-2", children: isEditing ? (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: handleSave, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2", children: [_jsx(Save, { size: 16 }), "Save"] }), _jsxs("button", { onClick: handleCancel, className: "px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2", children: [_jsx(X, { size: 16 }), "Cancel"] })] })) : (_jsxs("button", { onClick: () => setIsEditing(true), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: [_jsx(Edit3, { size: 16 }), "Edit Profile"] })) })] }) }) }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-5 h-5 text-blue-500" }), "Contact Information"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Email Address" }), isEditing ? (_jsx("input", { type: "email", value: editedProfile.email, onChange: (e) => setEditedProfile((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            })), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { size: 16, className: "text-gray-400" }), _jsx("span", { children: profile.email }), profile.verified && (_jsx(Badge, { variant: "success", children: "Verified" }))] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Phone Number" }), isEditing ? (_jsx("input", { type: "tel", value: editedProfile.phone || "", onChange: (e) => setEditedProfile((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            })), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { size: 16, className: "text-gray-400" }), _jsx("span", { children: profile.phone || "Not provided" })] }))] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Location" }), isEditing ? (_jsx("input", { type: "text", value: editedProfile.location || "", onChange: (e) => setEditedProfile((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            })), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { size: 16, className: "text-gray-400" }), _jsx("span", { children: profile.location || "Not provided" })] }))] })] }) })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-green-500" }), "Security Settings"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Key, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-green-800 dark:text-green-200", children: "Two-Factor Authentication" }), _jsx("div", { className: "text-sm text-green-600 dark:text-green-400", children: "Extra security for your account" })] })] }), _jsx(Badge, { variant: profile.twoFactorEnabled ? "success" : "secondary", children: profile.twoFactorEnabled ? "Enabled" : "Disabled" })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("button", { className: "w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", children: [_jsx("div", { className: "font-medium", children: "Change Password" }), _jsx("div", { className: "text-sm text-gray-500", children: "Update your account password" })] }), _jsxs("button", { className: "w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", children: [_jsx("div", { className: "font-medium", children: "Login Sessions" }), _jsx("div", { className: "text-sm text-gray-500", children: "Manage your active sessions" })] })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Settings, { className: "w-5 h-5 text-orange-500" }), "Account Actions"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("button", { className: "px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Export Account Data" }), _jsx("button", { className: "px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Download Activity Report" })] }), _jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("button", { className: "px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "Delete Account" }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Permanently delete your account and all associated data. This action cannot be undone." })] })] })] })] }));
};
export default ProfilePage;
