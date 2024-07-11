<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;
// use function GuzzleHttp\json_decode;
use Illuminate\Support\Facades\File;
// use function GuzzleHttp\json_encode;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OrangeSMS
{
    private $host = 'https://api.orange.com/oauth/v2/token';
    private $authorization;
    private $tokenFile = 'app/orange.json';
    private $sendSmsUrl;
    private $sender;

    public function __construct()
    {
        $this->authorization = Config::get('orange.authorization');
        $this->sender = Config::get('orange.phone');
        $this->sendSmsUrl = "https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B$this->sender/requests";
    }

    public function authData()
    {
        $body = null;
        if (!File::exists(storage_path($this->tokenFile)))
        {
            $body = $this->connect();
            return json_decode($body);
        } else {
            $body = json_decode(File::get(storage_path($this->tokenFile)));
            $date = Carbon::parse($body->date);
            $date->addSeconds($body->expires_in);
            if($date <= Carbon::now())
            {
                $body = $this->connect();
                return json_decode($body);
            }
            return $body;
        }
    }

    private function connect()
    {
        try {
            $client = new \GuzzleHttp\Client();
            $res = $client->post($this->host, [
                'form_params' => [
                    'grant_type' => 'client_credentials'
                ],
                'headers' => [
                    'Authorization' => $this->authorization,
                    'Accept' => 'application/json',
                ]
            ]);
            if(!$res->getStatusCode() === 200)
            {
                Log::error('Error will requesting Access Token');
            }
            $body = $res->getBody();
            $body = json_decode($body, true);
            $body['date'] = Carbon::now()->toDateTimeString();
            $body = json_encode($body);
            File::put(storage_path('app/orange.json'), $body);
            return $body;
        } catch (RequestException $e) {
            Log::error(Psr7\str($e->getRequest()));
            if ($e->hasResponse()) {
                Log::error(Psr7\str($e->getResponse()));
            }
        }
    }

    public function sendCode($code, $phone)
    {
        $accessToken = $this->authData()->access_token;
        $data = [
            'outboundSMSMessageRequest' => [
                'address' => "tel:+$phone",
                'senderAddress' => "tel:+$this->sender",
                'outboundSMSTextMessage' => [
                    'message' => "Utiliser se code ($code) pour se connecter dans Soficom Personnels."
                ]
            ]
        ];
        try {
            $client = new \GuzzleHttp\Client();
            $res = $client->post($this->sendSmsUrl, [
                'body' => json_encode($data),
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'Authorization' => "Bearer $accessToken",
                ]
            ]);
            if(!$res->getStatusCode() === 200)
            {
                Log::error('Error will sending Code');
                return false;
            }
            return true;
        } catch (RequestException $e) {
            Log::error(Psr7\str($e->getRequest()));
            if ($e->hasResponse()) {
                Log::error(Psr7\str($e->getResponse()));
            }
            return false;
        }
    }
}
