import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children, action }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
};
