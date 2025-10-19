import { Request, Response } from 'express'
import { loggerService } from "../../services/logger.service";
import { openAIService } from './openai.service';
import { InfoForOpenAIModel, StepModel } from '../../models/timeline.models';



export async function openAITest(req: Request, res: Response): Promise<void> {
  try {
    const answer : string = await openAIService.test()
    res.send(answer)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't test open ai`)
  }
}

export async function generateImageTest(req: Request, res: Response): Promise<void> {
  try {
    const answer : string  = await openAIService.testImage()
    res.send(answer)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't generate image`)
  }
}


export async function generatePaths(req: Request<{}, {}, InfoForOpenAIModel>, res: Response): Promise<void> {
  try {
    const infoForOpenAI : InfoForOpenAIModel = req.body
    const answer = await openAIService.paths(infoForOpenAI)
    res.json(answer)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't generate paths`)
  }
}


export async function generateStepsImages(req: Request<{}, {}, StepModel[]>, res: Response): Promise<void> {
  try {
    const steps : StepModel[] = req.body
    const answer = await openAIService.insertImages(steps)
    res.json(answer)
  } catch (err: any) {
    loggerService.error(err.message)
    res.status(400).send(`Couldn't insert inages`)
  }
}


