<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;

class LoggerService
{
    private const HIDDEN_FIELDS = [
        'password',
        'password_confirmation',
        'token',
        'secret',
        'api_key',
        'authorization',
        'credit_card',
        'ssn',
        'cvv',
    ];

    /**
     * Log an info message
     */
    public static function info(string $message, array $context = []): void
    {
        Log::info($message, [
            'data' => self::prepareDataForLogging($context),
            'meta' => self::getMetaData(),
        ]);
    }

    /**
     * Log an error message
     */
    public static function error(string $message, array $context = []): void
    {
        Log::error($message, [
            'data' => self::prepareDataForLogging($context),
            'meta' => self::getMetaData(),
        ]);
    }

    /**
     * Log a warning message
     */
    public static function warning(string $message, array $context = []): void
    {
        Log::warning($message, [
            'data' => self::prepareDataForLogging($context),
            'meta' => self::getMetaData(),
        ]);
    }

    /**
     * Log a debug message
     */
    public static function debug(string $message, array $context = []): void
    {
        if (config('app.debug')) {
            Log::debug($message, [
                'data' => self::prepareDataForLogging($context),
                'meta' => self::getMetaData(),
            ]);
        }
    }

    /**
     * Log with custom level
     */
    public static function log(string $level, string $message, array $context = []): void
    {
        if (in_array($level, ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'])) {
            Log::log($level, $message, [
                'data' => self::prepareDataForLogging($context),
                'meta' => self::getMetaData(),
            ]);
        }
    }

    /**
     * Get metadata for logging
     */
    private static function getMetaData(): array
    {
        return [
            'initiated_by' => self::getUserId(),
            'ip_address' => Request::ip(),
            'user_agent' => Str::limit(Request::userAgent(), 255),
            'url' => Request::fullUrl(),
            'method' => Request::method(),
            'timestamp' => now()->toISOString(),
            'request_id' => Str::uuid()->toString(),
        ];
    }

    /**
     * Get user ID safely
     */
    private static function getUserId(): string|int|null
    {
        try {
            return Auth::id() ?? 'system';
        } catch (\Exception $e) {
            return 'system';
        }
    }

    /**
     * Prepare data for logging by filtering sensitive information
     */
    private static function prepareDataForLogging(array $data): array
    {
        $result = [];

        foreach ($data as $key => $value) {
            $normalizedKey = strtolower($key);

            // Check for sensitive fields
            if (self::isSensitiveField($normalizedKey)) {
                $result[$key] = '[HIDDEN]';
                continue;
            }

            // Handle different data types
            $result[$key] = match (true) {
                is_array($value) => self::prepareArrayData($value),
                is_object($value) => self::prepareObjectData($value),
                is_resource($value) => '[RESOURCE]',
                default => $value,
            };
        }

        return $result;
    }

    /**
     * Check if field is sensitive
     */
    private static function isSensitiveField(string $field): bool
    {
        return Arr::first(self::HIDDEN_FIELDS, function ($hiddenField) use ($field) {
            return Str::contains($field, $hiddenField);
        }) !== null;
    }

    /**
     * Prepare array data for logging
     */
    private static function prepareArrayData(array $data): array|string
    {
        if (empty($data)) {
            return '[]';
        }

        // Recursively prepare nested arrays
        $prepared = [];
        foreach ($data as $key => $value) {
            $prepared[$key] = match (true) {
                is_array($value) => self::prepareArrayData($value),
                is_object($value) => self::prepareObjectData($value),
                self::isSensitiveField(strtolower($key)) => '[HIDDEN]',
                default => $value,
            };
        }

        return $prepared;
    }

    /**
     * Prepare object data for logging
     */
    private static function prepareObjectData(object $object): string
    {
        return match (true) {
            method_exists($object, '__toString') => (string) $object,
            method_exists($object, 'toArray') => '[ARRAY]',
            method_exists($object, 'toJson') => '[JSON]',
            $object instanceof \Exception => self::prepareExceptionData($object),
            default => '[OBJECT: ' . get_class($object) . ']',
        };
    }

    /**
     * Prepare exception data for logging
     */
    private static function prepareExceptionData(\Exception $exception): array
    {
        return [
            'type' => get_class($exception),
            'message' => $exception->getMessage(),
            'code' => $exception->getCode(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ];
    }
}
