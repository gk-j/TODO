import { useRef } from "react"
import axios from "axios"
import Cookies from "js-cookie"

import { useSetRecoilState } from "recoil"
import { todoListState } from "../store/atoms/atoms"

const Todo = ()=>{
    const setTodos = useSetRecoilState(todoListState)
    
    const titleRef = useRef(null)
    const descriptionRef = useRef(null)

    const addTodo=async()=>{
        const name = titleRef?.current?.value
        const description = descriptionRef.current?.value
        const accessToken = Cookies.get("accessToken")
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };
        const response = await axios.post("http://localhost:3000/todos",{name,description},{headers})
        titleRef.current.value=""
        descriptionRef.current.value=""
        setTodos(response.data.todos)
    }
    return(
        <div>
            <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col justify-center items-center text-white bg-opacity-80 rounded-md">
                <input 
                  type="text" 
                  placeholder="title" 
                  ref={titleRef} 
                  className="p-4 my-2 bg-gray-700 rounded-md"/>
                <input 
                  type="text" 
                  placeholder="description" 
                  ref={descriptionRef}
                  className="p-4 my-2 bg-gray-700 rounded-md"/>
                  <button type="submit" onClick={addTodo} className="items-start w-1/9 text-red-800 border-2 border-red-900 bg-white p-3 rounded-md  hover:bg-gray-400 hover:text-white hover:border-zinc-950">Add</button>
            </form>   
        </div>
    )
}


export default Todo