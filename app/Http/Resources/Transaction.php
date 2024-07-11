<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Transaction extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'TransactionID' => $this->TransactionID,
            'CompanyFID' => $this->FromBranchFID,
            'Company' => $this->company->CompanyName,
            'MVNumber' => $this->MVNumber,
            'MVAmount' => $this->MVAmount,
            'MVCurrencyFID' => $this->MVCurrencyFID,
            'MVCurrency' => $this->currency->Currency,
            'MVNotes' => $this->MVNotes,
            // 'MVUserFID' =>  $this->MVUserFID,
            // 'MVUser' =>  $this->user->UserName,
            'MVDate' =>  $this->MVDate,
            // 'MVDate' =>  Carbon::parse($this->MVDate)->toDateString(),
            'CreatedDate' => $this->CreatedDate,
            'USSDResponse' => $this->USSDResponse,
            'Sent' => $this->Sent,
            'Type' => $this->type ? (new PhoneTypeCollection($this->type))->Type : null,
        ];
    }
}
