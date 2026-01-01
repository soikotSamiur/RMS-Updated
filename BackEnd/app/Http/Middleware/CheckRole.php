<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user has one of the allowed roles
        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to access this resource.',
                'required_roles' => $roles,
                'your_role' => $request->user()->role
            ], 403);
        }

        return $next($request);
    }
}
