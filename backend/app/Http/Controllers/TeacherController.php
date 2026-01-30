<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        return Teacher::with(['user', 'department'])->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'teacher_id' => 'required|unique:teachers',
            'department_id' => 'required|exists:departments,id',
            'qualification' => 'required|string',
            'specialization' => 'required|string',
            'hire_date' => 'required|date',
            'phone' => 'required',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'teacher',
            ]);

            $teacher = Teacher::create([
                'user_id' => $user->id,
                'teacher_id' => $validated['teacher_id'],
                'department_id' => $validated['department_id'],
                'qualification' => $validated['qualification'],
                'specialization' => $validated['specialization'],
                'hire_date' => $validated['hire_date'],
                'phone' => $validated['phone'],
            ]);

            return response()->json($teacher->load(['user', 'department']), 201);
        });
    }

    public function show($id)
    {
        return Teacher::with(['user', 'department'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);
        $user = $teacher->user;

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'department_id' => 'sometimes|exists:departments,id',
            'hire_date' => 'sometimes|date',
            'phone' => 'sometimes',
            'status' => 'sometimes|in:active,inactive',
        ]);

        DB::transaction(function () use ($teacher, $user, $validated) {
            if (isset($validated['name']) || isset($validated['email'])) {
                $user->update($validated);
            }
            $teacher->update($validated);
        });

        return response()->json($teacher->load(['user', 'department']));
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->user->delete();
        return response()->noContent();
    }

    public function courses($id)
    {
        $teacher = Teacher::findOrFail($id);
        return $teacher->courses;
    }
}
