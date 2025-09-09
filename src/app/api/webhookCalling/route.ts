// import { NextResponse } from "next/server";
// import cron from "node-cron";
// import axios from "axios";

// type JobMap = { [key: string]: cron.ScheduledTask };
// const scheduledJobs: JobMap = {};

// export async function POST(req: Request) {
//     try {
//         const { webhookUrl, datetime } = await req.json();
//         if (!webhookUrl || !datetime) {
//             return NextResponse.json({ error: "Webhook URL and datetime are required" }, { status: 400 });
//         }

//         // Convert user input datetime into a Date object
//         const date = new Date(datetime); 
//         if (isNaN(date.getTime())) {
//             return NextResponse.json({ error: "Invalid datetime format. Use YYYY-MM-DD HH:mm" }, { status: 400 });
//         }

//         // Extract cron time components
//         const minute = date.getMinutes();
//         const hour = date.getHours();
//         const day = date.getDate();
//         const month = date.getMonth() + 1; // Months are 0-based in JS

//         // Construct cron expression: "minute hour day month *"
//         const cronTime = `${minute} ${hour} ${day} ${month} *`;

//         // Remove any existing job for the same webhook
//         if (scheduledJobs[webhookUrl]) {
//             scheduledJobs[webhookUrl].stop();
//             delete scheduledJobs[webhookUrl];
//         }

//         // Schedule the webhook call
//         const job = cron.schedule(cronTime, async () => {
//             try {
//                 await axios.post(webhookUrl);
//                 console.log(`Webhook triggered at ${datetime}:`, webhookUrl);
//             } catch (error:any) {
//                 console.error("Webhook failed:", error.message);
//             }
//         });

//         scheduledJobs[webhookUrl] = job;

//         return NextResponse.json({ message: `Webhook scheduled for ${datetime}!` });
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }