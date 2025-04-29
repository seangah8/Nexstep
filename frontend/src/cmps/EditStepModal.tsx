import { ChangeEvent, FormEvent, useState } from "react"
import { StepModel, editModalModel } from "../models/timeline.models"

interface EditStepModalProps{
    editModal : editModalModel
    allSteps : StepModel[]
    onUpdateSteps : (newSteps : StepModel[]) => void
    onUpdateEditModal : (newEditModal : editModalModel | null) => void
}

export function EditStepModal({ editModal, allSteps, onUpdateSteps, onUpdateEditModal } : EditStepModalProps){

    const [stepToEdit, setStepToEdit] = useState<editModalModel>(editModal)
    const preEnd = editModal.step.end

    function handleChange(event : ChangeEvent<HTMLInputElement>) : void{
        const endNumber = +event.target.value
        setStepToEdit({...stepToEdit, step: {...stepToEdit.step, end: endNumber}})
    }

    function onUpdateStep(event: FormEvent<HTMLFormElement>, newStepToEdit: editModalModel) : void{
        event.preventDefault()
        if(editModal){
            let newSteps = allSteps.map(step => 
                (step.id === stepToEdit.step.id) ? newStepToEdit.step : step)
            
            if(preEnd !== newStepToEdit.step.end)
                newSteps = changeChildrensEnd(newSteps, stepToEdit.step.id, (newStepToEdit.step.end-stepToEdit.start)/(preEnd-stepToEdit.start))

            onUpdateSteps(newSteps)
        }
        onUpdateEditModal(null)
    }

    function changeChildrensEnd(allSteps: StepModel[], changedStepId: string, ratio: number): StepModel[] {
        const updatedSteps = allSteps.map(step =>  ({...step})) //deep copy
      
        function updateChildren(parentId: string) {
          for (const step of updatedSteps) {
            if (step.parent === parentId) {
              step.end = Math.floor((step.end-stepToEdit.start)*ratio) + stepToEdit.start
              console.log('Updated Step', step)
              updateChildren(step.id)
            }
          }
        }
      
        updateChildren(changedStepId)

        return updatedSteps
    }
      

    return(
        <section className="edit-step-modal">
            <h3>Edit Step Modal Here</h3>

            <form onSubmit={event=>onUpdateStep(event, stepToEdit)}>
                <input type="number" value={stepToEdit.step.end} onChange={handleChange} name="end"/>
            </form>


        </section>
    )
}