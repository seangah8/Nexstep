import { ChangeEvent, FormEvent, useState } from "react"
import { StepModel, editModalModel } from "../models/timeline.models"
import { timelineService } from "../services/timeline.service"

interface EditStepModalProps{
    editModal : editModalModel
    allSteps : StepModel[]
    onSetSteps : (newSteps : StepModel[]) => void
    onSetMainStepEnd : (end : number) => void
    onSetEditModal : (newEditModal : editModalModel | null) => void
}

export function EditStepModal({ editModal, allSteps, onSetSteps, onSetMainStepEnd, onSetEditModal } : EditStepModalProps){

    const [stepToEdit, setStepToEdit] = useState<StepModel>(editModal.step)
    const [changeAllEnds, setChangeAllEnds] = useState<boolean>(false)

    function handleChange(event : ChangeEvent<HTMLInputElement>) : void{
        const endNumber = +event.target.value
        setStepToEdit({...stepToEdit, end: endNumber})
    }

    function onUpdateStep(event: FormEvent<HTMLFormElement>) : void{
        event.preventDefault()
        if(editModal){

          // first change the step you edited
          let newSteps = allSteps.map(step => 
            (step.id === stepToEdit.id) 
            ? stepToEdit
            : step
          )
          
          // when end is beening changed
          if(editModal.step.end !== stepToEdit.end){

            if(!changeAllEnds && 
                (stepToEdit.end < Math.max(editModal.start + 1, editModal.today) ||
                editModal.nextStep && (stepToEdit.end > editModal.nextStep.end))
            ) throw new Error('cant end this step at that time')

            // if chaned step is last in main
            if(!editModal.nextStep){
              // prevent from step end to get over next parent start
              newSteps = newSteps.map(step=> {
                if (step.id === stepToEdit.id){
                  const maxPossibleEnd = timelineService.findStepTotalMaxEnd(allSteps, step)
                  const newStepToEdit = {...stepToEdit, end: Math.min(stepToEdit.end, maxPossibleEnd)}
                  return newStepToEdit
                }
                else return step
              })
            }

            if(!changeAllEnds)
                newSteps = timelineService.changeCurrantAndNextStepsEnd(
                    editModal.start,
                    editModal.step.end,
                    editModal.today,
                    newSteps,
                    stepToEdit,
                    editModal.nextStep,
                )
            else
                newSteps = timelineService.changeAllStepsEnd(
                    editModal.step.end,
                    editModal.today,
                    newSteps,
                    stepToEdit,
                    editModal.nextStep,
                    editModal.createTime
                )

            // update the main step in case you changed the last step in it 
            // (so it wont get messy for not re-rendering it)
            if(!editModal.nextStep){
              const changedStep = newSteps.find(step=>step.id===stepToEdit.id)
              onSetMainStepEnd(changedStep?.end ?? stepToEdit.end)
            }
          }
          //update all steps with your changed
          onSetSteps(newSteps)
        }
        //close modal
        onSetEditModal(null)
    }  

    function onDeleteStep(){

      // if the step is last in main dlete the fater and bring the user back
      const stepToDelete = timelineService.findRightStepToDelete(allSteps, editModal.step)

      // deleting the step
      let newSteps = timelineService.deleteStep(allSteps, stepToDelete.id)

      // ajust next step children
      if(editModal.nextStep){

        newSteps = timelineService.changeChildrenAndParentsEnd(
          newSteps,
          editModal.nextStep,
          editModal.step.end,
          editModal.nextStep.end,
          editModal.start,
          editModal.nextStep.end,
          editModal.today,
          editModal.start < editModal.today
        )
      }
    
      onSetSteps(newSteps)
      onSetEditModal(null)
    }
      

    return(
        <section className="edit-step-modal">
            <h3>Edit Step Modal</h3>

            <form onSubmit={onUpdateStep}>

              <label htmlFor="end">End Time</label>
              <input
                id="end"
                type="number"
                value={stepToEdit.end}
                onChange={handleChange}
                name="end"
              />

              <label htmlFor="change-all">Change All</label>
              <input
                id="change-all"
                type="checkbox"
                checked={changeAllEnds}
                onChange={()=>setChangeAllEnds(prev=>!prev)}
                name="change-all"
              />



              <button type="submit">Save</button>
              <button onClick={onDeleteStep}>Delete</button>
            </form>


        </section>
    )
}
