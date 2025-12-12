import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { ContactUs } from '@/lib/models/models';
import { ContactFormBody } from '@/const/types';

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export async function POST(request: NextRequest) {
    let rawBody: Partial<ContactFormBody>;
    await connectDB();

    try {
        rawBody = (await request.json()) as Partial<ContactFormBody>;
    } catch (e) {
        console.log('Error parsing request body:', e);
        return Response.json({
            message: 'Invalid JSON body format.',
        }, { status: 400 });
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',').shift() || request.headers.get('x-real-ip');
    const { name, email, phone, company } = rawBody;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!name || !cleanEmail || !company) {
        return Response.json({
            message: 'Missing required fields: name, email, and company are mandatory.',
        }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof company !== 'string') {
        return Response.json({
            message: 'Invalid data type for one or more required fields.',
        }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        return Response.json({
            message: 'Invalid email address format.',
        }, { status: 400 });
    }

    if (cleanEmail || ipAddress) {
        const emailSubmissions = await ContactUs.countDocuments({
            email: cleanEmail,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        const ipSubmissions = await ContactUs.countDocuments({
            ip: ipAddress,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        if (emailSubmissions >= 2 || ipSubmissions >= 2) {
            return Response.json({
                message: "Oops! You've already submitted this form twice in the last 24 hours. If you need immediate assistance, feel free to reach out to our support team!",
            }, { status: 429 });
        }
    }

    const dataToSave: Partial<any> = {
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? String(phone).trim() : undefined,
        company: company.trim(),
        ip: ipAddress,
    };

    try {
        const newRecord = await ContactUs.create(dataToSave);
        console.log(`Contact form submitted by ${newRecord.name} (ID: ${newRecord._id})`);

        return Response.json({
            message: 'Form submitted successfully!',
            // name: newRecord.name,
        }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
        console.log('MongoDB ContactUs insertion error:', errorMessage);
        return Response.json({
            message: 'Failed to save form data due to a server error.',
            error: errorMessage
        }, { status: 500 });
    }
}