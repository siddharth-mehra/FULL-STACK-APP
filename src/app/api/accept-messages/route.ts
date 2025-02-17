import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";

export async function POST(req: Request) {
    await dbConnect();

    const session=await getServerSession(authOptions);
    const user:User=session?.user ;
    
    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Unauthorized User"
            }
            ,{status:401})
    }

    const userId=user._id
    
    const {acceptMessages}=await req.json();
    try{
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
                {isAcceptingMessages:acceptMessages},
                {new:true}
        )
        if(!updatedUser){
            return Response.json(
                {
                    success:false,
                    message:"Failed to update user status accept messages"
                },{status:401}
            )
        }
        return Response.json(
            {
                success:true,
                message:"Message acceptance status updated successfully",
                updatedUser
            },{status:200}
        )
    }catch(error){{
        console.log("Failed to update user status accept messages",error);
        return Response.json(
            {
                success:false,
                message:"Error updating user status accept messages"
            },{status:500}
        )
    }}
}

export async function GET() {
    await dbConnect();

    const session=await getServerSession(authOptions);
    const user:User=session?.user ;
    
    if(!session || !user){
        return Response.json(
            {
                success:false,
                message:"Unauthorized User"
            }
            ,{status:401})
    }

    const userId=user._id;
    try{
        const foundUser=await UserModel.findById(userId)

    if(!foundUser){
        return Response.json(
            {
                success:false,
                message:"User not Found"
            },{status:404}
        )
    }

    return Response.json({
        success:true,
        isAcceptingMessages:foundUser.isAcceptingMessages
    })
    }catch(error){
        console.log("Failed to update user status accept messages",error);
        return Response.json(
            {
                success:false,
                message:"Failed to update user status accept messages"
            },{status:500}
        )
    }
}