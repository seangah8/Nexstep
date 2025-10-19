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


// takes around 30-60 seconds
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
SVG rules:
  • Must include: xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24".
  • Use only basic shapes: <path>, <circle>, <rect>, <line>, or <polygon>.  
  • Use only **stroke** and **fill="none"** (no gradients, no multiple colors, no text).  
  • Keep it under **10 elements** total.
  • Style: minimal, flat, icon-like — similar to [Lucide](https://lucide.dev/icons/) or [Feather Icons](https://feathericons.com/).
  • Example (rocket icon):
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2 2 4 6 4 9 0 3-2 7-4 9-2-2-4-6-4-9 0-3 2-7 4-9z"/><circle cx="12" cy="9" r="1.5"/><path d="M8 13l-3 2M16 13l3 2"/><path d="M12 20v2"/></svg>'

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
        Minimal flat illustration representing the following goal:
        Title: "${step.title}"
        Description: "${step.description}"
        Style: flat icon, simple background, no text, soft colors, clear symbolism.
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

