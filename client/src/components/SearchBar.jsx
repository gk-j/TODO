import { useRef } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { filteredTodoListState, filteredTodoState, searchTextState} from "../store/atoms/atoms"

export default function SearchBar(){
    const searchRef = useRef("")
    const setSearchText = useSetRecoilState(searchTextState)
    const searchText = useRecoilValue(searchTextState)
    const filteredTodos = useRecoilValue(filteredTodoListState)
    const setFilteredTodos = useSetRecoilState(filteredTodoState)
    console.log(searchText)
    return(
        <div className="bg-red-100 border-2 p-2 m-2">
            <input type="text" ref={searchRef} className="border-2 border-black rounded-l" />
            <label className="ml-2" onClick={()=>{setSearchText(searchRef?.current?.value);setFilteredTodos(filteredTodos)}}>Search</label>
        </div>
    )
}