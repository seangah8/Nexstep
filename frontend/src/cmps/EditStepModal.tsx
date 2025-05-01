import { ChangeEvent, FormEvent, useState } from "react"
import { StepModel, editModalModel } from "../models/timeline.models"

interface EditStepModalProps{
    editModal : editModalModel
    allSteps : StepModel[]
    onUpdateSteps : (newSteps : StepModel[]) => void
    onUpdateMainStepEnd : (end : number) => void
    onUpdateEditModal : (newEditModal : editModalModel | null) => void
}

export function EditStepModal({ editModal, allSteps, onUpdateSteps,onUpdateMainStepEnd, onUpdateEditModal } : EditStepModalProps){

    const [stepToEdit, setStepToEdit] = useState<StepModel>(editModal.step)
    const preEnd = editModal.step.end

    function handleChange(event : ChangeEvent<HTMLInputElement>) : void{
        const endNumber = +event.target.value
        setStepToEdit({...stepToEdit, end: endNumber})
    }

    function onUpdateStep(event: FormEvent<HTMLFormElement>) : void{
        event.preventDefault()
        if(editModal){

          let newSteps = allSteps.map(step => 
              (step.id === stepToEdit.id) ? stepToEdit : step)
          
          // when end is beening changed
          if(preEnd !== stepToEdit.end){

            if((editModal.nextStep && (stepToEdit.end >= editModal.nextStep.end)) || (stepToEdit.end <= editModal.start))
              throw new Error('cant change step end beyond boundries')
            
            newSteps = changeChildrenAndParantsEnd(
                newSteps, 
                stepToEdit, 
                editModal.start,
                preEnd,
                editModal.start, // start not change
                stepToEdit.end
            )

            if(editModal.nextStep){
                newSteps = changeChildrenAndParantsEnd(
                    newSteps, 
                    editModal.nextStep, 
                    preEnd,
                    editModal.nextStep.end,
                    stepToEdit.end,
                    editModal.nextStep.end // end not change
                )
            } 


            if(!editModal.nextStep)
              onUpdateMainStepEnd(stepToEdit.end)
          }
                
          onUpdateSteps(newSteps)

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
            updateChildren(child)
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

            <form onSubmit={event=>onUpdateStep(event)}>
                <input type="number" value={stepToEdit.end} onChange={handleChange} name="end"/>
            </form>


        </section>
    )
}