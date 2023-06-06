import React, {useState} from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI'

function UpdateTagsComponent() {

    const [tagsObject, setTagsObject] = useState(null)
    const [displayMsg, setDisplayMsg] = useState(null)

    const handleChange = (event) => {
        setTagsObject(event.target.value)    
    }

    const handleTagsSubmit = () => {
        setDisplayMsg("")
        CloudsnapApiService.updateTags(tagsObject)
        .then((res) => {
            setDisplayMsg(res.data.message)
        }).catch((err)=> {
            console.log(err)
        })
    }

  return (
    <div className='bg-[#fde4cf] p-6 rounded-md'>
        <p className='text-2xl text-purple-500 text-center'>Update Tags</p>
        <div className='flex-col space-y-4'>
            <p className='text-xl text-purple-500 text-left'>Enter Tags object</p>
            <textarea className='w-[600px] h-80' onChange={handleChange}></textarea>
            <div>
                <button className='bg-purple-400 rounded-md p-4 text-white' onClick={handleTagsSubmit}>Update Tags</button>
            </div>
        </div>
        <p className='text-green-500 text-xl text-center'>{displayMsg}</p>
    </div>
  )
}

export default UpdateTagsComponent