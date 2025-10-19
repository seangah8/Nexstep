import OpenAI from "openai"
import { AnswerModel, InfoForOpenAIModel, OpenAIPathsModel } from "../../models/timeline.models"
import { utilService } from "../../services/util.service"

const OPEN_AI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const openAIService = {
    test,
    testImage,
    paths,
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

  const b64 = answer.data? answer.data[0]?.b64_json : undefined
  if (!b64) throw new Error("No base64 image returned")
    
  const [url] = await utilService.uploadBase64Images([b64])
  console.log("✅ Cloudinary URL:", url)
  return url
}






async function paths(infoForOpenAI: InfoForOpenAIModel): Promise<OpenAIPathsModel[]> {

  const completion = await OPEN_AI.chat.completions.create({
    model: "gpt-5",
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
          ${JSON.stringify(infoForOpenAI, null, 2)}

          Generate 2 possible paths. Each path must:

          - Have a **'title'** (1–3 words), **'description'**, and an **'icon'** property that contains a valid **inline SVG string**.  
            ⚠️ Icon requirements:
              • Must use a single color (no gradients or multiple colors).  
              • Must have **no background** (transparent background).  
              • Must include xmlns, width, height, and viewBox attributes.  
              • Must be **exactly** \`width="40"\` and \`height="40"\`.  
              • Must be self-contained and optimized (<15 elements).  
              • Should visually represent the mood/theme of the path.

          - Contain a **'value'** array of 1 to 4 steps.  
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
