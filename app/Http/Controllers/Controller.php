<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
* [Controller]
* @package laravel base controller
* @author Ajay Nautiyal
*/
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
    * Get the guard to be used during authentication.
    * @return \Illuminate\Contracts\Auth\Guard
    */
    public function guard()
    {
        return Auth::guard();
    }

    /**
    * return exception.
    * @param Exception $exception
    * @return \Illuminate\Http\Response
    */
    public function exception($exception)
    {
        return response()->json([
            'code' => $exception->getCode(),
            'message' => config('app.debug') ? $exception->getMessage() : __('common.exception')
        ], $exception->getCode());
    }
}
