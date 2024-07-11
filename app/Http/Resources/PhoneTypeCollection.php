<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PhoneTypeCollection extends JsonResource
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
            'PhoneTypeID' => $this->PhoneTypeID,
            'PhoneNumber' => $this->PhoneNumber,
            'Type' => $this->Type,
            'Note' => $this->Note,
        ];
    }
}
