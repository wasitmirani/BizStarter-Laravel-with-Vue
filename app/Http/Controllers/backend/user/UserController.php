<?php

namespace App\Http\Controllers\Backend\User;

use App\Contracts\BaseFilterable;
use App\Enums\UserEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Services\LoggerService;
use App\Services\RoleService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Lab404\Impersonate\Services\ImpersonateManager;

class UserController extends Controller implements BaseFilterable
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        // $users = $this->userService->users($filters);

        // Add impersonate option for admins
        // $currentUser = auth()->user();
        // if ($currentUser) {
        //     $users->transform(function ($user) use ($currentUser) {
        //         $user->can_impersonate = $currentUser->canImpersonate() && $user->canBeImpersonated() && $user->id !== $currentUser->id;
        //         return $user;
        //     });
        // }
        $data=[
            'users' => $this->userService->users($filters),
            'roles'=>app(RoleService::class)->getRolesList(['limit'=>4],['users:id,name']),
        ];
        return responseJson('users fetched successfully',$data,true);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $storeUserRequest)
    {
        LoggerService::info("User creation attempt", [
            'data' => $storeUserRequest->validated()
        ]);
        $data =$storeUserRequest->validated();

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
            $user = $this->userService->fetch(UserEnum::UUID->value,$id);
            return responseJson('user fetched successfully',['user'=>$user],true);
    }
        }


    public function update(StoreUserRequest $request, $id)
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

        $this->userService->delete($uuid,UserEnum::UUID->value);

        return responseJson('user has been deleted successfully',null,true);
    }

    public function impersonate($uuid)
    {
        $currentUser = auth()->user();
        if (!$currentUser) {
            return responseJson('Unauthorized', null, false, 401);
        }

        $user = $this->userService->fetch(UserEnum::UUID->value, $uuid);

        if (!$user) {
            return responseJson('User not found', null, false, 404);
        }

        if (!$currentUser->canImpersonate() || !$user->canBeImpersonated()) {
            return responseJson('Unauthorized', null, false, 403);
        }

        // Start impersonation
        $currentUser->impersonate($user);

        // Generate token for the impersonated user
        $token = $user->createToken('impersonate')->plainTextToken;

        return responseJson('Impersonation started', [
            'user' => $user,
            'token' => $token,
            'impersonator' => $currentUser
        ], true);
    }

    public function leaveImpersonate()
    {
        $currentUser = auth()->user();
        if (!$currentUser) {
            return responseJson('Unauthorized', null, false, 401);
        }

        if (!$currentUser->isImpersonating()) {
            return responseJson('Not impersonating', null, false, 400);
        }

        $impersonator = $currentUser->getImpersonator();
        $currentUser->leaveImpersonation();

        // Generate token for the impersonator
        $token = $impersonator->createToken('impersonate')->plainTextToken;

        return responseJson('Impersonation ended', [
            'user' => $impersonator,
            'token' => $token
        ], true);
    }

    public function getUsers(Request $request){
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters = ['paginated'=>false] + $filters;
        $users = $this->userService->users($filters);
        $data=[
            'users'=>$users
        ];
        return responseJson('users fetched successfully',$data,true);
    }
}
