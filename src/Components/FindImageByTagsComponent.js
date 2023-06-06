import React, {useState} from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI'

function FindImageByTagsComponent() {

    const [receivedImageUrls, setReceivedImageUrls] = useState([])
    const [tagsObject, setTagsObject] = useState([])

    const handleTagsSubmit = () => {
        CloudsnapApiService.findImagesByTags(tagsObject)
        .then((res) => {
            setReceivedImageUrls(res.data['S3_URLS'])
        }).catch((err)=> {
            console.log(err)
        })
    }

    const handleChange = (event) => {
        setTagsObject(event.target.value)    
    }

  return (
    <div className='bg-[#fde4cf] p-6 rounded-md'>

        <div className='flex-col space-y-4'>
            <p className='text-xl text-purple-500 text-left'>Enter Tags object</p>
            <textarea className='w-[600px] h-80' onChange={handleChange}></textarea>
            <div>
                <button className='bg-purple-400 rounded-md p-4 text-white' onClick={handleTagsSubmit}>Find Images</button>
            </div>
        </div>

        <div className='flex justify-center space-x-4 mt-4'>
                {receivedImageUrls.map((url, index) => (
                    <div className='h-80 w-80 p-4 flex justify-center' key={index}>
                        <img src={url} alt={`Image ${index}`} />
                    </div>
                ))}
        </div>
    </div>
  )
}

export default FindImageByTagsComponent