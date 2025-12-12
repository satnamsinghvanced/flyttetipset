import { ContactField } from "@/const/types";

export const getInputType = (fieldType: ContactField['type']): string => {
    const typeMap: Record<ContactField['type'], string> = {
        text: 'text',
        email: 'email',
        tel: 'tel',
        number: 'number',
        textarea: 'text'
    };
    return typeMap[fieldType]
};

