import Cookies from "js-cookie"
import { useState } from "react"

export default function TodoItem({todo}){
        const [checked,setChecked] = useState(todo.done)
        const [hide,setHide]=useState(false)
        const handleCompletion = async (id) =>{
            const headers = {'Authorization':Cookies.get("accessToken")}
            const response = await fetch(`http://localhost:3000/todo/${id}`,{method:"PUT",headers})
                if(response.status===200){
                    setChecked(!checked)
                }
        }
    
        const deleteTodo=async(id)=>{
            const headers = {'Authorization':Cookies.get("accessToken")}
            const response = await fetch(`http://localhost:3000/todo/${id}`,{method:"DELETE",headers})
            if(response.status===200){
                setHide(true)
            }
        }

    return(
        <div className={`text-red-800 flex flex-row justify-around m-3 items-center bg-neutral-500 w-1/2 ${hide?"hidden":""}`}>
            <h1 className="m-2">{todo?.name}</h1>
            <p>{todo.description}</p>
            <input 
              type="checkbox" 
              id={todo._id} 
              checked={checked} 
              onChange={()=>handleCompletion(todo._id)}
            />
            <button onClick={()=>deleteTodo(todo._id)}>delete</button>
        </div>
    )
}