import { useState, useCallback, useEffect } from 'react';
export const useForm = ({ initialValues, validationRules = {}, onSubmit, validateOnChange = false, validateOnBlur = true }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(() => {
        const touchedFields = {};
        Object.keys(initialValues).forEach((key) => {
            touchedFields[key] = false;
        });
        return touchedFields;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const validateField = useCallback((name, value) => {
        const fieldRules = validationRules[name];
        if (!fieldRules)
            return undefined;
        for (const rule of fieldRules) {
            if (!rule.validate(value)) {
                return rule.message;
            }
        }
        return undefined;
    }, [validationRules]);
    const validateForm = useCallback(() => {
        const newErrors = {};
        let hasErrors = false;
        Object.keys(values).forEach((key) => {
            const error = validateField(key, values[key]);
            if (error) {
                newErrors[key] = error;
                hasErrors = true;
            }
        });
        return hasErrors ? newErrors : {};
    }, [values, validateField]);
    const handleChange = useCallback((name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if (validateOnChange) {
            const error = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    }, [validateOnChange, validateField]);
    const handleBlur = useCallback((name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (validateOnBlur) {
            const error = validateField(name, values[name]);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    }, [validateOnBlur, validateField, values]);
    const handleSubmit = useCallback(async (e) => {
        if (e) {
            e.preventDefault();
        }
        const formErrors = validateForm();
        setErrors(formErrors);
        if (Object.keys(formErrors).length === 0 && onSubmit) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            }
            catch (error) {
                console.error('Form submission error:', error);
            }
            finally {
                setIsSubmitting(false);
            }
        }
    }, [validateForm, onSubmit, values]);
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched(Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    }, [initialValues]);
    const setFieldValue = useCallback((name, value) => {
        handleChange(name, value);
    }, [handleChange]);
    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({ ...prev, [name]: error }));
    }, []);
    useEffect(() => {
        return () => {
            setValues(initialValues);
            setErrors({});
            setTouched({});
        };
    }, [initialValues]);
    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setFieldValue,
        setFieldError,
        validateField,
        validateForm
    };
};
