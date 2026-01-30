<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with(['user', 'department'])->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'student_id' => 'required|unique:students',
            'department_id' => 'required|exists:departments,id',
            'enrollment_date' => 'required|date',
            'date_of_birth' => 'required|date',
            'phone' => 'required',
            'address' => 'nullable',
            'guardian_name' => 'nullable',
            'guardian_phone' => 'nullable',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'student',
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'student_id' => $validated['student_id'],
                'department_id' => $validated['department_id'],
                'enrollment_date' => $validated['enrollment_date'],
                'date_of_birth' => $validated['date_of_birth'],
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_phone' => $validated['guardian_phone'] ?? null,
            ]);

            return response()->json($student->load(['user', 'department']), 201);
        });
    }

    public function show($id)
    {
        return Student::with(['user', 'department'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $user = $student->user;

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'department_id' => 'sometimes|exists:departments,id',
            'enrollment_date' => 'sometimes|date',
            'phone' => 'sometimes',
            'status' => 'sometimes|in:active,inactive,graduated',
        ]);

        DB::transaction(function () use ($student, $user, $validated) {
            if (isset($validated['name']) || isset($validated['email'])) {
                $user->update($validated);
            }
            $student->update($validated);
        });

        return response()->json($student->load(['user', 'department']));
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->user->delete(); // Also delete the user account
        // Student record deleted via cascade
        return response()->noContent();
    }

    public function courses($id)
    {
        $student = Student::findOrFail($id);
        return $student->courses;
    }

    public function grades($id)
    {
        $student = Student::findOrFail($id);
        return $student->enrollments()->with(['course', 'grades'])->get();
    }

    public function attendance($id)
    {
        $student = Student::findOrFail($id);
        return $student->attendance()->with('course')->get();
    }
}
