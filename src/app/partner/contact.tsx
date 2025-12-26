"use client"

import Button from '@/components/global/button';
import Description from '@/components/global/description';
import Heading from '@/components/global/heading';
import { ContactFormProps } from '@/const/types';
import { useContactForm } from '@/hooks/useContactForm';
import { saveContactUs } from '@/services/page/contact-service';
import { renderBoldBeforeColon } from '@/utils/renderBoldBeforeColon';
import { useState } from 'react';
import { IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import FormField from './formField';

const ContactForm = ({ data }: ContactFormProps) => {
    const [submitStatus, setSubmitStatus] = useState<'fail' | 'success' | 'error'>('fail');
    const [message, setMessage] = useState('');
    const [isShowModel, setIsShowModel] = useState(false)

    const handleFormSubmit = async (formData: Record<string, string>) => {
        try {
            const res = await saveContactUs(formData);
            setSubmitStatus('success');
            setMessage(res.message || 'Form submitted successfully!');
            setIsShowModel(true);
            resetForm();
            setTimeout(() => {
                setIsShowModel(false);
                setSubmitStatus('fail');
            }, 10000);
        } catch (error: any) {
            setSubmitStatus('error');
            setMessage(error?.message || 'Form submission failed.');
            setIsShowModel(true);
            setTimeout(() => {
                setIsShowModel(false);
                setSubmitStatus('fail');
            }, 10000);
        }
    };

    const hideMessageBox = () => {
        setIsShowModel(false);
    };

    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm
    } = useContactForm({
        fields: data.contactFields ?? [],
        onSubmit: handleFormSubmit
    });

    return (
        <div className="w-full bg-accent  text-dark">
            <div className="max-w-7xl mx-auto flex md:gap-20 gap-1 py-10 lg:py-12 px-4 md:px-6 lg:px-8 md:flex-row flex-col">
                <div className="full">
                    <Heading
                        heading={data?.heading ?? ''}
                        className="md:mb-12 mb-4 mt-0 text-[64px] font-semibold w-full max-lg:!text-[36px] leading-10 lg:leading-14"
                    />
                    <Description description={data?.subHeading ?? ''} />
                </div>
                <div className="w-full max-w-lg">
                    <div id="contact" className="absolute top-0 left-[50%] w-0 h-0" />
                    <div className="max-w-lg mx-auto p-6 bg-background rounded-lg shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold lg:text-center mb-6">
                            {data.contactFormTitle}
                        </h2>
                        <div className="space-y-6 ">
                            {data.contactFields && data.contactFields?.map((field) => (
                                <div key={field._id} className="my-10  text-dark">
                                    <FormField
                                        field={field}
                                        value={formData[field.name] || ''}
                                        error={errors[field.name] || ''}
                                        onChange={(value) => handleChange(field.name, value)}
                                        onBlur={() => handleBlur(field.name)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Button
                                color="primary"
                                className={`w-full py-2 rounded-md`}
                                onPress={handleSubmit}
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sender...' : data.buttonText}
                            </Button>
                        </div>
                        {isShowModel && (submitStatus === 'success' || submitStatus === 'error') && (
                            <div
                                className={`mt-4 py-3 px-3.5 border rounded-md text-sm text-center fixed top-2 right-0 w-fit m-5 max-w-[400px]   !z-[999] shadow-2xl inset-shadow-sm ${submitStatus === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                                    }`}
                            >
                                <button
                                    className={`absolute -right-2 -top-2 p-1 rounded-full border cursor-pointer ${submitStatus === 'success'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                        }`}
                                    onClick={hideMessageBox}
                                >
                                    <RxCross2 />
                                </button>
                                <div className='flex flex-row gap-2.5  items-center '>
                                    <p className='hidden md:block'>
                                        {submitStatus === 'success' ?
                                            <IoCheckmarkCircle className='text-green-800 w-6 h-6' />
                                            :
                                            <IoWarning className='text-red-800 w-6 h-6' />
                                        }
                                    </p>
                                    <p className=' text-start  text-sm'>{message} </p>
                                </div>
                            </div>
                        )}
                        <p
                            className="text-center text-sm text-primary/90 mt-4"
                            dangerouslySetInnerHTML={{ __html: renderBoldBeforeColon(data.formText || '') }}
                        ></p>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ContactForm