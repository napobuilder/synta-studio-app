import React from 'react';
import { alohaCourses } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { GraduationCap } from 'lucide-react';

export const AlohaAcademyView: React.FC = () => (
    <div className="p-6 md:p-10 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto">
            <GraduationCap className="w-16 h-16 mx-auto text-purple-600 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Lleva tu Estrategia al Siguiente Nivel</h1>
            <p className="text-gray-500 text-lg mx-auto mb-12">Synta Lab te da las herramientas. Aloha Academy te enseña a dominarlas. Estos son nuestros programas de formación completos para que construyas tu propio ecosistema de ventas de principio a fin.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {alohaCourses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
    </div>
);