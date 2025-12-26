
import { FormErrors, FormValues, UseContactFormProps } from '@/const/types';
import { isFormValid, validateField, validateForm } from '@/utils/validation';
import { useCallback, useState } from 'react';



export const useContactForm = ({ fields, onSubmit }: UseContactFormProps) => {
    const [formData, setFormData] = useState<FormValues>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((fieldName: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Validate field when user is typing and field has been touched
        if (touched.has(fieldName)) {
            const field = fields.find(f => f.name === fieldName);
            if (field) {
                const error = validateField(value, field);
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: error
                }));
            }
        }
    }, [fields, touched]);

    const handleBlur = useCallback((fieldName: string) => {
        setTouched(prev => new Set(prev).add(fieldName));

        const field = fields.find(f => f.name === fieldName);
        if (field) {
            const error = validateField(formData[fieldName] || '', field);
            setErrors(prev => ({
                ...prev,
                [fieldName]: error
            }));
        }
    }, [fields, formData]);

    const handleSubmit = useCallback(async () => {
        // Mark all fields as touched
        const allTouched = new Set(fields?.map(field => field.name));
        setTouched(allTouched);

        // Validate all fields
        const newErrors = validateForm(formData, fields);
        setErrors(newErrors);

        if (isFormValid(newErrors)) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [formData, fields, onSubmit]);

    const resetForm = useCallback(() => {
        setFormData({});
        setErrors({});
        setTouched(new Set());
        setIsSubmitting(false);
    }, []);

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm
    };
};