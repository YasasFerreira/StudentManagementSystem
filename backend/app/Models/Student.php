<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'student_id',
        'department_id',
        'enrollment_date',
        'date_of_birth',
        'phone',
        'address',
        'guardian_name',
        'guardian_phone',
        'status'
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->withPivot(['id', 'enrollment_date', 'status'])
                    ->withTimestamps();
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }
}
