<?php

namespace App\Http\Controllers;

use \Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\User;

/**
* [AuthController]
* @package laravel controller
* @author Ajay Nautiyal
*/
class AuthController extends Controller
{

    /**
    * Create a new AuthController instance.
    * @return void
    */
    public function __construct()
    {
        $this->middleware('auth:api', [
            'except' => ['emailLogin', 'redirectToProvider', 'handleProviderCallback']
        ]);
    }

    /**
    * [emailLogin]
    * Login user with email and password.
    * @param Illuminate\Http\Request $request
    * @return \Illuminate\Http\Response
    */
    public function emailLogin(Request $request)
    {
        try {
            $credentials = $request->only(['email', 'password']);

            if ( ! $access_token = auth()->attempt($credentials) ) {
                return response()->json(['message' => __('auth.failed')], 401);
            }
            $user = $this->guard()->user();

            return $this->respondWithUserAndToken($user, $access_token);
        } catch (Exception $e) {
            return $this->exception($e);
        }
    }

    /**
    * [redirectToProvider]
    * Redirect user to Provider authentication page.
    * @param string $provider
    * @return \Illuminate\Http\Response
    */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
    * [handleProviderCallback]
    * Obtain the user information from Provider.
    * @param Illuminate\Http\Request $request
    * @param string $provider
    * @return \Illuminate\Http\Response
    */
    public function handleProviderCallback(Request $request, $provider)
    {
        try {
            $code     = $request->input('code');
            $driver   = Socialite::driver($provider);
            $token    = $driver->getAccessTokenResponse($code);
            $_user    = $driver->userFromToken($token['access_token']);
            $provider = $provider . '_id';

            $user = User::where($provider, $_user->getId())
            ->orWhere('email', $_user->getEmail())
            ->first();

            if ( is_null($user) ) {
                $password = str_random(8);

                $user = User::create([
                    'name'     => $_user->getName(),
                    'email'    => $_user->getEmail(),
                    'password' => bcrypt($password),
                    $provider  => $_user->getId()
                ]);

                $avatar = isset($_user->avatar_original) ? $_user->avatar_original : $_user->getAvatar();
                $avatar = file_get_contents($avatar);

                if ( $avatar ) {
                    $constant   = config('constant.user.avatar');
                    $avatarPath = "{$constant['path']}/{$user->id}.{$constant['extension']}";
                    Storage::put($avatarPath, $avatar);
                }
            }

            if ( is_null($user->$provider) ) {
                $user->$provider = $_user->getId();
                $user->save();
            }

            $access_token = $this->guard()->fromUser($user);

            return $this->respondWithUserAndToken($user, $access_token);
        } catch (Exception $e) {
            return $this->exception($e);
        }
    }

    /**
    * Refresh a token.
    * @return \Illuminate\Http\Response
    */
    public function refresh()
    {
        $user         = $this->guard()->user();
        $access_token = $this->guard()->refresh();
        return $this->respondWithUserAndToken($user, $access_token);
    }

    /**
    * Log the user out (Invalidate the token)
    * @return \Illuminate\Http\Response
    */
    public function logout()
    {
        $this->guard()->logout();
        return response()->json(['message' => __('auth.logout')]);
    }

    /**
    * Get the token array structure.
    * @param App\User $user
    * @param string $access_token
    * @return \Illuminate\Http\Response
    */
    protected function respondWithUserAndToken($user, $access_token)
    {
        $token = [
            'access_token' => $access_token,
            'token_type'   => 'Bearer',
            'expires_in'   => $this->guard()->factory()->getTTL() * 60,
        ];
        return response()->json(compact('user', 'token'));
    }
}
