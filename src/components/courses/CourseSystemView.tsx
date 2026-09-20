import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Play, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import { fetchCourses, fetchCourseDetail } from '../../services/api';
import { Course, Lesson } from '../../../server/db';
import { MainNavView } from '../navigation/Navbar';

interface CourseSystemProps {
  setCurrentView: (view: MainNavView) => void;
}

export const CourseSystemView: React.FC<CourseSystemProps> = ({ setCurrentView }) => {
  const { currentChild } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCourse = async (course: Course) => {
    setSelectedCourse(course);
    const detail = await fetchCourseDetail(course.id);
    setLessons(detail.lessons || []);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Header in English */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Structured Speech Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Phonetic Articulation & Minimal Pair Courses
          </h1>
        </div>

        {selectedCourse && (
          <button
            onClick={() => setSelectedCourse(null)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 self-start transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </button>
        )}
      </div>

      {selectedCourse ? (
        /* Course Detail View */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {selectedCourse.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {selectedCourse.titleEnglish}
                </h2>
                <div className="text-sm font-semibold text-slate-500">
                  {selectedCourse.titleHindi}
                </div>
              </div>
              <span className="text-5xl">{selectedCourse.icon}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {selectedCourse.description}
            </p>

            {/* Progress bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Course Completion</span>
                <span className="text-emerald-700 font-bold">{selectedCourse.progressPercent || 50}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedCourse.progressPercent || 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Lesson Checklist</h3>
            <div className="grid grid-cols-1 gap-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 hover:border-emerald-400 transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        lesson.completed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {lesson.titleHindi} · <span className="text-slate-500 font-normal">{lesson.description}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Target Sound Repetitions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs text-amber-600 font-bold hidden sm:inline">
                      +{lesson.xpReward} XP
                    </span>
                    <button
                      onClick={() => setCurrentView('practice_arena')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-colors shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{lesson.completed ? 'Practice Again' : 'Start Lesson'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Courses Grid Catalog */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => openCourse(course)}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all space-y-4 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl group-hover:scale-110 transition-transform">{course.icon}</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {course.level} Level
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {course.titleEnglish}
                </h3>
                <div className="text-xs text-slate-500 font-medium">{course.titleHindi}</div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-semibold">{course.totalLessons} Lessons · {course.xpReward} XP</span>
                <span className="text-emerald-600 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
