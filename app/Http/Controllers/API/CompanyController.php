<?php

namespace App\Http\Controllers\API;

use App\Company;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Company as CompanyResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function index()
    {
        if(Auth::user()->isAdmin()) {
            $companies = Company::orderBy('CompanyName', 'asc')->get();
            return CompanyResource::collection($companies); 
        }

        $companies = Company::where('CompanyID', Auth::user()->CompanyFID)->orderBy('CompanyName', 'asc')->get();
        return CompanyResource::collection($companies);
    }
    public function store(Request $request)
    {
        // Validation des données entrantes
        $validatedData = Validator::make($request->all(), [
            'CompanyCode' => 'required',
            'CompanyName' => 'required',
            'Notes' => 'nullable',
            'EmailCompany' => 'required|',
        ]);

        // Vérification si la validation échoue
        if ($validatedData->fails()) {
            return response()->json([
                'status' => 401,
                'message' => 'Echec d\'enregistrement',
                'errors' => $validatedData->errors()
            ]); 
        }

        // Création de la nouvelle compagnie
        $company = Company::create([
            'CompanyCode' => $request->CompanyCode,
            'CompanyName' => $request->CompanyName,
            'Notes' => $request->Notes,
            'EmailCompany' => $request->EmailCompany,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Enregistrement réussi',
            'company' => $company
        ]);
    }
    public function destroy(string $id){
        $company=Company::find($id);
        $company->delete();
        return response()->json([
            'status'=>201,
            'message'=>'Suppression reussie'
        ]);
    }
}
