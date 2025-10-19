import { InfoForOpenAIModel, OpenAIPathsModel } from "../models/timeline.models"
import { httpService } from "./http.service"

export const openAIService = {
    openAITest,
    generateImageTest,
    generatePaths,
}

async function openAITest(): Promise<string> {
  return await httpService.get(`openai/test`)
}

async function generateImageTest() : Promise<string> {
  return await httpService.get(`openai/test-image`)
}

async function generatePaths(InfoForOpenAI: InfoForOpenAIModel): Promise<OpenAIPathsModel[]> {
  const paths = await httpService.post(`openai/paths`, InfoForOpenAI)
  return paths
}

