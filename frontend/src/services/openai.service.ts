import { InfoForOpenAIModel, OpenAIPathsModel, StepModel } from "../models/timeline.models"
import { httpService } from "./http.service"

export const openAIService = {
    openAITest,
    generateImageTest,
    generatePaths,
    InsertStepsImages,
}

async function openAITest(): Promise<string> {
  return await httpService.get(`openai/test`)
}

async function generateImageTest() : Promise<string> {
  return await httpService.get(`openai/test-image`)
}

async function generatePaths(InfoForOpenAI: InfoForOpenAIModel): Promise<OpenAIPathsModel[]> {
  const paths : OpenAIPathsModel[] = await httpService.post(`openai/paths`, InfoForOpenAI)
  return paths
}

async function InsertStepsImages(steps: StepModel[]): Promise<StepModel[]> {
  const updatedSteps : StepModel[] = await httpService.post(`openai/steps-images`, steps)
  return updatedSteps
}

