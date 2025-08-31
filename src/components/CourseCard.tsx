import React from 'react';
import type { Course } from '../types';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden group">
        <div className="overflow-hidden">
            <img src={course.imageUrl} alt={course.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
            <p className="text-gray-500 text-sm mb-6 flex-grow">{course.description}</p>
            <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto bg-gray-800 text-white font-bold py-3 px-6 rounded-lg w-full text-center transition-colors hover:bg-gray-900 flex items-center justify-center gap-2"
            >
                Ver curso en Aloha Academy <ArrowRight className="w-4 h-4" />
            </a>
        </div>
    </div>
);
