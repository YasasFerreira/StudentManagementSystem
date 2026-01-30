<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a Department
        $department = \App\Models\Department::create([
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Department of Computer Science and Engineering',
        ]);

        // Create Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Teacher User & Profile
        $teacherUser = User::create([
            'name' => 'Dr. John Smith',
            'email' => 'teacher@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'teacher',
        ]);

        \App\Models\Teacher::create([
            'user_id' => $teacherUser->id,
            'teacher_id' => 'TCH001',
            'department_id' => $department->id,
            'qualification' => 'PhD in CS',
            'specialization' => 'AI & ML',
            'phone' => '1234567890',
            'hire_date' => now(),
            'status' => 'active',
        ]);

        // Create Student User & Profile
        $studentUser = User::create([
            'name' => 'Jane Doe',
            'email' => 'student@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'student',
        ]);

        \App\Models\Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'STU001',
            'department_id' => $department->id,
            'enrollment_date' => now(),
            'date_of_birth' => '2000-01-01',
            'phone' => '0987654321',
            'status' => 'active',
        ]);
    }
}
