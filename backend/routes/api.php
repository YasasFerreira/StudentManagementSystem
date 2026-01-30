<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // --- Admin Only Operations ---
    Route::middleware('role:admin')->group(function () {
        // Full access to manage backend structure
        Route::apiResource('departments', DepartmentController::class)->except(['index', 'show']);
        Route::apiResource('teachers', TeacherController::class)->except(['index', 'show']);
        Route::apiResource('courses', CourseController::class)->except(['index', 'show']);
    });

    // --- Teacher & Admin Operations ---
    Route::middleware('role:teacher,admin')->group(function () {
        // Manage Students
        Route::post('students', [StudentController::class, 'store']);
        Route::put('students/{student}', [StudentController::class, 'update']);
        Route::delete('students/{student}', [StudentController::class, 'destroy']);

        // Manage Grades
        Route::post('grades', [GradeController::class, 'store']);
        Route::put('grades/{grade}', [GradeController::class, 'update']);
        Route::delete('grades/{grade}', [GradeController::class, 'destroy']);

        // Manage Attendance
        Route::apiResource('attendance', AttendanceController::class)->except(['index', 'show']);
        
        // Enrollments
        Route::apiResource('enrollments', EnrollmentController::class)->except(['index', 'show']);
        Route::post('courses/{id}/enroll', [CourseController::class, 'enrollStudent']);
    });

    // --- Read-Only / Common Access (All Authenticated Users) ---
    // Students can view, but not modify.
    
    // Departments
    Route::get('departments', [DepartmentController::class, 'index']);
    Route::get('departments/{department}', [DepartmentController::class, 'show']);

    // Teachers
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::get('teachers/{teacher}', [TeacherController::class, 'show']);
    Route::get('teachers/{id}/courses', [TeacherController::class, 'courses']);

    // Courses
    Route::get('courses', [CourseController::class, 'index']);
    Route::get('courses/{course}', [CourseController::class, 'show']);
    Route::get('courses/{id}/students', [CourseController::class, 'students']); // Maybe sensitive, but needed for lists?

    // Students
    Route::get('students', [StudentController::class, 'index']);
    Route::get('students/{student}', [StudentController::class, 'show']);
    Route::get('students/{id}/courses', [StudentController::class, 'courses']);
    Route::get('students/{id}/grades', [StudentController::class, 'grades']);
    Route::get('students/{id}/attendance', [StudentController::class, 'attendance']);

    // Grades
    Route::get('grades', [GradeController::class, 'index']);
    Route::get('grades/{grade}', [GradeController::class, 'show']);

    // Attendance
    Route::get('attendance', [AttendanceController::class, 'index']);
    Route::get('attendance/{attendance}', [AttendanceController::class, 'show']);
    Route::get('attendance/report', [AttendanceController::class, 'report']);

    // Enrollments
    Route::get('enrollments', [EnrollmentController::class, 'index']);
    Route::get('enrollments/{enrollment}', [EnrollmentController::class, 'show']);
});
