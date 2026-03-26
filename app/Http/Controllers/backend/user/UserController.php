<?php

namespace App\Http\Controllers\backend\user;

use App\Models\User;

use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\CreateUserRequest;
use App\Services\LoggerService;
use App\Enums\UserEnums;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {
        $data=[
            'users' => $this->userService->users($request->all()),
            'roles'=>app(RoleService::class)->getRolesList(['limit'=>4],['users:id,name']),
        ];
        return responseJson('users fetched successfully',$data,true);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(CreateUserRequest $createUserRequest)
    {
        LoggerService::info("User creation attempt", [
            'data' => $createUserRequest->validated()
        ]);
        $data =$createUserRequest->validated();

        $user = $this->userService->saveUser($data);

        LoggerService::info("user created successfully", ['data'=>$user]);
        return responseJson('user created successfully',$user,true);

    }

    public function updatePassword(Request $request){
        $request->validate([
           'current_password' => 'required',
           'new_password' => 'required|min:8|confirmed',
       ]);

       $response = $this->userService->updatePassword();
       if(!$response['status']){
        return responseJson(message: $response['message'],status:false,code:$response['status_code']);
       }

       return responseJson(message: 'Password updated successfully.',status:true,code:201);

   }

    public function show($id)
    {
        if($id){
            $user = $this->userService->fetch(UserEnums::UUID->value,$id);
            return responseJson('user fetched successfully',['user'=>$user],true);
    }
        }


    public function update(Request $request, $id)
    {
        //     'phone'=> 'required|unique:users,phone,'.$id,
        //     'thumbnail' => 'required',
        //     'role'=>'required',
        // ]);
        $user = $this->userService->updateUser($id,$request->all());

        return responseJson('user updated successfully',['user'=>$user],true);
    }

    public function destroy($uuid)
    {

        $this->userService->delete($uuid);

        return responseJson('user has been deleted successfully',null,true);
    }
}
