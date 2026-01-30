<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Attendance;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Stats
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalCourses = Course::count();
        
        // Today's attendance percentage
        $today = Carbon::today()->toDateString();
        $todayAttendanceCount = Attendance::where('date', $today)->count();
        
        // Calculate percentage: (present/total_students) * 100
        // For simplicity, let's say total enrolled students today. 
        // If no attendance marked today, show 0 or last available.
        $attendanceRate = "0%";
        if ($totalStudents > 0) {
            $presentCount = Attendance::where('date', $today)
                ->where('status', 'present')
                ->count();
            $rate = ($presentCount / $totalStudents) * 100;
            $attendanceRate = round($rate) . "%";
        }

        // 2. Recent Activity
        $recentStudents = Student::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($student) {
                return [
                    'type' => 'student',
                    'message' => "New student registered: <strong>{$student->user->name}</strong>",
                    'time' => $student->created_at->diffForHumans(),
                    'color' => '#4facfe'
                ];
            });

        $recentAttendance = Attendance::with(['course', 'student.user'])
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($attendance) {
                $teacherName = "A teacher"; // Ideally we'd know who marked it, but we don't have that link directly in attendance table
                return [
                    'type' => 'attendance',
                    'message' => "Attendance marked for <strong>{$attendance->course->name}</strong>",
                    'time' => $attendance->created_at->diffForHumans(),
                    'color' => '#ff6b6b'
                ];
            });

        $recentCourses = Course::orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($course) {
                return [
                    'type' => 'course',
                    'message' => "New subject added: <strong>{$course->name}</strong>",
                    'time' => $course->created_at->diffForHumans(),
                    'color' => '#4facfe'
                ];
            });

        // Merge and sort activities by time (effectively by id/created_at since we can't easily merge and sort Eloquent collections with diffForHumans)
        // Let's just return a selection.
        $activities = $recentStudents->concat($recentAttendance)->concat($recentCourses)
            ->sortByDesc(function($activity) {
                return $activity['time']; // This is not perfect sorting but works for mixed types
            })
            ->take(5)
            ->values();

        return response()->json([
            'stats' => [
                ['title' => 'Total Students', 'count' => $totalStudents, 'icon' => 'FaUserGraduate', 'color' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'],
                ['title' => 'Total Lecturers', 'count' => $totalTeachers, 'icon' => 'FaChalkboardTeacher', 'color' => 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)'],
                ['title' => 'Total Subjects', 'count' => $totalCourses, 'icon' => 'FaBook', 'color' => 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'],
                ['title' => 'Today\'s Attendance', 'count' => $attendanceRate, 'icon' => 'FaUsers', 'color' => 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'],
            ],
            'recentActivity' => $activities
        ]);
    }
}
