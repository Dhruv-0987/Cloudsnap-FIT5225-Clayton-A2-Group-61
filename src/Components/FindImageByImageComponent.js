import React, { useState } from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI';

function FindImageByImageComponent() {

    const [selectedImage, setSelectedImage] = useState(null);
    const [receivedImageUrls, setReceivedImageUrls] = useState([])

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleImageSubmit = () => {
        CloudsnapApiService.findImagesByImage(selectedImage)
        .then((res) => {
            setReceivedImageUrls(res.data['S3_URLS'])
        }).catch((err)=> {
            console.log(err)
        })
    }

  return (
    <div>
        <div className='bg-[#fde4cf] p-4 m-6 rounded-md'>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleImageSubmit} className='bg-purple-400 p-2 
            rounded-md text-white'>Upload Image</button>

            <div className='flex justify-center space-x-4'>
                {receivedImageUrls.map((url, index) => (
                    <div className='h-80 w-80 p-4 flex justify-center' key={index}>
                        <img src={url} alt={`Image ${index}`} />
                    </div>
                ))}
            </div>
        </div>
        
    </div>
  )
}

export default FindImageByImageComponent