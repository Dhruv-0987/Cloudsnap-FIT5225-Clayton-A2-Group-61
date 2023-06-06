import React, {useState} from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI';

function UploadImage() {

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleImageSubmit = () => {
        CloudsnapApiService.uploadImage(selectedImage)
        .then((res) => {
            console.log(res.data)
        }).catch((err)=> {
            console.log(err)
        })
    }

  return (
    <div className='text-center'>
        <p className='text-2xl text-purple-500 text-center'>Image Upload</p>
        <div className='bg-[#fde4cf] p-4 m-2 rounded-md'>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleImageSubmit} className='bg-purple-400 p-2 
            rounded-md text-white'>Upload Image</button>
        </div>
    </div>
  )
}

export default UploadImage