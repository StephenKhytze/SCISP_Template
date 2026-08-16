<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login user and return JWT.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $credentials = $request->only([
            'username',
            'password',
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid username or password.',
            ], 401);
        }

        $user = auth('api')->user();

        if ($user->status !== 'active') {
            auth('api')->logout();

            return response()->json([
                'message' => 'This account is disabled.',
            ], 403);
        }

        return response()->json([
            'message' => 'Login successful.',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => [
                'id' => $user->user_id,
                'username' => $user->username,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Logout the current user.
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    /**
     * Return the currently authenticated user.
     */
    public function me()
    {
        $user = auth('api')->user();

        return response()->json([
            'user' => [
                'id' => $user->user_id,
                'username' => $user->username,
                'role' => $user->role,
            ],
        ]);
    }
}
