import { useContext, useEffect } from "react"
import Cookies from "js-cookie"
import { TodoContext } from "../context"
import TodoItem from "./TodoItem"
const TodosList = () =>{
    const {todos,setTodos}= useContext(TodoContext)
    useEffect(()=>{
        const headers = {'Authorization':Cookies.get("accessToken")}
        fetch('http://localhost:3000/todos',{headers})
        .then(async (res)=>{
            const json = await res.json();
            console.log(json.todos)
            setTodos(json.todos)
        })
    },[])
    return(
    <div className="flex flex-col justify-center items-center">
        {todos.length>0?todos.map((eachTodo)=><TodoItem todo={eachTodo} key={eachTodo._id}/>):""}
    </div>
    )
}

export default TodosList