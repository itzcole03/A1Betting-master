import React from 'react';
import { UserConstraints } from '@/types';
interface UserConstraintsFormProps {
    constraints: UserConstraints;
    onConstraintsChange: (field: keyof UserConstraints, value: unknown) => void;
}
export declare const UserConstraintsForm: React.FC<UserConstraintsFormProps>;
export {};
