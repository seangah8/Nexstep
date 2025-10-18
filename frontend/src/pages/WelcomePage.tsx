import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { utilService } from "../services/util.service"
import { timelineActions } from "../store/actions/timeline.actions"

export function WelcomePage(){

    const navigation = useNavigate()

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [daysAmount, setDaysAmount] = useState<number>(100)
    const [page, setPage] = useState<number>(0)

    function onClickBack(){
        setPage(prev=>prev-1)
    }

    function onClickForward(){
        setPage(prev=>prev+1)
    }

    function handleChange({target} : {target: HTMLInputElement | HTMLTextAreaElement}) : void {
      let value : string | number =  target.value

      switch (target.name) {
        case 'title':
          setTitle(value)
          break
        case 'description':
          setDescription(value)
          break
        case 'days':
          setDaysAmount(Number(value))
          break
        case 'image':
        if(target instanceof HTMLInputElement) {
            utilService.uploadImgByInput(target).then((url) => {
                if (!url) return
                setImageUrl(url)
            })
        }
      }
    }

    async function onCreateNewTimeline(){
        await timelineActions.createTimeline(title, description, imageUrl, daysAmount)
        navigation('/timeline')
    }

    return(
        <section className='welcome-page'>

            {
                <div className="back-arrow" style={ page > 0 ? {visibility: 'visible'} : {visibility: 'hidden'}}>
                    <i className="fa-solid fa-circle-chevron-up" onClick={onClickBack}></i>
                </div>
            }

            <div className="context">

                {   page === 0 &&
                    <section className="page-0">
                        <h2>Welcome to Nextep</h2>
                        <h3>where your ambitions turn into action. Every step you take here brings you closer to the future you want.</h3>
                    </section>
                }

                {   page === 1 &&
                    <section className="page-1">
                        <h3>tell us about that thing you are trying to achive</h3>
                        <div className="inputs">

                            <div className="text-inputs">
                                <input 
                                    type="text"
                                    placeholder="Goal Title"
                                    value={title}
                                    name='title'
                                    onChange={handleChange}
                                />
                                <textarea 
                                    placeholder="Goal Description"
                                    value={description}
                                    name='description'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="image-input">
                                <label htmlFor="image">
                                    <div className="image-area">
                                        {imageUrl == null
                                         ? <i className="fa-solid fa-image"></i>
                                         : <img src={imageUrl} alt="goal-image"/>
                                        }
                                    </div>
                                </label>
                                <input
                                    id='image'
                                    type="file"
                                    onChange={handleChange}
                                    name="image"
                                    style={{display: 'none'}}
                                />
                            </div>

                        </div>
                        
                    </section>
                }

                {   page === 2 &&
                    <section className="page-2">
                        <span>You will conquer you goal in</span>
                        <input
                            type="number"
                            value={String(daysAmount)}
                            name="days"
                            onChange={handleChange}
                        />
                        <span>days.</span>
                    </section>
                }

            </div>

            {
                <div className="forward-arrow" style={ page < 2 ? {visibility: 'visible'} : {visibility: 'hidden'}}>
                    <i className="fa-solid fa-circle-chevron-down" onClick={onClickForward}></i>
                </div>
            }

            { page === 2 &&
                <div className="button-area">
                    <button 
                        className="create-button" 
                        disabled={title === '' || description === ''}
                        onClick={onCreateNewTimeline}
                    >
                        Create Timeline!
                    </button>
                </div>

            }

        </section>
    )
}