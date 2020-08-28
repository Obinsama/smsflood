<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subscription_Per_User extends Model
{
    protected $fillable = ['price','number_of_messages'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
