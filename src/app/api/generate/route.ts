import { NextRequest, NextResponse } from 'next/server';
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// type for the input
interface RequestBody {
    input: string;
}

interface ResponseData {
    message: string;
    data?: RequestBody; 
  }


export async function POST(req:NextRequest){
    
       
  const {
    habitName,
    frequency,
    motivation, 
    obstacles,
  } = await req.json();
  const prompt = `
      You are an expert in habit formation based on *Atomic Habits* by James Clear. Generate a practical, personalized habit plan using the four laws: Make it Obvious, Make it Attractive, Make it Easy, and Make it Satisfying. Use this user data:
      - Habit: ${habitName || 'Not specified'}
      - Current Frequency: ${frequency || 'Not specified'}
      - Motivation Level: ${motivation || 'Not specified'}
      - Obstacles: ${obstacles || 'Not specified'}

      Infer reasonable suggestions for Preferred Time, Available Resources, and Reward if not provided, based on the habit, frequency, motivation, and obstacles. Provide actionable, specific recommendations tailored to the user's context, addressing obstacles and leveraging inferred details. Return ONLY a valid JSON object with keys: obvious, attractive, easy, satisfying, each containing a concise, realistic suggestion. Do not include any text outside the JSON object (e.g., no explanations or markdown).;
`;  
 
const result = await model.generateContent(prompt);
console.log(result.response.text())
const responeData:ResponseData ={
    message:"success",
    data:result.response.text()
}
return NextResponse.json(responeData)


}