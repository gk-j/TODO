import {atom, selector} from "recoil"

export const todoListState = atom({
    key:"TodoList",
    default:[]
})



export const searchTextState = atom({
    key:"SearchText",
    default:""
})

export const filteredTodoState = atom({
    key:"FilteredTodo",
    default:[]
})

export const filteredTodoListState = selector({
    key:"FilteredTodoList",
    get:({get})=>{
        const todos = get(todoListState)
        const searchText = get(searchTextState)

        const filteredTodos = todos.filter((eachTodo)=>eachTodo.name.includes(searchText))
        return filteredTodos
    }
})