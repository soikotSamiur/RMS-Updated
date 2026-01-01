<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
     //Register a new user
     
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string|max:255',
            'password' => [
                'required',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/'
            ],
            'role'     => 'nullable|in:Admin,Employee,Waiter,Chef,Cashier',
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
            'password.min' => 'Password must be at least 8 characters long',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'address'  => $request->address,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'Employee',
        ]);

        // 🔹 Generate Sanctum token immediately
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user,
            'token'   => $token, 
        ], 201);
    }

    
     // User Login
     
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password'],
            ]);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    
     // User Logout (requires auth)
     
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }


    // Existing CRUD (index, show, update, delete)
    

    public function index()
    {
        return response()->json(User::all());
    }

    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string|max:255',
            'password' => 'nullable|min:6',
        ]);

        $user->update([
            'name'     => $request->name ?? $user->name,
            'email'    => $request->email ?? $user->email,
            'phone'    => $request->phone ?? $user->phone,
            'address'  => $request->address ?? $user->address,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        return response()->json($user);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
