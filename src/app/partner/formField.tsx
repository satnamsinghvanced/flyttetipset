import { ContactField } from '@/const/types';
import { getInputType } from '@/utils/getInputType';
import { Input, Textarea } from '@heroui/input';

const FormField = ({
    field,
    value,
    error,
    onChange,
    onBlur
}: {
    field: ContactField;
    value: string;
    error: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}) => {
    const commonProps = {
        id: field.name,
        value: value || '',
        onValueChange: onChange,
        onBlur,
        placeholder: field.placeholder,
        isRequired: field.required,
        isInvalid: !!error,
        errorMessage: error,
        label: (
            <>
                {field.label}
            </>
        ),
        labelPlacement: "outside" as const,
        className: "my-12 text-base font-semibold rounded-sm",
        classNames: {
            label: "text-sm font-medium text-secondary/80",
            input: "text-base",
            error: "text-red-500 text-sm mt-1"
        }
    };

    if (field.type === 'textarea') {
        return (
            <Textarea
                {...commonProps}
                minRows={3}
                className=' text-dark'
            />
        );
    }

    if (field.type === 'tel') {
        const handlePhoneInput = (inputValue: string) => {
            const digitsOnly = inputValue.replace(/[^0-9]/g, '');
            const limitedDigits = digitsOnly.slice(0, 8);
            onChange(limitedDigits);
        };

        return (
            <Input
                {...commonProps}
                value={value}
                onValueChange={handlePhoneInput}
                type={getInputType(field.type)}
                maxLength={8}
                startContent={
                    <span className="text-secondary/50 pr-2 select-none font-normal">+47</span>
                }
                className=' text-dark'
            />
        );
    }
    return (
        <Input
            {...commonProps}
            type={getInputType(field.type)}
            className=' text-dark'
        />
    );
};

export default FormField