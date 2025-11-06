import OpenAI from "openai"
import { AnswerModel, InfoForOpenAIModel, OpenAIPathsModel, StepModel } from "../../models/timeline.models"
import { utilService } from "../../services/util.service"

const OPEN_AI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const openAIService = {
    test,
    testImage,
    paths,
    insertImages,
}

async function test(): Promise<string> {
    const test = await OPEN_AI.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: "Say hello world!" }]
    })

    const content = test.choices[0].message?.content
    let answerStr = ''
    if( typeof content === "string")
        answerStr = content
    return answerStr
}


async function testImage() {
  const answer = await OPEN_AI.images.generate({
    model: "gpt-image-1-mini",
    prompt: "A minimal flat-style rocket icon launching",
    size: "1024x1024",
    n: 1,
    quality: "low"
  })

  const b64 = answer.data?.[0]?.b64_json
  if (!b64) throw new Error("No base64 image returned")
    
  const imageUrl = await utilService.uploadBase64Image(b64)
  console.log("✅ Cloudinary URL:", imageUrl)
  return imageUrl
}


// takes around 75 seconds
async function paths(infoForOpenAI: InfoForOpenAIModel): Promise<OpenAIPathsModel[]> {

  const completion = await OPEN_AI.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI mentor that generates possible development paths 
        for a user's goal. Each path must represent a different strategy or 
        approach to reaching the goal.`
      },
      {
        role: "user",
        content: `
          Here is the user's profile and preferences as JSON:
          ${JSON.stringify(infoForOpenAI)}

          Generate 3-6 possible paths. Each path must:

          - Have a **'title'** (1–3 words), **'description'**, and an **'icon'** property that contains a valid **inline SVG string**.  
          SVG RULES:
            • Must include: xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24".
            • The icon must visually match the main idea of the title — pick a simple symbol that best represents it (e.g., “science” → atom or flask, “space” → rocket, “government” → building, “learning” → book).
            • Output only the <svg> element.

            Example (rocket icon):
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"> <path d="M12 2C9 5 8 9 8 13l-2 2v3l3-1 2 2h2l2-2 3 1v-3l-2-2c0-4-1-8-4-11zM12 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/> </svg>

          - Contain a **'value'** array of 2 to 10 steps.  
          - Each step must include:  
            • **'title'**: 1–3 words only  
            • **'description'**:  
                - Must start with a verb in imperative form (e.g., "build...", "design...", "create...").  
                - Must describe a **clear, self-contained goal** achievable within the number of days. Avoid ongoing habits or open-ended instructions like "do X weekly".  
                - The goal must correspond to the time budget. For example, if a step has 60 days, describe a result that realistically takes ~60 days (e.g., "Apply to ~300 targeted roles and refine your materials based on feedback").  
                - If the step is the **final step**, its description must acknowledge the remaining time and describe how to use it *until the end of the plan* (e.g., "After shipping your portfolio, spend the remaining weeks applying and iterating until day ${infoForOpenAI.goal.days_to_complete}").

          - The total days of all steps in a path must not exceed ${infoForOpenAI.goal.days_to_complete-3} days total.
          - The two paths must represent clearly different strategies (e.g., conservative vs bold, solo vs collaborative).

          Do NOT include explanations, comments, or any text outside the JSON in your response.

          ⚠️ REQUIRED STRUCTURE:
          {
            "paths": [
              {
                "title": "...",
                "description": "...",
                "icon": "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' ... ></svg>",
                "value": [
                  { "title": "...", "description": "build a responsive website...", "days": 10 }
                ]
              }
            ]
          }
          `
      }
    ],
    response_format: { type: "json_object" }
  })

  const content = completion.choices[0].message?.content

  if (typeof content !== "string") 
    throw new Error("OpenAI did not return a string")

  const parsed = JSON.parse(content)

  if (!Array.isArray(parsed.paths))
    throw new Error("OpenAI did not return an array")

  return parsed.paths
}


// takes around 10-20 seconds
async function insertImages(steps: StepModel[]): Promise<StepModel[]> {

  const updatedSteps = await Promise.all(
    steps.map(async (step) => {

      const prompt = `
      Create an illustration for the following goal:
      Title: "${step.title}"
      Description: "${step.description}"
      
      STYLE RULES:
      • background must be dark gray, illustration must be bright red-pink gradient color.
      • No text or typography
      `
      

      const answer = await OPEN_AI.images.generate({
        model: "gpt-image-1-mini",
        prompt,
        size: "1024x1024",
        n: 1,
        quality: "low",
      })

      const b64 = answer.data?.[0]?.b64_json
      if (!b64) throw new Error(`No base64 image returned for step "${step.title}"`)

      const imageUrl = await utilService.uploadBase64Image(b64)
      return {...step, image: imageUrl }
    })
  )

  return updatedSteps
}

