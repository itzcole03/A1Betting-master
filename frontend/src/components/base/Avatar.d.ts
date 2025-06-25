import React from 'react';
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
    shape?: 'circle' | 'square';
    fallback?: string;
    bordered?: boolean;
    className?: string;
}
export declare const Avatar: React.FC<AvatarProps>;
export declare const AvatarGroup: React.FC<{
    avatars: AvatarProps[];
    max?: number;
    size?: AvatarProps['size'];
    className?: string;
}>;
