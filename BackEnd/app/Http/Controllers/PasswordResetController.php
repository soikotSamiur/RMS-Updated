<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send OTP to user's email
     */
    public function sendOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);
        
        // Delete old OTPs for this email
        DB::table('password_resets')->where('email', $request->email)->delete();

        // Store OTP (expires in 10 minutes)
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
            'created_at' => Carbon::now(),
        ]);

        // Send OTP via email
        try {
            Mail::send('emails.reset-password', ['otp' => $otp], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Password Reset OTP - DineSmart Restaurant');
            });

            return response()->json([
                'message' => 'OTP sent to your email successfully',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send OTP. Please check your email configuration.',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }

    /**
     * Verify OTP and reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
            'password' => [
                'required',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/'
            ],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
            'password.min' => 'Password must be at least 8 characters long',
        ]);

        // Find OTP record
        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid OTP',
                'success' => false,
            ], 400);
        }

        // Check if OTP is expired
        if (Carbon::parse($resetRecord->expires_at)->isPast()) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'OTP has expired. Please request a new one.',
                'success' => false,
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete used OTP
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password reset successfully',
            'success' => true,
        ], 200);
    }
}
