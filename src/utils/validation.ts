import { ContactField, FormErrors, FormValues } from "@/const/types";

export const validateField = (value: string, field: ContactField): string => {
    if (field.required && (!value || value.trim() === '')) {
        return `${field.label} Er påkrevd`;
    }

    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                return 'Vennligst skriv inn en gyldig e-postadresse.';
            }
            break;

        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (value && !phoneRegex.test(value)) {
                return 'Vennligst skriv inn et gyldig telefonnummer.';
            }
            break;

        case 'number':
            if (value && isNaN(Number(value))) {
                return 'Vennligst skriv inn et gyldig nummer.';
            }
            break;

        default:
            break;
    }
    return '';
};

export const validateForm = (formData: FormValues, fields: ContactField[]): FormErrors => {
    const errors: FormErrors = {};

    fields.forEach(field => {
        const error = validateField(formData[field.name] || '', field);
        if (error) {
            errors[field.name] = error;
        }
    });
    return errors;
};

export const isFormValid = (errors: FormErrors): boolean => {
    return Object.keys(errors).length === 0;
};