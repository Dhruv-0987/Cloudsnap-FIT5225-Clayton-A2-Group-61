import React, {useState} from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI'

function DeleteTagsComponent() {
    const [tagsObject, setTagsObject] = useState(null)
    const [displayMsg, setDisplayMsg] = useState(null)

    const handleChange = (event) => {
        setTagsObject(event.target.value)    
    }

    const handleTagsSubmit = () => {
        console.log(tagsObject)
        setDisplayMsg("")
        CloudsnapApiService.deleteTags(tagsObject)
        .then((res) => {
            setDisplayMsg(res.data)
        }).catch((err)=> {
            console.log(err)
        })
    }

  return (
    <div className='bg-[#fde4cf] p-6 rounded-md'>
        <p className='text-2xl text-purple-500 text-center'>Delete tags</p>
    
        <div className='flex-col space-y-4'>
            <p className='text-xl text-purple-500 text-left'>Enter Tags object</p>
            <textarea className='w-[600px] h-20' onChange={handleChange}></textarea>
            <div>
                <button className='bg-purple-400 rounded-md p-4 text-white' onClick={handleTagsSubmit}>Delete Tags</button>
            </div>
        </div>
        <p className='text-green-500 text-xl text-center'>{displayMsg}</p>
    </div>
  )
}

export default DeleteTagsComponent