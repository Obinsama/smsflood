<?php

namespace App\Http\Controllers;

use App\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
   public function index(){
       return view('abonnement.index');
   }
    public function create(Request $request){
       DB::table('socket')->create([
           'price' => $request->input('message'),
           'number_of_messages'  => $request->input('receiver')]);
        return view('abonnement.index');
    }
}
