import { ContactFormBody } from '@/const/types';
import { ContactUs, EmailTemplate, SmtpConfig } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

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
        return Response.json({ message: 'Invalid JSON body format.' }, { status: 400 });
    }

    const ipAddress =
        request.headers.get('x-forwarded-for')?.split(',').shift() ||
        request.headers.get('x-real-ip');
    const { name, email, phone, company } = rawBody;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!name || !cleanEmail || !company) {
        return Response.json({ message: 'Missing required fields: name, email, and company are mandatory.' }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof company !== 'string') {
        return Response.json({ message: 'Invalid data type for one or more required fields.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        return Response.json({ message: 'Invalid email address format.' }, { status: 400 });
    }

    // Rate limiting
    if (cleanEmail || ipAddress) {
        const emailSubmissions = await ContactUs.countDocuments({ email: cleanEmail, createdAt: { $gte: twentyFourHoursAgo } });
        const ipSubmissions = await ContactUs.countDocuments({ ip: ipAddress, createdAt: { $gte: twentyFourHoursAgo } });

        if (emailSubmissions >= 2 || ipSubmissions >= 2) {
            return Response.json({
                message: "Oops! You've already submitted this form twice in the last 24 hours.",
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

        // --- SEND EMAIL ---
        const template = await EmailTemplate.findOne({ name: "Partner form to hei@tipsetas.no" });
        const smtpData = await SmtpConfig.findOne({ active: true });

        if (template && smtpData) {
            const transporter = nodemailer.createTransport({
                 host: smtpData.host,
                 port: smtpData.port,
                 secure: smtpData.secure,
                 auth: {
                   user: smtpData.user,
                   pass: smtpData.pass, //preventing to send email for test...
                 },
               });

            const htmlBody = template.body.replace(/\{\{(.+?)\}\}/g, (_:any, key:any) => {
                return (dataToSave as any)[key.trim()] || '';
            });

            await transporter.sendMail({
                from: `"Meglertipset" <${smtpData.fromEmail}>`,
                to: "hei@tipsetas.no",
                subject: template.subject,
                html: htmlBody,
            });

            console.log("Partner form email sent!");
        } else {
            console.log("Email template or SMTP config not found. Skipping email.");
        }

        return Response.json({ message: 'Form submitted successfully! & Partner form email sent!' }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
        console.log('MongoDB ContactUs insertion or email error:', errorMessage);
        return Response.json({ message: 'Failed to save form data due to a server error.', error: errorMessage }, { status: 500 });
    }
}
