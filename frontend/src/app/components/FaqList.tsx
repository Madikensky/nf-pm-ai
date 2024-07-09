import React from 'react';
import FaqItem, { FaqItemProps } from './FaqItem';

interface FaqListProps {
  faqItems: FaqItemProps[];
}

export default function FaqList({ faqItems }: FaqListProps) {
  return (
    <div>
      {faqItems.map((item, index) =>
        index === faqItems.length - 1 ? (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
            isLast={true}
          />
        ) : (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
            isLast={false}
          />
        )
      )}
    </div>
  );
}
