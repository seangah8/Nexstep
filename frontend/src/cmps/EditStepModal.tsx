import { ChangeEvent, FormEvent, useState } from "react"
import { StepModel, editModalModel } from "../models/timeline.models"
import { timelineService } from "../services/timeline.service"

interface EditStepModalProps{
    editModal : editModalModel
    allSteps : StepModel[]
    onUpdateSteps : (newSteps : StepModel[]) => void
    onUpdateMainStepEnd : (end : number) => void
    onUpdateEditModal : (newEditModal : editModalModel | null) => void
}

export function EditStepModal({ editModal, allSteps, onUpdateSteps,onUpdateMainStepEnd, onUpdateEditModal } : EditStepModalProps){

    const [stepToEdit, setStepToEdit] = useState<StepModel>(editModal.step)

    function handleChange(event : ChangeEvent<HTMLInputElement>) : void{
        const endNumber = +event.target.value
        setStepToEdit({...stepToEdit, end: endNumber})
    }

    function onUpdateStep(event: FormEvent<HTMLFormElement>) : void{
        event.preventDefault()
        if(editModal){

        const changeAll = true

          // first change the step you edited
          let newSteps = allSteps.map(step => 
              (step.id === stepToEdit.id) ? stepToEdit : step)
          
          // when end is beening changed
          if(editModal.step.end !== stepToEdit.end){

            if(!changeAll)
                newSteps = timelineService.changeCurrantAndNextStepsEnd(editModal,newSteps,stepToEdit)
            else
                newSteps = timelineService.changeAllStepsEnd(editModal,newSteps,stepToEdit)

            // update the main step in case you changed the last step in it 
            // (so it wont get messy for not re-rendering it)
            if(!editModal.nextStep)
              onUpdateMainStepEnd(stepToEdit.end)
          }
          //update all steps with your changed
          onUpdateSteps(newSteps)
        }
        //close modal
        onUpdateEditModal(null)
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
                min={Math.max(editModal.start + 1, editModal.today)}
                max={editModal.nextStep?.end ?? Number.MAX_SAFE_INTEGER}
              />
              <button type="submit">Save</button>
            </form>


        </section>
    )
}