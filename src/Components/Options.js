import React, { useState } from 'react'

function Options({component: Component, buttonText}) {

    const [buttonClick, setButtonClick] = useState(false)

  return (
    <div className='flex justify-center p-5'>
        <div className='flex-col space-x-4 justify-center align-middle'>
            <button onClick={()=>{setButtonClick(!buttonClick)}} className='bg-purple-400 w-60 p-5 
            rounded-md text-white'>{buttonText}</button>
            <div className='mt-2'> {buttonClick && <Component/>} </div>
        </div>
    </div>
  )
}

export default Options