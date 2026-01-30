<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with(['department', 'teacher.user'])->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_code' => 'required|unique:courses',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:6',
            'department_id' => 'required|exists:departments,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'semester' => 'required|integer|min:1|max:8',
        ]);

        $course = Course::create($validated);
        return response()->json($course->load(['department', 'teacher.user']), 201);
    }

    public function show($id)
    {
        return Course::with(['department', 'teacher.user'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'course_code' => ['sometimes', Rule::unique('courses')->ignore($course->id)],
            'name' => 'sometimes|string',
            'credits' => 'sometimes|integer',
            'department_id' => 'sometimes|exists:departments,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $course->update($validated);
        return response()->json($course->load(['department', 'teacher.user']));
    }

    public function destroy($id)
    {
        Course::destroy($id);
        return response()->noContent();
    }

    public function students($id)
    {
        $course = Course::findOrFail($id);
        return $course->students;
    }

    public function enrollStudent(Request $request, $id)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'enrollment_date' => 'required|date',
        ]);

        $enrollment = Enrollment::create([
            'course_id' => $id,
            'student_id' => $request->student_id,
            'enrollment_date' => $request->enrollment_date,
            'status' => 'enrolled',
        ]);

        return response()->json($enrollment, 201);
    }
}
