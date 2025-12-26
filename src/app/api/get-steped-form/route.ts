import { FormBuilder } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const formSelectId = request.nextUrl.searchParams.get("formSelectId");

        if (!formSelectId) {
            return NextResponse.json(
                { message: "formSelectId is required" },
                { status: 400 }
            );
        }

        // const formSelect = await FormBuilder.findById(formSelectId);
        // console.log(formSelectId)

        const formSelect = await FormBuilder.findOne({
            formId: formSelectId,
        });

        // console.log("formSelectId:", formSelectId);
        // console.log("formSelect:", formSelect);

        if (!formSelect) {
            return NextResponse.json(
                { message: "Form not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(formSelect, { status: 200 });

    } catch (error) {
        console.error("error at get-steped-form:", error);
        return NextResponse.json(
            {
                database: { healthy: false, error: "Request failed" },
                timestamp: new Date().toISOString(),
            },
            { status: 503 }
        );
    }
}
