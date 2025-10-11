import { FormEvent, useEffect, useState } from "react"
import { StepModel, MainStepModel, EditModalModel } from "../../models/timeline.models"
import { timelineService } from "../../services/timeline.service"
import { utilService } from "../../services/util.service"

interface EditStepModalProps{
    editModal : EditModalModel
    allSteps : StepModel[]
    isMentorOpen : boolean
    onSetSteps : (newSteps : StepModel[]) => void
    onSetMainStep : (newSteps : MainStepModel) => void
    onSetMainStepEnd : (end : number) => void
    onSetEditModal : (newEditModal : EditModalModel | null) => void
}

export function EditStepModal({ 
  editModal, 
  allSteps, 
  isMentorOpen,
  onSetSteps, 
  onSetMainStep, 
  onSetMainStepEnd, 
  onSetEditModal 

} : EditStepModalProps){

    const [stepToEdit, setStepToEdit] = useState<StepModel>(editModal.step)
    const [changeAllEnds, setChangeAllEnds] = useState<boolean>(false)

    useEffect(()=>{
      setStepToEdit(editModal.step)
    },[editModal])

    useEffect(()=>{
      if(isMentorOpen)
        onSetEditModal(null)
    },[isMentorOpen])

    // after dragging step - update edit step due
    useEffect(()=>{
      const updatedStep = allSteps.find(step => step.id === stepToEdit.id)
      if(updatedStep && updatedStep.end !== stepToEdit.end)
        setStepToEdit({...stepToEdit, end: updatedStep.end})
    },[allSteps])

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
            utilService.uploadImgByInput(target).then((url) => {
              if (!url) return
              setStepToEdit(prev => ({...prev,image: url,}))
            })
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


            const parent = allSteps.find(step=>step.id === stepToEdit.parentId) 
            // when unvalid end
            if(

              // when changing one step
              (!changeAllEnds && 
                (stepToEdit.end < Math.max(editModal.start + 1, editModal.today) ||
                editModal.nextStep && (stepToEdit.end >= editModal.nextStep.end))
              ) ||
              // when changing all steps
              (changeAllEnds && parent && 
                ((stepToEdit.end < editModal.today) ||
                stepToEdit.end >= parent.end)
              )

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

          <button className="exit-button" onClick={()=>onSetEditModal(null)}>
            X
          </button>

          <form onSubmit={onUpdateStep}>

            <label htmlFor="image" className="image-area">
              <img src={stepToEdit.image} alt="step's image"/>
            </label>
            <input
              id="image"
              type="file"
              onChange={handleChange}
              name="image"
              style={{display: 'none'}}
            />

            <input
              id="title"
              type="text"
              value={stepToEdit.title}
              onChange={handleChange}
              name="title"
              placeholder="Title"
            />

            <textarea
              id="description"
              value={stepToEdit.description}
              onChange={handleChange}
              name="description"
              placeholder="Description"
            />

            <div className="date-area">

                <label htmlFor="end">Due </label>
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
            </div>

            <div className="buttons-area">
              <button type="submit">Save</button>
              <button className="delete-button" onClick={onDeleteStep}>Delete</button>
            </div>


          </form>
        </section>
    )
}
