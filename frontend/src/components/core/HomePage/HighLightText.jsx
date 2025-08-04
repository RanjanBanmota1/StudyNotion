import React from 'react'

const HighLightText = ({text}) => {
  return (
    
    <span className='font-bold bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]) text-transparent bg-clip-text'>
        {" "}
        {text}
        <br />
        {" "}
    </span>
    
  )
}

export default HighLightText
