<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Enrollment;

class EnrollmentController extends Controller
{
    public function index()
    {
        return Enrollment::with(['student.user', 'course'])->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:enrolled,completed,dropped',
        ]);

        $enrollment = Enrollment::create($validated);
        return response()->json($enrollment, 201);
    }

    public function show($id)
    {
        return Enrollment::with(['student', 'course', 'grades'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:enrolled,completed,dropped',
        ]);

        $enrollment->update($validated);
        return response()->json($enrollment);
    }

    public function destroy($id)
    {
        Enrollment::destroy($id);
        return response()->noContent();
    }
}
