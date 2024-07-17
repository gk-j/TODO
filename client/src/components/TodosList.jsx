import { useEffect } from "react"
import Cookies from "js-cookie"
import TodoItem from "./TodoItem"
import { useRecoilState, useRecoilValue } from "recoil"
import { filteredTodoState, searchTextState, todoListState } from "../store/atoms/atoms"
const TodosList = () =>{
    const [todos,setTodos] = useRecoilState(todoListState)
    const filteredTodos = useRecoilValue(filteredTodoState)
    const searchText = useRecoilValue(searchTextState)
    console.log(filteredTodos)


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
        <div className="border-2 border-cyan-200 mt-4 pt-4">
            <h1 className="text-center font-black text-lg">Your Todos</h1>
            {searchText===""?
            <div className="flex flex-col justify-center items-center">
                {todos.length>0?todos.map((eachTodo)=><TodoItem todo={eachTodo} key={eachTodo._id}/>):""}
            </div>
            :
            <div className="flex flex-col justify-center items-center">
                {filteredTodos.length===0?<h1 className="text-white">No Todos Found</h1>:filteredTodos.map((eachTodo)=><TodoItem todo={eachTodo} key={eachTodo._id}/>)}
            </div>
            }
        </div>
    )
}

export default TodosList