"use client"
import { FAQSectionProps } from '@/const/types';
import { Accordion, AccordionItem } from "@heroui/react";

const FAQSection = ({
  title,
  faqs,
  backgroundColor = 'bg-primarylight',
  questionTextColor = ' ',
  answerTextColor = ' ',
  className = 'max-w-3xl w-full mx-auto px-2 md:px-6 lg:px-8 ',
}: FAQSectionProps) => {
  const containerClasses = "mx-auto w-full";
  const answerContentClasses = ` text-base ${answerTextColor}`;

  return (
    <div className={`py-0 sm:py-12 lg:py-20 ${backgroundColor}`}>
      <div className={className}>
        <div className='flex flex-col justify-center items-center text-center'>
          <h2 className="text-primary font-semibold leading-tight lg:text-5xl text-[36px] mb-8">
            {title}
          </h2>
          <div className={`text-primary ${containerClasses}`}>
            <Accordion variant="splitted" className='' >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  className='bg-primarylight my-1 shadow-none'
                  title={
                    <span className={`text-[20px] lg:text-[24px] font-medium ${questionTextColor}`}>{faq.question}</span>
                  }
                  aria-label={faq.question}
                >
                  <div className={`pb-2 text-[14px] lg:text-[16px] text-start ${answerContentClasses}`}>
                    {faq.answer}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;