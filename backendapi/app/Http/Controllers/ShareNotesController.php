<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShareNotes;
use Validator;
use DB;

class ShareNotesController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth:sanctum");
    }

    public function shareNotes(Request $request){
        try {

            $validator = Validator::make($request->all(),[
                'note_id' => 'required',
                'share_to' => 'required',
            ]);
    
            if($validator->fails()){
                return response()->json([
                    "errors" => $validator->messages()
                ]);
            }

           $check = ShareNotes::where("note_id","=",$request->note_id)
                        ->Where("share_to","=",$request->share_to)
                        ->get();


            if(!!sizeof($check)){
                return response()->json([
                    "status" => false,
                    "message" => "Note Already Assign to this user",
                ]);
            }                            
    
            $shareNote = ShareNotes::create([
                "note_id"      => $request->note_id,
                "share_to"     => $request->share_to,
                "share_by"     => $request->user()->id
            ]);

    
            if(!$shareNote){
                return  response()->json([
                    "status" => false,
                    "message" => "Note not share"
                ]);
            }
    
            return  response()->json([
                "status" => true,
                "message" =>"Note Share Successfully"
            ]);
        } catch (\Throwable $th) {
            return  response()->json([
                "status" => false,
                "message" => "Something went wrong Throwable",
                "err" => $th->getMessage()
            ]);
        }
    }

    public function getShareNotesById(Request $request){
        try {

       
           $shareNote = DB::select(" SELECT * FROM share_notes AS SN inner join users AS U on SN.share_by = U.id inner join notes as N on N.id = SN.note_id where SN.share_to =".$request->user()->id);
           
    
            if(!sizeof($shareNote)){
                return  response()->json([
                    "status" => false,
                    "message" => "Data not found"
                ]);
            }
    
            return  response()->json([
                "status" => true,
                "data" => $shareNote
            ]);
        } catch (\Throwable $th) {
            return  response()->json([
                "status" => false,
                "message" => "Something went wrong Throwable",
                "err" => $th->getMessage()
            ]);
        }
    }
}
