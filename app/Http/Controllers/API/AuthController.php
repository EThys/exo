<?php

namespace App\Http\Controllers\API;

use App\User;
use App\Token;
use Twilio\Rest\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private $apiToken;
    public function __construct()
    {
        // Unique Token
        $this->apiToken = uniqid(base64_encode(str_random(60)));
    }

    //Register

    public function register(Request $request){
        // Validation des données entrantes
        $validatedData = Validator::make($request->all(), [
            'CompanyFID' => 'required', 
            'UserName' => 'required',
            'Password' => 'required|min:6', 
            'Admin' => 'required', 
            'TwoFactorCode' => 'required|integer', 
            'Phone' => 'required|string', 
            'RememberToken' => 'nullable|string',
        ]);

        // Si la validation échoue, retourner les erreurs
        if ($validatedData->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Inscription échouée',
                'errors' => $validatedData->errors()
            ], 400);
        }

        // Création de l'utilisateur
        $SSMA_TimeStamp = now();
        $user = User::create([
            'CompanyFID' => $request->CompanyFID,
            'UserName' => $request->UserName,
            'Password' => bcrypt($request->Password),
            'Admin' => $request->Admin,
            'TwoFactorCode' => $request->TwoFactorCode,
            'Phone' => $request->Phone,
            'RememberToken' => $request->RememberToken,
            'SSMA_TimeStamp' => $SSMA_TimeStamp ,
        ]);

        // Retourner une réponse JSON avec un token d'API
        return response()->json([
            'status' => 200,
            'message' => 'Inscription réussie',
        
        ], 200);
    }

    //Login
    public function postLogin(Request $request)
    {
        $rules = [
            'UserName' => 'required',
            'Password' => 'required'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            // Validation failed
            return response()->json([
                'message' => 'Username and Password is required.',
            ], 401);
        } else {
            // Fetch User
            $user = User::where('UserName', $request->UserName)->with(['company'])->first();
            if ($user) {
                // Verify the password
                if (password_verify($request->Password, $user->Password)) {
                    $code = $this->generateTwoFactorCode();
            
                    $user->TwoFactorCode = 1234;
                    $user->save();

                    return response()->json([
                        'message' => 'One more step, Enter the code',
                        'id' => $user->UserID
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid Password',
                    ], 401);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                ], 401);
            }
        }
    }

    public function postverifyCode(Request $request)
    {
       
        $authUser = Auth::user();
         $request->validate([
            'Code' => 'required|integer',
            'UserID' => 'required|integer'
        ]);
         $user = User::where('TwoFactorCode', $request->Code)->where('UserID', $request->UserID)->first();


        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Code Invalide',
            ], 401);
        }

        // created token
        $token = new Token(['AccessToken' => $this->apiToken]);
        if ($user->tokens()->save($token)) {
            $user->TwoFactorCode = null;
            $user->save();
            return response()->json([
                'status' => 'success',
                'UserName'    => $user->UserName,
                'UserID'    => $user->UserID,
                'Admin'    => $user->Admin,
                'AccessToken' => $this->apiToken,
                'Company' => $user->company->CompanyName,
                'CompanyFID' => $user->company->CompanyID,
            ]);
        }
    }

    /**
   * Logout
   */
    public function postLogout(Request $request)
    {
        $tokenRequest = $request->bearerToken();
        $token = Token::where('AccessToken', $tokenRequest)->with('user')->first();
        // $user = $token->user;
        if ($token->delete()) {
            return response()->json([
                'status' => 'success',
                'message' => 'User Logged Out',
            ]);
        }
    }

    private function generateTwoFactorCode()
    {
        $n = rand(1000, 9999);

        if ($this->twoFactorCodeExist($n)) {
                return $this->generateTwoFactorCode();
            }

        return $n;
    }

    private function twoFactorCodeExist($n)
    {
        return User::where('TwoFactorCode', $n)->exists();
    }

    public function sendViaTwillo($to, $message)
    {
        $accountSid = config('services.twillo')['TWILIO_ACCOUNT_SID'];
        $authToken = config('services.twillo')['TWILIO_AUTH_TOKEN'];
        $twilioNumber = config('services.twillo')['TWILIO_APP_SID'];

        $client = new Client($accountSid, $authToken);
        try {
            // Use the client to do fun stuff like send text messages!
            $client->messages->create(
                // the number you'd like to send the message to
                "+$to",
                array(
                    // A Twilio phone number you purchased at twilio.com/console
                    'from' => $twilioNumber,
                    // the body of the text message you'd like to send
                    'body' => $message
                )
            );
            return true;
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return false;
        }
    }
}
