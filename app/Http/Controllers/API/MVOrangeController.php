<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Transaction;
use App\PhoneType;
use App\Http\Resources\Transaction as TransactionResource;
use App\Http\Resources\TransactionCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MVOrangeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $matchThese = [
            ['MVCurrencyFID', $request->currency]
        ];

        if(!$user->isAdmin()) {
            $close = ['MVUserFID', $user->UserID];
            array_push($matchThese, $close);
        }
        $from = $request->from;
        $to = $request->to;
        $transaction = Transaction::query()
            ->orderBy('CreatedDate', 'desc')
            ->where($matchThese)
            ->when($from || $to, function($query) use ($from, $to) {
                if ($from && $to)
                {
                    if ($from == $to)
                    {
                        $query->whereDate('MVDate', $from);
                    } else {
                        $query->whereRaw("MVDate >= ? AND MVDate <= ?", 
                                array($from, $to)
                            );
                    }
                } elseif ($from && !$to)
                {
                    $query->whereRaw("MVDate >= ?", 
                            array($from)
                        );
                } elseif (!$from && $to)
                {
                    $query->whereRaw("MVDate <= ?", 
                            array($to)
                        );
                }
            })
            ->when(!$from && !$to, function($query) {
                $query->whereDate('MVDate', Carbon::today());
            })
            ->with(['type'])
            ->get();
        return new TransactionCollection($transaction);
    }

    public function store(Request $request)
    {
        // if ($request->MVNumber[0] !== "0") {
        //     $request->MVNumber = "0" . $request->MVNumber;
        // }
        // dump($request->all());
        $transaction = Transaction::where('FakeID', $request->TransactionID)->first();
        if($transaction)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Duplicate Entry'
            ], 401);
        }
        $date = $request->MVDate . " " . date("H:i:s");
        $transaction = new Transaction;
        $transaction->FromBranchFID = Auth::user()->isAdmin() ? $request->CompanyFID : Auth::user()->CompanyFID;
        $transaction->MVNumber = $request->MVNumber;
        $transaction->MVAmount = $request->MVAmount;
        $transaction->MVCurrencyFID = $request->currency;
        $transaction->MVNotes = $request->MVNotes;
        $transaction->MVUserFID = $request->user()->UserID;
        $transaction->MVDate = $date;
        $transaction->USSDResponse = $request->USSDResponse;
        $transaction->Sent = $request->Sent;
        $transaction->FakeID = $request->TransactionID;
        $transaction->CreatedDate = \Carbon\Carbon::now()->toDateString();
        $transaction->save();
        $transaction->load(['type']);

        if(!!$request->Type){
            $phone = PhoneType::where('PhoneNumber', $request->MVNumber)->first();
            if ($phone === null) {
                PhoneType::create([
                    'PhoneNumber' => $request->MVNumber,
                    'Type' => $request->Type
                ] );
            }
            else{
                $phone->Type = $request->Type;
                $phone->save();
            }
        }
        

        if(!$transaction->TransactionID)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Error will creating'
            ], 401);
        }
        return new TransactionResource($transaction);
    }

    public function update(Request $request)
    {
        $transaction = Transaction::find($request->TransactionID);
        if(!$transaction)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Entry not found'
            ], 401);
        }
        if($transaction->Sent && !Auth::user()->isAdmin())
        {
            return response()->json([
                'status' => 'error',
                'message' => 'You can\'t update this has money is already transfered.'
            ], 401);
        }
        $transaction->FromBranchFID = $request->CompanyFID;
        $transaction->MVNumber = $request->MVNumber;
        $transaction->MVAmount = $request->MVAmount;
        $transaction->MVNotes = $request->MVNotes;
        $transaction->MVDate =  $request->MVDate;
        $transaction->USSDResponse =  $request->USSDResponse;
        $transaction->Sent =  $request->Sent;
        $transaction->UpdatedAt = \Carbon\Carbon::now()->toDateString();
        $saved = $transaction->save();

        if(!!$request->Type){
            $phone = PhoneType::where('PhoneNumber', $request->MVNumber)->first();
            if ($phone === null) {
                PhoneType::create([
                    'PhoneNumber' => $request->MVNumber,
                    'Type' => $request->Type
                ] );
            }
            else{
                $phone->Type = $request->Type;
                $phone->save();
            }
        }
        if(!$saved)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Error will saving'
            ], 401);
        }
        return new TransactionResource($transaction);
    }

    public function destroy($id)
    {
        $transaction = Transaction::find($id);
        $transaction->delete();
    }

    public function checkTransaction($id)
    {
        $transaction = Transaction::find($id);
        if ($transaction) {
            if($transaction->Sent) {
                return response()->json([
                    'message' => 'This transaction is already done'
                ], 401);
            } else {
                return response()->json([
                    'message' => 'not sent'
                ], 200);
            }
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Entry not found'
        ], 401);
    }
}
