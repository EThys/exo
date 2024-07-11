<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\SMS;
use Carbon\Carbon;

class SMSController extends Controller
{
    public function post(Request $request)
    {
        $data = collect($request->all())->map(function ($item) {
            return [
                'Number' => $item['number'],
                'Text' => $item['text'],
                'Time' => Carbon::parse($item['time'])
            ];
        });
        $ok = SMS::insert($data->toArray());
        if($ok) {
            return response()->json([
                'status' => 'success',
                'message' => 'Saved'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Error will creating'
            ], 401);
        }
    }
}
