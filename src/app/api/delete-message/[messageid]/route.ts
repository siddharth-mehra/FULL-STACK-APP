import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest,{params}:{ params: Promise<{ messageid: string }> }) :Promise<any> {
    await dbConnect();

    const  messageid =(await params).messageid;
    const session = await getServerSession(authOptions);
    const user: User | null = session?.user || null;

    if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized User" },
            { status: 401 }
        );
    }

    try {
        const result = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        );
        console.log("Mongodb delete Result",result);
        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting the message:", error);
        return NextResponse.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
}
