<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Currency;
use App\Http\Resources\Currency as CurrencyResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CurrencyController extends Controller
{
    public function index()
    {
        $types = Currency::orderBy('Currency', 'asc')->get();
        return CurrencyResource::collection($types);
    }
    public function store(Request $request){
        $validatedData = Validator::make($request->all(), [
            'Currency' => 'required',
            'CurrencySymbol' => 'required',
            'Note' => 'nullable|string',
            'UserID' => 'required'
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'status' => 401,
                'message' => 'Echec d\'enregistrement',
                'errors' => $validatedData->errors()
            ]);
        };

        $currency = Currency::create([
            'Currency' => $request->Currency,
            'CurrencySymbol' => $request->CurrencySymbol,
            'Note' => $request->Note,
            'UserID' => $request->UserID,
            'SSMA_TimeStamp' => now() 
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Enregistrement reussie',
        ]);
    }
    public function destroy(string $id){
        $currency=Currency::find($id);
        $currency->delete();
        return response()->json([
            'status'=>201,
            'message'=>'Suppression reussie'
        ]);
    }
}
