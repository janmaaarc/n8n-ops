import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children, action }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
};
