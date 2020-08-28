@extends('layouts.app')
@section('content')
    <form class="col-md-4">
        <div class="form-group">
            <label for="exampleFormControlInput1">Phone Number</label>
            <input type="text" class="form-control receiver" name="tel" id="exampleFormControlInput1" placeholder="Phone No">
{{--            <p></p>--}}
        </div>
        <div class="form-group">
            <label for="exampleFormControlTextarea1">Message</label>
            <textarea class="form-control messagebox" name="msg" id="exampleFormControlTextarea1" rows="3"></textarea>
{{--            <p id="error"></p>--}}
        </div>
        <input id="send" class="btn btn-primary" type="submit" value="Send" >
    </form>
    <ul class="col-md-6 list-group col-md-offset-2 ">
        <h4>Message List</h4>
        <div class="messages">
        @foreach($messages as $message)
            @if($message->status==12)
                <li class="messageBody list-group-item-success">
                    <p>To : {{$message->receiver}}</p>
                    <p>Message : {{$message->message}}</p>
                </li>
            @else
                <li class="messageBody list-group-item-warning">
                    <p>To : {{$message->receiver}}</p>
                    <p>Message : {{$message->message}}</p>
                </li>
            @endif
        @endforeach
        </div>
    </ul>
@endsection
{{--<script src="{{ URL::asset('js/app.js') }}"></script>--}}
