import { useEffect, useState } from "react"
import Cookies from "js-cookie"

const useGetTodos=()=>{
    const [todos,setTodos] = useState([])
    useEffect(()=>{
        const headers = {'Authorization':Cookies.get("accessToken")}
        fetch('http://localhost:3000/todos',{headers})
        .then(async (res)=>{
            const json = await res.json();
            setTodos(json.todos)
        })
    },[])
    return todos
}

export default useGetTodos