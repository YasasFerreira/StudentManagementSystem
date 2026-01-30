<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'enrollment_id',
        'assignment_name',
        'marks_obtained',
        'total_marks',
        'grade',
        'remarks',
        'graded_date'
    ];

    protected $casts = [
        'graded_date' => 'date',
        'marks_obtained' => 'float',
        'total_marks' => 'float',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
