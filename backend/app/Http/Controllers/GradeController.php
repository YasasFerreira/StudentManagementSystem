<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Grade;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = Grade::with(['enrollment.student.user', 'enrollment.course']);

        if ($request->has('student_id')) {
            $query->whereHas('enrollment', function ($q) use ($request) {
                $q->where('student_id', $request->student_id);
            });
        }

        if ($request->has('course_id')) {
            $query->whereHas('enrollment', function ($q) use ($request) {
                $q->where('course_id', $request->course_id);
            });
        }

        return $query->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'assignment_name' => 'required|string',
            'marks_obtained' => 'required|numeric|min:0',
            'total_marks' => 'required|numeric|min:0',
            'grade' => 'nullable|string',
            'remarks' => 'nullable|string',
            'graded_date' => 'required|date',
        ]);

        $grade = Grade::create($validated);
        return response()->json($grade->load('enrollment.student.user'), 201);
    }

    public function show($id)
    {
        return Grade::with(['enrollment.student.user', 'enrollment.course'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $grade = Grade::findOrFail($id);
        
        $validated = $request->validate([
            'assignment_name' => 'sometimes|string',
            'marks_obtained' => 'sometimes|numeric|min:0',
            'total_marks' => 'sometimes|numeric|min:0',
            'grade' => 'nullable|string',
            'remarks' => 'nullable|string',
            'graded_date' => 'sometimes|date',
        ]);

        $grade->update($validated);
        return response()->json($grade);
    }

    public function destroy($id)
    {
        Grade::destroy($id);
        return response()->noContent();
    }
}
