/* eslint-disable @typescript-eslint/no-unused-vars */

export const runtime = "nodejs";

import {
  CollaboratePartner,
  Counter,
  EmailTemplate,
  CollaboratePartner as Partner,
  PartnerLimit,
  SmtpConfig,
  User,
} from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { getTimeAgo } from "@/utils/getTimeAgo";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

let MAX_PARTNERS: any = 0;
let uniqueId: number = 0;
export async function POST(req: Request) {
  try {
    await connectDB();
    const maxPartnerLimit = await PartnerLimit.findOne();
    MAX_PARTNERS = maxPartnerLimit.limit;
    console.log("MAX_PARTNERS:-- ", MAX_PARTNERS);
    const body = await req.json();
    const userFields = body.dynamicFields || {};
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",").shift() ||
      req.headers.get("x-real-ip");

    const counter = await Counter.findOneAndUpdate(
      { model: "User" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    uniqueId = counter.count;
    const userValues = userFields[0]?.values || {};
    const timeDuration = getTimeAgo("2s");
    const userEmail = userValues.email;
    const userPhone = userValues.phone;

    const recentByIp = await User.findOne({
      ip: ipAddress,
      createdAt: { $gte: timeDuration },
    }).select("createdAt");

    let recentByEmail = null;
    if (userEmail) {
      recentByEmail = await User.findOne({
        "dynamicFields.0.values.email": userEmail,
        createdAt: { $gte: timeDuration },
      }).select("createdAt");
    }

    let recentByPhone = null;
    if (userPhone) {
      recentByPhone = await User.findOne({
        "dynamicFields.0.values.phone": userPhone,
        createdAt: { $gte: timeDuration },
      }).select("createdAt");
    }

    console.log("Rate limit checks:", {
      byIp: recentByIp ? "Found" : "None",
      byEmail: recentByEmail ? "Found" : "None",
      byPhone: recentByPhone ? "Found" : "None",
    });

    if (recentByIp || recentByEmail || recentByPhone) {
      const foundBy = [];
      if (recentByIp) foundBy.push("IP address");
      if (recentByEmail) foundBy.push("email");
      if (recentByPhone) foundBy.push("phone");
      console.log(
        `Too many recent submissions detected (by ${foundBy.join(
          ", "
        )}). with in time interval`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Too many recent submissions detected.`,
          status: false,
        },
        { status: 200 }
      );
    }

    const user = await User.create({
      ...body,
      dynamicFields: userFields,
      uniqueId: uniqueId,
      userValues: userValues,
      ip: ipAddress,
    });
    const userUniqueId = user.uniqueId;
    const partners = await CollaboratePartner.find({ isActive: true });
    console.log(`Total active partners: ${partners.length}`);

    let partnerArray = [...partners];
    console.log("\n========== STARTING FILTERING PROCESS ==========");
    console.log(`Initial partner count: ${partnerArray.length}`);

    console.log("\n========== STEP 1: POSTAL CODE MATCHING ==========");
    console.log(`User postal code: ${userValues.postalCode}`);

    const postalFiltered = [];
    const postalMatchLog = [];

    for (const partner of partnerArray) {
      const matches = Boolean(
        matchPostalCode(userValues.postalCode, partner.postalCodes)
      );
      const logEntry = {
        partnerName: partner.name,
        partnerId: partner._id,
        postalCode: userValues.postalCode,
        partnerPostalCodes: partner.postalCodes,
        match: matches,
        timestamp: new Date().toISOString(),
      };
      postalMatchLog.push(logEntry);

      console.log(`  ${partner.name}: ${matches ? "MATCHES" : "NO MATCH"}`);
      if (matches) {
        postalFiltered.push(partner);
      }
    }

    partnerArray = postalFiltered;
    console.log(`After postal code matching: ${partnerArray.length} partners`);

    console.log("\n========== STEP 2: WISHES EXACT MATCHING ==========");

    const wishesFiltered = [];
    const wishesMatchLog = [];

    for (const partner of partnerArray) {
      const matches = Boolean(isWishesMatch(partner, userValues));
      console.log("partner:--- ", partner);
      console.log("userValues:--- ", userValues);
      const logEntry = {
        partnerName: partner.name,
        partnerId: partner._id,
        wishes: partner.wishes,
        userValues: userValues,
        match: matches,
        timestamp: new Date().toISOString(),
      };
      wishesMatchLog.push(logEntry);

      console.log(`\n  Checking wishes for ${partner.name}:`);
      console.log(`    Wishes: ${JSON.stringify(partner.wishes)}`);
      console.log(
        `    Result: ${matches ? "ALL WISHES MATCH" : "WISHES NOT MATCHED"}`
      );
      if (matches) {
        wishesFiltered.push(partner);
      }
    }

    partnerArray = wishesFiltered;
    console.log(`\nAfter wishes matching: ${partnerArray.length} partners`);

    console.log("\n========== STEP 3: MONTHLY LIMIT CHECK ==========");

    const limitFiltered = [];
    const limitCheckLog = [];

    for (const partner of partnerArray) {
      const limitReached = isMonthlyLimitReached(partner);
      const logEntry = {
        partnerName: partner.name,
        partnerId: partner._id,
        currentMonthLeads: partner.leads?.currentMonth || 0,
        maxLeadsPerMonth: partner.maxLeadsPerMonth || "No limit",
        limitReached: limitReached,
        timestamp: new Date().toISOString(),
      };
      limitCheckLog.push(logEntry);

      console.log(
        `  ${partner.name}: ${
          limitReached ? "LIMIT REACHED" : "LIMIT AVAILABLE"
        }`
      );
      if (!limitReached) {
        limitFiltered.push(partner);
      }
    }

    partnerArray = limitFiltered;
    console.log(`After monthly limit check: ${partnerArray.length} partners`);

    console.log("\n========== STEP 4-6: PRIORITY SORTING ==========");

    const sortingLog: any = [];

    if (partnerArray.length > 0) {
      console.log("Sorting partners by:");
      console.log("  1. Premium status (true > false)");
      console.log("  2. Last month leads (higher > lower)");
      console.log("  3. Created date (older > newer)");

      console.log("\nBefore sorting:");
      partnerArray.forEach((p) => {
        const logEntry = {
          partnerName: p.name,
          partnerId: p._id,
          isPremium: p.isPremium,
          lastMonthLeads: p.lastMonthLeads || 0,
          createdAt: p.createdAt,
          timestamp: new Date().toISOString(),
        };
        sortingLog.push(logEntry);

        console.log(
          `  ${p.name}: Premium=${p.isPremium}, LastMonthLeads=${
            p.lastMonthLeads || 0
          }, Created=${new Date(p.createdAt).toLocaleDateString()}`
        );
      });

      partnerArray = sortPartnersByPriority(partnerArray);

      // partner filter : first which have max leads last month
      partnerArray.sort((a, b) => (b.leads?.lastMonth ?? 0) - (a.leads?.lastMonth ?? 0));
      // console.log(`partnerArray after sorting:--- ${partnerArray}`)

      console.log("\nAfter sorting (in priority order):");
      partnerArray.forEach((p, i) => {
        console.log(
          `  ${i + 1}. ${p.name}: Premium=${p.isPremium}, LastMonthLeads=${
            p.lastMonthLeads || 0
          }, Created=${new Date(p.createdAt).toLocaleDateString()}`
        );
      });
    }

    console.log(
      `\n========== STEP 7: SELECT TOP ${MAX_PARTNERS} PARTNERS ==========`
    );

    const selectedPartners = partnerArray.slice(0, MAX_PARTNERS);
    const selectionLog: any = [];

    console.log(`Selected ${selectedPartners.length} partners:`);
    selectedPartners.forEach((p, i) => {
      const logEntry = {
        rank: i + 1,
        partnerName: p.name,
        partnerId: p._id,
        email: p.email,
        isPremium: p.isPremium,
        lastMonthLeads: p.lastMonthLeads || 0,
        createdAt: p.createdAt,
        timestamp: new Date().toISOString(),
      };
      selectionLog.push(logEntry);

      console.log(`  ${i + 1}. ${p.name} (${p.email})`);
    });

    console.log("\n========== PREPARING DATA FOR STORAGE ==========");

    const partnerEmailsData = selectedPartners?.map((p) => ({
      partnerId: p._id,
      email: p.email,
      companyName: p.name || p.companyName || "Unknown Company",
      sentAt: new Date(),
      status: "pending",
    }));

    // const leadTypesData = selectedPartners?.map(p => ({
    //   partnerId: p._id,
    //   leadTypes: p.leadTypes || []
    // }));

    console.log("\n========== CREATING COMPREHENSIVE LOG ==========");

    const comprehensiveLog = {
      // User information
      userInfo: {
        userId: user._id,
        uniqueId: uniqueId,
        postalCode: userValues.postalCode,
        totalFieldsProvided: Object.keys(userValues).length,
        timestamp: new Date().toISOString(),
      },

      // Statistics
      statistics: {
        initialPartners: partners.length,
        postalMatched: postalFiltered.length,
        wishesMatched: wishesFiltered.length,
        limitAvailable: limitFiltered.length,
        finalSelected: selectedPartners.length,
        maxPartnersAllowed: MAX_PARTNERS,
      },

      // logs
      steps: {
        step1: {
          name: "Postal Code Matching",
          description:
            "Match user's postal code with partner's postal code restrictions",
          log: postalMatchLog,
          summary: {
            totalChecked: partners.length,
            matched: postalFiltered.length,
            notMatched: partners.length - postalFiltered.length,
          },
        },
        step2: {
          name: "Wishes Matching",
          description:
            "Match user's field values with partner's wish requirements",
          log: wishesMatchLog,
          summary: {
            totalChecked: partnerArray.length, // After step 1
            matched: wishesFiltered.length,
            notMatched: partnerArray.length - wishesFiltered.length,
          },
        },
        step3: {
          name: "Monthly Limit Check",
          description:
            "Check if partners have reached their monthly lead limit",
          log: limitCheckLog,
          summary: {
            totalChecked: wishesFiltered.length,
            limitAvailable: limitFiltered.length,
            limitReached: wishesFiltered.length - limitFiltered.length,
          },
        },
        step4_6: {
          name: "Priority Sorting",
          description:
            "Sort partners by Premium > Last Month Leads > Created Date",
          log: sortingLog,
          summary: {
            totalSorted: limitFiltered.length,
            criteria: [
              "Premium Status (true > false)",
              "Last Month Leads (higher > lower)",
              "Created Date (older > newer)",
            ],
          },
        },
        step7: {
          name: "Top Partner Selection",
          description: `Select top ${MAX_PARTNERS} partners from sorted list`,
          log: selectionLog,
          summary: {
            totalAvailable: partnerArray.length,
            selected: selectedPartners.length,
            selectionLimit: MAX_PARTNERS,
          },
        },
      },

      // Final selection details
      selectedPartners: selectedPartners?.map((p) => ({
        partnerId: p._id,
        name: p.name,
        email: p.email,
        isPremium: p.isPremium,
        reasonSelected: "Met all criteria and ranked in top positions",
      })),

      // Processing metadata
      processing: {
        startTime: new Date().toISOString(),
      },
    };

    const logString = JSON.stringify(comprehensiveLog, null, 2);
    const logSummary = JSON.stringify(
      {
        totalPartnersChecked: partners.length,
        postalMatched: postalFiltered.length,
        wishesMatched: wishesFiltered.length,
        limitAvailable: limitFiltered.length,
        finalSelected: selectedPartners.length,
        steps: [
          "Postal Matching",
          "Wishes Matching",
          "Limit Check",
          "Priority Sorting",
          "Top Selection",
        ],
      },
      null,
      2
    );

    // console.log("Comprehensive log created: ", logString);
    console.log(`Log size: ${logString.length} characters`);
    console.log(`Log structure: ${Object.keys(comprehensiveLog).join(", ")}`);

    console.log("\n========== UPDATING USER RECORD ==========");
    const formId: string | null = userFields?.[0]?.formId ?? null;

    let totalProfit = 0;

    const partnerWithPrice = selectedPartners.map((partner) => {
      let leadPrice = 0;

      const matchedLeadType = partner.leadTypes?.find(
        (lt: any) => lt.typeId?.toString() === formId?.toString()
      );

      if (matchedLeadType) {
        leadPrice = matchedLeadType.price;
      }

      totalProfit += leadPrice;

      return {
        partnerId: partner._id,
        leadPrice: leadPrice,
      };
    });

    const updateData: any = {
      partnerIds: partnerWithPrice,
      profit: totalProfit,
      status: "Pending",
      log: logString,
      logSummary,
    };

    await User.findByIdAndUpdate(user._id, updateData);

    // console.log("User record updated with initial data updateData: ", updateData);

    if (selectedPartners.length > 0) {
      console.log("\n========== UPDATING PARTNER LEADS COUNT ==========");
      await updatePartnerLeadsCount(selectedPartners);
    }

    let emailResults = [];
    let finalStatus = "Pending";
    if (selectedPartners.length === 0) {
      finalStatus = "Reject";

      await User.findByIdAndUpdate(user._id, {
        status: "Reject",
        rejectionReason: "No matching partners found",
        emailSentAt: new Date(),
      });

      console.log("No partners found → Lead rejected");
    }
    if (selectedPartners.length > 0) {
      console.log("\n========== SENDING EMAILS TO PARTNERS ==========");
      emailResults = await sendMailToPartners(
        selectedPartners,
        userValues,
        partnerEmailsData,
        userUniqueId
      );

      // Check if at least one email was sent successfully
      const sentCount = emailResults.filter((r) => r.status === "sent").length;
      const failedCount = emailResults.filter(
        (r) => r.status === "failed"
      ).length;

      console.log(`Email results: ${sentCount} sent, ${failedCount} failed`);

      // Update status based on email sending results
      if (sentCount > 0) {
        finalStatus = "Complete";
        console.log(
          `Status updated to: ${finalStatus} (${sentCount} email(s) sent successfully)`
        );
      } else {
        finalStatus = "Pending";
        console.log(`Status remains: ${finalStatus} (No emails processed)`);
      }

      if (failedCount > 0) {
        console.error("Email failures:");
        emailResults
          .filter((r) => r.status === "failed")
          .forEach((f) => {
            console.error(`  ${f.email}: ${f.error}`);
          });
      }
    }

    // Final update to user document with email results and final status
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          emailResults: emailResults.map((r) => ({
            partnerId: r.partnerId,
            email: r.email,
            status: r.status,
            sentAt: r.sentAt || new Date(),
            error: r.error || null,
          })),
          status: finalStatus,

        },
      },
      { new: true, runValidators: true }
    );

    let leadEmailResult = null;

    if (selectedPartners.length > 0) {
      try {
        console.log("\n========== SENDING EMAIL TO LEAD ==========");

        const leadTemplate = await getLeadEmailTemplate();

        leadEmailResult = await sendMailToLead(
          userValues,

          selectedPartners,
          uniqueId
        );

        console.log("Lead email sent:", leadEmailResult);
      } catch (err: any) {
        console.error("Lead email failed:", err.message);
      }
    } else {
      console.log("No partners found → Lead email not sent");
    }

    console.log("\n========== PROCESSING COMPLETE ==========");
    console.log(`Final user status: ${finalStatus}`);

    const statistics = {
      totalPartners: partners.length,
      postalMatched: postalFiltered.length,
      wishesMatched: wishesFiltered.length,
      limitAvailable: limitFiltered.length,
      finalSelected: selectedPartners.length,
      processingSteps: [
        { step: "Initial", count: partners.length },
        { step: "Postal Code Matching", count: postalFiltered.length },
        { step: "Wishes Matching", count: wishesFiltered.length },
        { step: "Monthly Limit Check", count: limitFiltered.length },
        { step: "Final Selection", count: selectedPartners.length },
      ],
    };

    const emailResultLog = emailResults?.map((r) => ({
      partnerId: r.partnerId,
      email: r.email,
      status: r.status,
    }));

    const response = {
      success: true,
      message: "Leads processed successfully",
      status: finalStatus,
      partners: selectedPartners?.map((p) => ({
        name: p.name || p.partnerName || "Unknown",
      })),
    };

    console.log("Final Statistics:");
    console.log("statistics", JSON.stringify(statistics, null, 2));
    console.log("emailResultLog: ", emailResultLog);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("========== PROCESSING ERROR ==========");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

function matchPostalCode(
  userPostalCode: string,
  partnerPostalCodes: any
): boolean {
  // If user has no postal code, we can't match
  if (!userPostalCode || userPostalCode.trim() === "") {
    return false;
  }

  const userCode = userPostalCode.trim();

  // If partner has no postal codes restriction, accept all
  if (
    !partnerPostalCodes ||
    (typeof partnerPostalCodes === "object" &&
      Object.keys(partnerPostalCodes).length === 0)
  ) {
    return true;
  }

  // Check if postalCodes is an object with exact/ranges properties
  if (typeof partnerPostalCodes !== "object" || partnerPostalCodes === null) {
    return false;
  }

  // Check exact postal codes
  if (partnerPostalCodes.exact && Array.isArray(partnerPostalCodes.exact)) {
    for (const item of partnerPostalCodes.exact) {
      if (item && item.code === userCode) {
        return true;
      }
    }
  }

  // Check postal code ranges
  if (partnerPostalCodes.ranges && Array.isArray(partnerPostalCodes.ranges)) {
    const userCodeNum = parseInt(userCode);
    if (!isNaN(userCodeNum)) {
      for (const range of partnerPostalCodes.ranges) {
        if (range && range.from && range.to) {
          const from = parseInt(range.from);
          const to = parseInt(range.to);
          if (
            !isNaN(from) &&
            !isNaN(to) &&
            userCodeNum >= from &&
            userCodeNum <= to
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * STEP 2: Wish matching - Updated with selectedFormType handling
 */
const isWishesMatch = (partner: any, userValues: any) => {
  const partnerWishes = partner.wishes || [];

  // No wishes → auto match
  if (!partnerWishes.length) return true;

  for (const wish of partnerWishes) {
    if (!wish.question || wish.question.trim() === "") {
      console.log("Wish question empty → FAIL");
      return false;
    }

    const question = wish.question.trim();
    const expected = wish.expectedAnswer || [];

    // Mapping
    const fieldMapping: any = {
      leadType: "selectedFormTitle",
      preferranceType: "selectedFormTitle",
    };

    const field = fieldMapping[question] || question;

    // USER DOES NOT HAVE FIELD → FAIL
    if (!userValues.hasOwnProperty(field)) {
      console.log(`Missing user field: ${field} → FAIL`);
      return false;
    }

    const userAnswer = String(userValues[field] || "").trim();

    // EMPTY EXPECTEDANSWER → FAIL
    if (
      expected.length === 0 ||
      (expected.length === 1 && expected[0].trim() === "")
    ) {
      console.log("Expected answer empty → FAIL");
      return false;
    }

    const isMatch = expected.some(
      (ans: any) => String(ans).trim() === userAnswer
    );

    // WRONG ANSWER → FAIL
    if (!isMatch) {
      console.log(`Value mismatch for ${question}`);
      console.log(`   user="${userAnswer}" expected="${expected}"`);
      return false;
    }

    console.log(`✔ Wish matched: ${question}`);
  }

  return true; // All wishes matched
};

/**
 * STEP 3: Monthly limit check
 */
// function isMonthlyLimitReached(partner: any): boolean {
//   // If no maxLeadsPerMonth is set, assume no limit
//   if (!partner.maxLeadsPerMonth) {
//     return false;
//   }

//   const currentMonthLeads = partner.leads?.currentMonth || 0;
//   const maxLeads = partner.maxLeadsPerMonth;

//   return currentMonthLeads >= maxLeads;
// }
function isMonthlyLimitReached(partner: any): boolean {
  const monthlyLimit = partner.leads?.total || 0;

  // 0 = unlimited
  if (monthlyLimit === 0) return false;

  return (partner.leads?.currentMonth || 0) >= monthlyLimit;
}

/**
 * STEPS 4-6: Priority sorting
 */
function sortPartnersByPriority(partners: any[]): any[] {
  return partners.sort((a, b) => {
    // 1. Premium partners first (true > false)
    if (a.isPremium !== b.isPremium) {
      return b.isPremium ? 1 : -1;
    }

    // 2. Partners with higher last month leads
    const aLastMonthLeads = a.lastMonthLeads || a.leads?.lastMonth || 0;
    const bLastMonthLeads = b.lastMonthLeads || b.leads?.lastMonth || 0;

    if (aLastMonthLeads !== bLastMonthLeads) {
      return bLastMonthLeads - aLastMonthLeads;
    }

    // 3. Older partners first (earlier createdAt)
    const aDate = new Date(a.createdAt).getTime();
    const bDate = new Date(b.createdAt).getTime();

    return aDate - bDate;
  });
}

/**
 * Update partner leads count
 */
// async function updatePartnerLeadsCount(partners: any[]) {
//   const updatePromises = partners?.map((partner) =>
//     Partner.findByIdAndUpdate(
//       partner._id,
//       {
//         $inc: {
//           "leads.currentMonth": 1,
//           "leads.total": 1,
//         },
//       },
//       { new: true }
//     )
//   );

//   await Promise.all(updatePromises);
// }
async function updatePartnerLeadsCount(partners: any[]) {
  await Partner.updateMany(
    { _id: { $in: partners.map(p => p._id) } },
    {
      $inc: { "leads.currentMonth": 1 },
    }
  );
}

/**
 * Send emails to selected partners
 */
async function sendMailToPartners(
  partners: any[],
  userValues: any,
  partnerEmailsData: any[],
  userUniqueId: number
) {
  if (!partners.length) {
    return partnerEmailsData;
  }

  try {
    const activeTemplate = await getActiveEmailTemplate();
    const smtpData = await SmtpConfig.findOne();

    if (!smtpData) {
      return partnerEmailsData?.map((data) => ({
        ...data,
        status: "failed",
        error: "No SMTP configuration",
        sentAt: new Date(),
      }));
    }

    const transporter = nodemailer.createTransport({
      host: smtpData.host,
      port: smtpData.port,
      secure: smtpData.secure,
      auth: {
        user: smtpData.user,
        pass: smtpData.pass, //preventing to send email for test...
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    const results = [];

    for (let i = 0; i < partners.length; i++) {
      const partner = partners[i];
      const emailData = partnerEmailsData[i];

      try {
        const html = generatePartnerEmail(
          partner,
          userValues,
          activeTemplate,
          userUniqueId
        );

        const mailOptions = {
          from: `"Meglertip Lead" <${smtpData.user}>`,
          to: partner.email,
          subject: activeTemplate.subject,
          html: html,
          replyTo: userValues.email || smtpData.user,
        };

        const info = await transporter.sendMail(mailOptions);

        results.push({
          ...emailData,
          status: "sent",
          sentAt: new Date(),
          messageId: info.messageId,
        });
      } catch (err: any) {
        results.push({
          ...emailData,
          status: "failed",
          error: err.message,
          sentAt: new Date(),
        });
      }
    }

    return results;
  } catch (error: any) {
    return partnerEmailsData?.map((data) => ({
      ...data,
      status: "failed",
      error: error.message,
      sentAt: new Date(),
    }));
  }
}

// Get active email template
async function getActiveEmailTemplate() {
  const activeTemplate = await EmailTemplate.findOne({ isActive: true });
  if (!activeTemplate) {
    throw new Error("No active email template found");
  }
  return activeTemplate;
}

async function getLeadEmailTemplate() {
  const template = await EmailTemplate.findOne({
    name: "To the lead when they complete a form",
  });

  if (!template) {
    throw new Error("Lead email template not found or inactive");
  }

  return template;
}

function generateLeadEmail(
  userValues: any,
  template: any,
  partners: any[],
  uniqueId: number
) {
  let emailBody = template.body;

  const partnerNames = partners
    .map((p) => p.name || p.companyName)
    .filter(Boolean);

  const placeholders: Record<string, string> = {
    "[partner 1]": partnerNames[0] || "",
    "[Full name]": userValues.name || "User",
    "[partner 2]": partnerNames[1] || "",
    "[partner 3]": partnerNames[2] || "",
    "[Id]": uniqueId?.toString() || "N/A",
  };

  Object.entries(placeholders).forEach(([key, value]) => {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    emailBody = emailBody.replace(regex, value);
  });

  return emailBody;
}

async function sendMailToLead(
  userValues: any,
  selectedPartners: any[],
  uniqueId: number
) {
  if (!userValues?.email) {
    console.log("No user email found, skipping lead email");
    return null;
  }

  const smtpData = await SmtpConfig.findOne();
  if (!smtpData) {
    throw new Error("No SMTP configuration found");
  }

  const template = await getLeadEmailTemplate();

  const transporter = nodemailer.createTransport({
    host: smtpData.host,
    port: smtpData.port,
    secure: smtpData.secure,
    auth: {
      user: smtpData.user,
      pass: smtpData.pass,
    },
  });

  await transporter.verify();

  const html = generateLeadEmail(
    userValues,
    template,
    selectedPartners,
    uniqueId
  );

  const mailOptions = {
    from: `"Meglertipset" <${smtpData.user}>`,
    to: userValues.email,
    subject: template.subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    email: userValues.email,
    status: "sent",
    messageId: info.messageId,
    sentAt: new Date(),
  };
}

// Generate email HTML
function generatePartnerEmail(
  partner: any,
  userValues: any,
  activeTemplate: any,
  userUniqueId: number
) {
  if (!activeTemplate || !activeTemplate.body) {
    return "<h1>New Lead Received</h1><p>Please check the system for details.</p>";
  }

  let emailBody = activeTemplate.body;

  console.log("Generating email with placeholders:");
  console.log("Template body preview:", emailBody.substring(0, 200) + "...");
  console.log("User values available:", userValues);

  emailBody = emailBody.replace(
    /{partnerName}/g,
    partner.name || partner.companyName || "Partner"
  );

  const placeholderMappings: Record<string, string> = {
    "[Id]": String(userUniqueId) || "N/A",
    "[Full name]": userValues.name || "N/A",
    "[Full number]": userValues.phone || "N/A",
    "[Full email]": userValues.email || "N/A",
    "[adress_lead]": userValues.streetName || userValues.address || "N/A",
    "[Type of lead]":
      userValues.selectedFormTitle || userValues.preferranceType || "N/A",
    "[EMAIL]": userValues.email || "N/A",
    /// for addition work
    "{userName}": userValues.name || "N/A",
    "{userPhone}": userValues.phone || "N/A",
    "{userEmail}": userValues.email || "N/A",
    "{userAddress}": userValues.streetName || userValues.address || "",
    "{userAccommodationType}": userValues.accommodationType || "N/A",
    "{userPostalCode}": userValues.postalCode || "N/A",
    "{userRoomCount}": userValues.roomCount || "N/A",
    "{userHomeSize}": userValues.homeSize || "N/A",
    "{userStreetName}": userValues.streetName || "N/A",
    "{userAdditionalIdentifier}": userValues.additionalIdentifier || "N/A",
    "{userRoomCondition}": userValues.roomCondition || "N/A",
    "{userSellingDate}": userValues.sellingDate || "N/A",
    "{userDetails}": userValues.details || "N/A",
    "{userSelectedFormTitle}": userValues.selectedFormTitle || "N/A",
    "{userPreferranceType}":
      userValues.preferranceType || userValues.selectedFormTitle || "N/A",
    "{currentDate}": new Date().toLocaleDateString("no-NO"),
  };

  const foundPlaceholders: string[] = [];
  Object.keys(placeholderMappings).forEach((placeholder) => {
    if (emailBody.includes(placeholder)) {
      foundPlaceholders.push(placeholder);
    }
  });

  console.log("Found placeholders in template:", foundPlaceholders);

  Object.entries(placeholderMappings).forEach(([placeholder, value]) => {
    if (emailBody.includes(placeholder)) {
      console.log(`Replacing ${placeholder} with: ${value}`);
      const regex = new RegExp(
        placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g"
      );
      emailBody = emailBody.replace(regex, value);
    }
  });

  const remainingSquareBrackets = emailBody.match(/\[.*?\]/g) || [];
  const remainingCurlyBraces = emailBody.match(/\{.*?\}/g) || [];

  if (remainingSquareBrackets.length > 0) {
    console.warn(
      "Unreplaced square bracket placeholders:",
      remainingSquareBrackets
    );
  }
  if (remainingCurlyBraces.length > 0) {
    console.warn("Unreplaced curly brace placeholders:", remainingCurlyBraces);
  }

  return emailBody;
}

/**
 * GET endpoint for testing
 */
export async function GET() {
  return NextResponse.json({
    message: "Lead processing API is running",
    endpoints: {
      POST: "/api/leads - Submit a new lead",
    },
    limits: {
      maxPartners: MAX_PARTNERS,
    },
  });
}
