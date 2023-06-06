import React, {useState} from 'react'
import CloudsnapApiService from '../ObjectDetectionAPIs/CloudsnapAPI';

function UploadImage() {

    const [selectedImage, setSelectedImage] = useState(null);
    const [displayMsg, setDisplayMsg] = useState(null)

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleImageSubmit = () => {
        CloudsnapApiService.uploadImage(selectedImage)
        .then((res) => {
            setDisplayMsg("Image uploaded successfully - tags generated and stored")
            console.log(res.data)
        }).catch((err)=> {
            console.log(err)
        })
    }

  return (
    <div className='text-center bg-[#fde4cf] rounded-md'>
        <p className='text-2xl text-purple-500 text-center'>Image Upload</p>
        <div className=' p-4 m-2 '>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleImageSubmit} className='bg-purple-400 p-2 
            rounded-md text-white'>Upload Image</button>
        </div>

        {displayMsg && <div className='m-2 mt-2 p-2'>
                    <p className='text-xl text-green-700'>{displayMsg}</p>
            </div>}
    </div>
  )
}

export default UploadImage