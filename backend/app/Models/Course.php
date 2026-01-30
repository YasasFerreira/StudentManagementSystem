<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'course_code',
        'name',
        'description',
        'credits',
        'department_id',
        'teacher_id',
        'semester',
        'status'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->withPivot(['id', 'enrollment_date', 'status'])
                    ->withTimestamps();
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }
}
