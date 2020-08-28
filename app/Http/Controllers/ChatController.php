<?php

namespace App\Http\Controllers;

use App\Message;
use App\Subscription;
use App\Subscription_Per_User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use function PHPSTORM_META\type;

class ChatController extends Controller
{
    public function index() {
        return view('chat.index');
    }
    public function sendMessage(Request $request){
//
        $isMessagesLeft=$this->count();
        if($isMessagesLeft){
            $message = auth()->user()->messages()->create([
            'message' => $request->input('message'),
            'receiver'  => $request->input('receiver')
        ]);
            return $message;
        }else{
            return 'NO MESSAGES LEFT';
        }


    }
    public function update(Request $request){
//
        switch ($request->input('status')) {
            case 'error':
                $status=11;
                break;
            case 'success':
                $status=12;
                break;
        }
        $id=$request->input('id');
        Message::where('user_id',auth()->user()->id)->where('status',10)->where('id',$id)->update(['status'=>$status]);
        $messages=Message::where('user_id',auth()->user()->id)->get();
        // return response()->json($messages,200);
        return $messages;

    }
    public function count(){
        $usageOfMessages=Message::where('user_id',\auth()->id())->count();
        $counter=DB::table('subscription__per__users')->join('subscriptions','subscriptions.id','=','subscription__per__users.subscription_id')->where('subscription__per__users.user_id',auth()->id())->SUM('number_of_messages');
        $messagesLeft=$counter-$usageOfMessages;
        if($messagesLeft>0){
            return true;
        }else{
            return false;
        }
    }
}
