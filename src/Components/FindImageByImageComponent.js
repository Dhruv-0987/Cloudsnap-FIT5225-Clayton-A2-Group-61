import React, { useState } from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI';

function FindImageByImageComponent() {

    const [selectedImage, setSelectedImage] = useState(null);
    const [receivedImageUrls, setReceivedImageUrls] = useState([])
    const [displayMsg, setDisplayMsg] = useState(null)

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleImageSubmit = () => {
        setDisplayMsg(null)
        CloudsnapApiService.findImagesByImage(selectedImage)
        .then((res) => {
            setReceivedImageUrls(res.data['S3_URLS'])
            if (res.data['S3_URLS'].length === 0){
                setDisplayMsg("Sorry Image uploaded not clear enough or no similar images")
            }
        }).catch((err)=> {
            console.log(err)
        })
    }

  return (
    <div>
        <div className='bg-[#fde4cf] p-4 m-6 rounded-md'>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleImageSubmit} className='bg-purple-400 p-2 
            rounded-md text-white'>Get Images</button>

            <div className='flex justify-center space-x-4'>
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
        
    </div>
  )
}

export default FindImageByImageComponent