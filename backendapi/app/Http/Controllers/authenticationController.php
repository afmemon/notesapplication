<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Hash;
use App\Models\User;
use Auth;

class authenticationController extends Controller
{

    
   public function index(Request $request){
    try {
        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'email' => 'required',
            'password' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                "errors" => $validator->messages()
            ]);
        }

        $createUser = User::create([
            "name"      => $request->name,
            "email"     => $request->email,
            "password"  => Hash::make($request->password),
        ]);

        if(!$createUser){
            return  response()->json([
                "status" => false,
                "message" => "User not registered"
            ]);
        }


        return  response()->json([
            "status" => true,
            "message" => "User Created Successfully"
        ]);
    } catch (\Throwable $th) {
        return  response()->json([
            "status" => false,
            "message" => "Something went wrong Throwable",
            "err" => $th->getMessage()
        ]);
    }
   }

   public function login(Request $request){
    try {

        $validator = Validator::make($request->all(),[
            'email' => 'required',
            'password' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                "errors" => $validator->messages()
            ]);
        }

       $login =  Auth::attempt(["email"=>$request->email, "password" => $request->password]);

       
       
       
       if(!$login) {
           return response()->json([
               "message" => "Login Crediential Wrong",
               "status" => false
            ]); 
        }
        
        $token = $request->user()->createToken("Testing");


       return response()->json([
        "message" => "Login Successfull",
        "status" => true,
        'token' => $token->plainTextToken
    ]); 
    } catch (\Throwable $th) {
        print_r($th);
       return  response()->json([
            "status" => false,
            "message" => "Something went wrong Throwable"
        ]);
    }
   }

   public function logout(Request $request){
    try {

       $request->user()->currentAccessToken()->delete();

       return response()->json([
        "message" => "Logout Successfull",
        "status" => true,
    ]); 
    } catch (\Throwable $th) {
        print_r($th);
       return  response()->json([
            "status" => false,
            "message" => "Something went wrong Throwable"
        ]);
    }
   }

   public function getUsers(Request $request){
    try {

     $list = User::where("id","!=",$request->user()->id)->orderby("id","desc")->get();

       return response()->json([
        "status" => true,
        "data" => $list
    ]); 
    } catch (\Throwable $th) {
        print_r($th);
       return  response()->json([
            "status" => false,
            "message" => "Something went wrong Throwable"
        ]);
    }
   }
}
