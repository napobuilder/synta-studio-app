import React from 'react';

interface ViewContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ViewContainer: React.FC<ViewContainerProps> = ({ title, subtitle, children }) => (
  <div className="p-6 md:p-10 animate-fade-in">
    <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{title}</h1>
        {subtitle && <p className="text-lg text-gray-600 mb-6">{subtitle}</p>}
    </div>
    <div className="bg-white p-8 rounded-xl shadow-sm mt-6">{children}</div>
  </div>
);