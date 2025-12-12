"use client";
import Heading from '@/components/global/heading';
import { AllFaqCategory } from '@/const/types';
import { Accordion, AccordionItem } from '@heroui/react';

const AllFaqs = ({ faqData }: { faqData: AllFaqCategory[] }) => {
    
    return (
        <div>
            {faqData?.map((category, index) => (
                <div key={index}>
                    <Heading className=' !text-[32px] lg:!text-[48px] font-semibold leading-10 lg:leading-18 lg:!mb-6' heading={category.title} />
                    <Accordion variant="splitted" className="px-0 mx-0 mb-12">
                        {category?.faqData.map((faq, idx) => (
                            <AccordionItem
                                key={idx}
                                title={<span className="text-primary lg:text-2xl text-[20px] font-medium lg:font-semibold">{faq.question}</span>}
                                className="bg-primarylight my-2 shadow-none"
                            >
                                <div className="pb-2 text-secondary lg:text-base font-normal text-sm">{faq.answer}</div>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </div>
    );
};

export default AllFaqs;