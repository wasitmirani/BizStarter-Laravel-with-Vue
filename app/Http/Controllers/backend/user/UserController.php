<?php

namespace App\Http\Controllers\backend\user;

use App\Models\User;

use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function __construct(protected UserService $userService) {

    }

    public function index(Request $request)
    {
        $data=[
            'users' => $this->userService->users($request->all()),
        ];
        return responseJson('users fetched successfully',$data,true);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|unique:users,email',
            'phone'=>'required|unique:users,phone',
            'thumbnail' => 'required',
            // 'role'=>'required',
            'password' => 'required|confirmed',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'dob' => 'required',
            'gender' => 'required',
        ]);

        $user = $this->userService->store($request->all());
        $data=[
            'user' => $user,
        ];
        return responseJson('user created successfully',$data,true);

    }

    public function updatePassword(Request $request){
        // Validate the request
        $request->validate([
           'current_password' => 'required',
           'new_password' => 'required|min:8|confirmed',
       ]);

       // Get the currently authenticated user
       $user = $request->user();

       // Check if the current password matches
       if (!Hash::check($request->current_password, $user->password)) {
           return response()->json(['error' => 'Current password is incorrect.'], 400);
       }

       // Update the user's password
       $user->password = Hash::make($request->new_password);
       $user->save();

       return response()->json(['message' => 'Password updated successfully.']);

   }

    public function show($id)
    {

        $user = $this->userService->findByUUIDOrEmail($id);

        return responseJson('user fetched successfully',['user'=>$user],true);
    }

    public function update(Request $request, $id)
    {
        //     'phone'=> 'required|unique:users,phone,'.$id,
        //     'thumbnail' => 'required',
        //     'role'=>'required',
        // ]);
        $user = $this->userService->update($request->all(), $id);

        return responseJson('user updated successfully',['user'=>$user],true);
    }

    public function destroy($uuid)
    {

        $this->userService->delete($uuid);

        return responseJson('user has been deleted successfully',null,true);
    }
}
