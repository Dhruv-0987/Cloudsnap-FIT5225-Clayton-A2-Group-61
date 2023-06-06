import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import DeleteTagsComponent from './Components/DeleteTagsComponent';
import FindImageByImageComponent from './Components/FindImageByImageComponent';
import Options from './Components/Options';
import FindImageByTagsComponent from './Components/FindImageByTagsComponent';
import UpdateTagsComponent from './Components/UpdateTagsComponent';
import UploadImage from './Components/UploadImage';

function App() {

  const componentData = [
    { component: UploadImage, buttonText: 'Upload Image' },
    { component: FindImageByTagsComponent, buttonText: 'Find Images By Tags' },
    { component: FindImageByImageComponent, buttonText: 'Find Images by Images' },
    { component: UpdateTagsComponent, buttonText: 'Update Tags' },
    { component: DeleteTagsComponent, buttonText: 'Delete Image and Tags' }
  ];

  return (
    <div className="App">
    <div className='bg-[#fde4cf] '>
      <p className='text-4xl text-purple-400 p-4'>Welcome To Yolo Image Detection</p>
    </div>
        <div className='flex-col space-x-2'>
          {componentData.map(({ component: Component, buttonText }, index) => (
            <Options key={index} component={Component} buttonText={buttonText} />
          ))}
        </div>
    </div>
  );
}

export default App;
