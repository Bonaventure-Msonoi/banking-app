<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    protected $client;
    protected $url;
    protected $serviceKey;
    protected $anonKey;

    public function __construct()
    {
        $this->url = config('services.supabase.url');
        $this->serviceKey = config('services.supabase.service_key');
        $this->anonKey = config('services.supabase.anon_key');
        
        $this->client = new Client([
            'base_uri' => $this->url,
            'headers' => [
                'apikey' => $this->serviceKey,
                'Authorization' => 'Bearer ' . $this->serviceKey,
                'Content-Type' => 'application/json',
                'Prefer' => 'return=representation'
            ]
        ]);
    }

    /**
     * Insert data into a Supabase table
     */
    public function insert(string $table, array $data)
    {
        try {
            $response = $this->client->post("/rest/v1/{$table}", [
                'json' => $data
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase insert error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Select data from a Supabase table
     */
    public function select(string $table, array $filters = [], string $select = '*')
    {
        try {
            $query = http_build_query($filters);
            $url = "/rest/v1/{$table}?select={$select}";
            
            if (!empty($query)) {
                $url .= "&{$query}";
            }

            $response = $this->client->get($url);
            
            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase select error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update data in a Supabase table
     */
    public function update(string $table, array $filters, array $data)
    {
        try {
            $query = http_build_query($filters);
            $response = $this->client->patch("/rest/v1/{$table}?{$query}", [
                'json' => $data
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase update error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete data from a Supabase table
     */
    public function delete(string $table, array $filters)
    {
        try {
            $query = http_build_query($filters);
            $response = $this->client->delete("/rest/v1/{$table}?{$query}");

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase delete error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Call a Supabase RPC (Remote Procedure Call) function
     */
    public function rpc(string $functionName, array $params = [])
    {
        try {
            $response = $this->client->post("/rest/v1/rpc/{$functionName}", [
                'json' => $params
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase RPC error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get Supabase Storage file URL
     */
    public function getStorageUrl(string $bucket, string $filePath)
    {
        return "{$this->url}/storage/v1/object/public/{$bucket}/{$filePath}";
    }

    /**
     * Upload file to Supabase Storage
     */
    public function uploadFile(string $bucket, string $filePath, $fileContent, string $contentType = 'application/octet-stream')
    {
        try {
            $response = $this->client->post("/storage/v1/object/{$bucket}/{$filePath}", [
                'headers' => [
                    'apikey' => $this->serviceKey,
                    'Authorization' => 'Bearer ' . $this->serviceKey,
                    'Content-Type' => $contentType,
                ],
                'body' => $fileContent
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase storage upload error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get the anon key for frontend use
     */
    public function getAnonKey(): string
    {
        return $this->anonKey;
    }

    /**
     * Get the Supabase URL for frontend use
     */
    public function getUrl(): string
    {
        return $this->url;
    }
}





