
import { useRef, useState } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import {  TGoalProgress, } from '../../types';
import { ProgressBar } from './progress-bar';
import { TextInput } from './TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

export const GoalAccordion = ({values}:{values:TGoalProgress[]}) => {
    const [activeIndex,setActiveIndex] = useState(null);
    const handleItemClick = (index:number) =>{ setActiveIndex((prevIndex)=>(prevIndex === index)? null:index)}
    
return (
    <div className='w-2/5 mx-auto '>
        {values.map((item,index) => (
            <AccordianItem 
            key={index}
            header={`Week ${item.weekNumber + 1}`}
            content={item.feedback}
            completedAmount={item.completedAmount}
            targetAmount={item.targetAmount}
            isOpen = {activeIndex === index}
            onClick={()=>handleItemClick(index)}
            />
        ))}
    </div>
)
}



const AccordianItem = ({header,content,isOpen,completedAmount,targetAmount, onClick}:{header:string,content:string,isOpen:boolean,completedAmount:number,targetAmount:number,onClick:()=>void}) => {
    const contentHeight = useRef()
    const [progressInput,setProgressInput] = useState(content)
    const [feedbackInput,setFeedbackInput]= useState("")
    

    const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Hit submit, but this doesn't work yet")
      };

  return(
    <div className="wrapper border-b-2 border-black border-solid bg-slate-700 overflow-hidden " >
    <button className={`w-full text-left px-2 py-5 flex items-center justify-between font-medium text-xl bg-transparent border-none cursor-pointer ${isOpen ? 'active' : ''}`} onClick={onClick} >
     <p className='header-content'>{header}</p>
     <ProgressBar completedAmount={completedAmount} totalAmount={targetAmount} />
     <RiArrowDropDownLine className={`text-3xl ${isOpen ? 'active' : ''}`} /> 
    </button>
     <div ref={contentHeight} className="goal-container bg-slate-600 rounded-b-xl py-0 px-4" style={
          isOpen
          ? { height: contentHeight.current.scrollHeight,
                transition:"height .7s ease-in-out" }
          : { height: "0px" }
         }>
            <form className="flex flex-col" onSubmit={handleSubmit}>
            <TextInput labelText='Update Goal Progress' inputAttr={{
                name:"updateProgressInput",
                placeholder:"1",
                value:progressInput,
                type:'number',
                min:0,
                max:targetAmount,
                onChange:(e) => setProgressInput(e.target.value)
            }} />
               <TextInput labelText='Add Feedback' inputAttr={{
                name:"updateFeedbackInput",
                placeholder:"Add your weekly feedback here",
                value:feedbackInput,
                onChange:(e) => setFeedbackInput(e.target.value)
            }} />
            <button type="submit" disabled={false} className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40  hover:bg-slate-800 disabled:bg-gray-600">
          {"Submit "} <FontAwesomeIcon icon={faRightToBracket}/></button>
            </form>
           
      <p className="answer-content py-4 px-0 text-xl italic">{content}</p>
     </div>
   </div>
  )
}
