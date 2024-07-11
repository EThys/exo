<?php

namespace App\Http\Controllers\API;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\User as UserResource;

class UserController extends Controller
{
    public function index()
    {
        $admin = Auth::user()->isAdmin();
        if($admin)
        {
            $users = User::with(['company'])->get();
            return UserResource::collection($users);
        }
    }

    public function store(Request $request)
    {
        $admin = Auth::user()->isAdmin();
        if($admin)
        {
            $user = new User;
            $user->UserName = $request->UserName;
            $user->Password = bcrypt($request->Password);
            $user->CompanyFID = $request->CompanyFID;
            $user->Admin = $request->Admin;
            $user->TwoFactorCode=1234;
            $saved = $user->save();
            if(!$saved)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error will creating'
                ], 401);
            }
            return new UserResource($user);
        }
    }

    public function update(Request $request)
    {
        $admin = Auth::user()->isAdmin();
        if($admin)
        {
            $user = User::find($request->UserID);
            if(!$user)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Entry not found'
                ], 401);
            }
            $user->UserName = $request->UserName;
            if($request->Password)
            {
                $user->Password = bcrypt($request->Password);
            }
            $user->CompanyFID = $request->CompanyFID;
            $user->Admin = $request->Admin;
            $saved = $user->save();
            if(!$saved)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error will saving'
                ], 401);
            }
            return new UserResource($user);
        }
    }

    public function destroy(User $user)
    {
        $admin = Auth::user()->isAdmin();
        if($admin)
        {
            $user->delete();
        }
    }
}
