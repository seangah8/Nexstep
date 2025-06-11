import { FormEvent, useState } from "react"
import { StepModel, MainStepModel, editModalModel } from "../../models/timeline.models"
import { timelineService } from "../../services/timeline.service"

interface EditStepModalProps{
    editModal : editModalModel
    allSteps : StepModel[]
    onSetSteps : (newSteps : StepModel[]) => void
    onSetMainStep : (newSteps : MainStepModel) => void
    onSetMainStepEnd : (end : number) => void
    onSetEditModal : (newEditModal : editModalModel | null) => void
}

export function EditStepModal({ 
  editModal, 
  allSteps, 
  onSetSteps, 
  onSetMainStep, 
  onSetMainStepEnd, 
  onSetEditModal 

} : EditStepModalProps){

    const [stepToEdit, setStepToEdit] = useState<StepModel>(editModal.step)
    const [changeAllEnds, setChangeAllEnds] = useState<boolean>(false)

    function handleChange({target} : {target: HTMLInputElement | HTMLTextAreaElement}) : void {
      const field : string = target.name
      let value : string | number =  target.value

      switch (field) {
        case 'end':
          const date = new Date(value)
          value = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
          break
        case 'image':
          if(target instanceof HTMLInputElement) {
            const file = target.files?.[0]
            if (file) value = URL.createObjectURL(file);
          }
      }
      setStepToEdit(prev => ({ ...prev, [field]: value }))
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

          // if child is last make sure to update it parent's 
          // title, description, image, etc..
          if(!editModal.nextStep){
            newSteps = timelineService.updateParentsExceptEnd(
              newSteps, stepToEdit, stepToEdit, editModal.step.end)
          }

          // update last childrens of the changed step
          newSteps = timelineService.updateLastChildrensExceptEnd(
              newSteps, stepToEdit, stepToEdit, editModal.step.end)
          
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
      let newSteps = timelineService.deleteStep(allSteps, stepToDelete, editModal.today)

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

      // deleting last step zoom out to stepToDelete parent
      if(stepToDelete.id !== editModal.step.id){
        const parent = allSteps.find(step=> step.id === stepToDelete.parentId)
        if(parent) onSetMainStep({...parent, 
          start: timelineService.findParentStart(allSteps, parent, editModal.createTime)
        })
      }


    
      onSetSteps(newSteps)
      onSetEditModal(null)
    }
      

    return(
        <section className="edit-step-modal">
            <h3>Edit Step Modal</h3>

            <form onSubmit={onUpdateStep}>

              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={stepToEdit.title}
                onChange={handleChange}
                name="title"
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={stepToEdit.description}
                onChange={handleChange}
                name="description"
              />

              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="file"
                onChange={handleChange}
                name="image"
              />
              <img src={stepToEdit.image} alt="step's image"/>

              <label htmlFor="end">End Date</label>
              <input
                id="end"
                type="date"
                value={timelineService.formatDateFromEnd(stepToEdit.end)}
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
