import { ChangeEvent, FormEvent, useState } from "react"
import { StepModel, editModalModel } from "../models/timeline.models"

interface EditStepModalProps{
    editModal : editModalModel
    allSteps : StepModel[]
    onUpdateSteps : (newSteps : StepModel[], postEnd: number) => void
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
            
            if(preEnd !== newStepToEdit.step.end){
                newSteps = changeChildrenAndParantsEnd(
                    newSteps, 
                    stepToEdit.step, 
                    stepToEdit.start,
                    preEnd,
                    stepToEdit.start, // start not change
                    newStepToEdit.step.end
                )

                if(stepToEdit.nextStep){
                    newSteps = changeChildrenAndParantsEnd(
                        newSteps, 
                        stepToEdit.nextStep, 
                        preEnd,
                        stepToEdit.nextStep.end,
                        newStepToEdit.step.end,
                        stepToEdit.nextStep.end // end not change
                    )
                }
            }
                

            onUpdateSteps(newSteps, newStepToEdit.step.end)
        }
        onUpdateEditModal(null)
    }

    function changeChildrenAndParantsEnd(
        allSteps: StepModel[],
        changedStep: StepModel,
        preStart: number,
        preEnd: number,
        postStart: number,
        postEnd: number
      ): StepModel[] {

        const updatedSteps = allSteps.map(step => ({ ...step })) // deep copy
      
        function updateChildren(parent: StepModel) {
          const children = updatedSteps.filter(step => step.parentId === parent.id)
        
          for (const child of children) {
            // Recursively update this child's children first
            updateChildren(child)
        
            // Update this child's end
            child.end = Math.floor(
              postStart + ((postEnd - postStart) * (child.end - preStart)) / (preEnd - preStart)
            )
          }
        }

        function updateParents(changedStep : StepModel){
          const parent = updatedSteps.find(step=>step.id === changedStep.parentId)
          if(parent && preEnd === parent.end){
            parent.end = postEnd
            updateParents(parent)
          }
        }
        
        updateParents(changedStep)
        updateChildren(changedStep)
        // updateLastParents(changedStep)
      
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