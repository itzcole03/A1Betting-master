type ValidationRule<T> = {
    validate: (value: T) => boolean;
    message: string;
};
type FieldRules<T> = {
    [K in keyof T]?: ValidationRule<T[K]>[];
};
type FormErrors<T> = {
    [K in keyof T]?: string;
};
interface UseFormOptions<T> {
    initialValues: T;
    validationRules?: FieldRules<T>;
    onSubmit?: (values: T) => void | Promise<void>;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
}
export declare const useForm: <T extends Record<string, any>>({ initialValues, validationRules, onSubmit, validateOnChange, validateOnBlur }: UseFormOptions<T>) => {
    values: T;
    errors: FormErrors<T>;
    touched: Record<keyof T, boolean>;
    isSubmitting: boolean;
    handleChange: (name: keyof T, value: T[keyof T]) => void;
    handleBlur: (name: keyof T) => void;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    reset: () => void;
    setFieldValue: (name: keyof T, value: T[keyof T]) => void;
    setFieldError: (name: keyof T, error: string) => void;
    validateField: (name: keyof T, value: T[keyof T]) => string | undefined;
    validateForm: () => FormErrors<T>;
};
export {};
