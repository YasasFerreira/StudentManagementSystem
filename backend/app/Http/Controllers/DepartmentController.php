<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Department;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index()
    {
        return Department::with(['headTeacher'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:departments',
            'code' => 'required|string|uppercase|unique:departments|max:10',
            'description' => 'nullable|string',
            'head_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $department = Department::create($validated);
        return response()->json($department, 201);
    }

    public function show($id)
    {
        return Department::with(['headTeacher', 'students', 'teachers', 'courses'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        
        $validated = $request->validate([
            'name' => ['sometimes', Rule::unique('departments')->ignore($department->id)],
            'code' => ['sometimes', 'uppercase', Rule::unique('departments')->ignore($department->id)],
            'head_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $department->update($validated);
        return response()->json($department);
    }

    public function destroy($id)
    {
        Department::destroy($id);
        return response()->noContent();
    }
}
