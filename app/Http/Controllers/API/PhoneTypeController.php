<?php

namespace App\Http\Controllers\API;
use App\PhoneType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\User;

use App\Http\Resources\PhoneTypeCollection;

class PhoneTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $admin = Auth::user()->isAdmin();
            $phone_types = PhoneType::all();
            return PhoneTypeCollection::collection($phone_types);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    
   
    public function store(Request $request)
    {
        $admin = Auth::user()->isAdmin();
        if($admin)
        {
            $type = new PhoneType;
            $type->PhoneNumber = $request->PhoneNumber;
            $type->Type = $request->Type;
            $type->Note = $request->Note;
            $saved = $type->save();
            if(!$saved)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error will creating'
                ], 401);
            }
            return new PhoneTypeCollection($type);
        }
    }

    public function update(Request $request)
    {
        $admin = Auth::user()->isAdmin();
        if($admin)
        {
            $type = PhoneType::find($request->PhoneTypeID);
            if(!$type)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Entry not found'
                ], 401);
            }
            $type->PhoneNumber = $request->PhoneNumber;
            $type->Type = $request->Type;
            $type->Note = $request->Note;
            $saved = $type->save();
            if(!$saved)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error will saving'
                ], 401);
            }
            return new PhoneTypeCollection($type);
        }
    }

    public function destroy(string $id)
    {
        $phone_type = PhoneType::find($id);
        $phone_type->delete();
    }
    public function getTypeByNumber($number){
        $phone_type = PhoneType::where('PhoneNumber', $number)->first();
        return response()->json($phone_type);
        
    }
}
