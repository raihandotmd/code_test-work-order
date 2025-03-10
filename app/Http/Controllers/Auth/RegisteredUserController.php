<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\UserModel;
use App\Models\UserRolesModel;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // Get all names of roles
        $roles = UserRolesModel::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return Inertia::render('Auth/Register', [
            'roles' => $roles,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            // for username, check not allowed for spaces
            'username' => 'required|string|max:255|regex:/^\S*$/u|unique:users',
            'name' => 'required|string|max:255',
            'role_id' => 'required|uuid',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = UserModel::create([
            'username' => $request->username,
            'name' => $request->name,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
