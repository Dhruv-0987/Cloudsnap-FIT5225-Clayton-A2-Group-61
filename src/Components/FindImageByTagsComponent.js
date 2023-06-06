import React, {useState} from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI'

function FindImageByTagsComponent() {

    const [receivedImageUrls, setReceivedImageUrls] = useState([])
    const [tagsObject, setTagsObject] = useState([])
    const [displayMsg, setDisplayMsg] = useState(null)

    const handleTagsSubmit = () => {
        console.log(tagsObject)
        CloudsnapApiService.findImagesByTags(tagsObject)
        .then((res) => {
            setReceivedImageUrls(res.data['S3_URLS'])
            if (res.data['S3_URLS'].length === 0){
                setDisplayMsg("Sorry Image uploaded not clear enough or no similar images")
            }
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

        {displayMsg && <div className='m-2 mt-4 p-2'>
                    <p className='text-xl text-red-600'>{displayMsg}</p>
            </div>}
    </div>
  )
}

export default FindImageByTagsComponent