<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
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
            'UserID' => $this->UserID,
            'UserName' => $this->UserName,
            'CompanyFID' => $this->CompanyFID,
            'Admin' => $this->Admin,
            'TwoFactorCode'=>$this->TwoFactorCode,
            'Company' => $this->company->CompanyName ?? '',
        ];
    }
}
