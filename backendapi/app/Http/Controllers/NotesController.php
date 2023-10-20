<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Note;
use App\Models\Category;
use DB;

class NotesController extends Controller
{

    public function __construct(){
        $this->middleware("auth:sanctum");
    }
    
    public function index(Request $request)
    {
        try {
            $list = Note::where("user_id","=",$request->user()->id)->orderby("created_at","desc")->get();


            // $list =  DB::table("notes")->join("categories", "notes.category_id","=","categories.id")
            //         ->where("user_id","=",$request->user()->id)->orderby("created_at","desc")->get();

            return  response()->json([
                "status" => true,
                "data" => $list 
            ]);
        } catch (\Throwable $th) {
            return($th);
            return  response()->json([
                "status" => false,
                "message" => "Something went wrong Throwable"
            ]);
        }
    }

   
    public function create(Request $request)
    {
        try {           
            $validator = Validator::make($request->all(),[
                'title' => 'required',
                'description' => 'required',
                'tags' => 'required',
            ]);
    
            if($validator->fails()){
                return response()->json([
                    "errors" => $validator->messages()
                ]);
            }

            $createNote = Note::create([
                'title' => $request->title,
                'description' => $request->description,
                'tags' => $request->tags,
                "category_id" => $request->category_id,
                "user_id" => $request->user()->id
            ]);

            if(!$createNote)
            {
                return  response()->json([
                    "status" => false,
                    "message" => "Note not created"
                ]);
            }
    
            return  response()->json([
                "status" => true,
                "message" => "Note Created Successfully"
            ]);
        } catch (\Throwable $th) {
            print_r( $th);
            return  response()->json([
                "status" => false,
                "message" => "Something went wrong Throwable"
            ]);
        }
    }

    
    public function store(Request $request)
    {
        //
    }

    
    public function show(string $id)
    {
        //
    }

    public function edit(Request $request,string $id)
    {
        try {

          $list = Note::where("id", $id)->Where("user_id","=",$request->user()->id)->first();

            return  response()->json([
                "status" => true,
                "data" => $list
            ]);

        } catch (\Throwable $th) {
            print_r($th);
            return  response()->json([
                "status" => false,
                "message" => "Something went wrong "
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {

            $updateNotes = Note::where("id", $id)->update([
                'title' => $request->title,
                'description' => $request->description,
                'tags' => $request->tags,
            ]);

                
            if(!$updateNotes){
                return response()->json([
                    "status" => false,
                    "message" => "Note not updated"
                ]);
            }

            return response()->json([
                "status" => true,
                "message" => "Note updated Successfully"
            ]);
  
          } catch (\Throwable $th) {
            print_r($th);
              return response()->json([
                  "status" => false,
                  "message" => "Something went wrong ",
                  "err" => $th->getMessage()
              ]);
          }
    }
   
    public function destroy(Request $request, string $id)
    {
        try {

            $updateNotes = Note::where("id", $id)->Where("user_id",$request->user()->id)->delete();

                
            if(!$updateNotes){
                return response()->json([
                    "status" => false,
                    "message" => "Note not Deleted"
                ]);
            }

            return response()->json([
                "status" => true,
                "message" => "Note Deleted Successfully"
            ]);
  
          } catch (\Throwable $th) {
            print_r($th);
              return response()->json([
                  "status" => false,
                  "message" => "Something went wrong "
              ]);
          }
    }

    public function getCategories()
    {
        try {
            $data = Category::orderby("id", "desc")->get();

            return response()->json([
                "status" => true,
                "data" => $data
            ]);
  
          } catch (\Throwable $th) {
            print_r($th);
              return response()->json([
                  "status" => false,
                  "message" => "Something went wrong "
              ]);
          }
    }

    public function searchNotes(Request $request)
    {
        try {
            
            $data = [];
            $category= [];

            if(!!$request->search)
            {
                $data  = DB::select("SELECT * from notes  where user_id = ".$request->user()->id." and ( title like '%".$request->search."%' OR description like '%".$request->search."%' OR tags like '%".$request->search."%' ) ");
            }

            if($request->category_id){
                $category = DB::select("SELECT * from notes where  user_id = ".$request->user()->id."  AND category_id = ".$request->category_id);
            }

            return response()->json([
                "status" => true,
                "data" =>  $data,
                "category" => $category
            ]);
  
          } catch (\Throwable $th) {
            print_r($th);
              return response()->json([
                  "status" => false,
                  "message" => "Something went wrong "
              ]);
          }
    }
}
