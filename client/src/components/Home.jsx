import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Todo from "./Todo";
import TodosList from "./TodosList";
import SearchBar from "./SearchBar";

export default function Home(){
    
    const access_token = Cookies.get("accessToken");
    const navigate = useNavigate()
    
    useEffect(() => {
        if (access_token === undefined || access_token === "") {
            // Redirect to "/"
            navigate("/");
        }
    }, [access_token, navigate]);
    if(access_token === undefined || access_token===""){
        // Redirect to "/"
        // navigate("/")       // Optional: Return null or some loading indicator
        return null
    }
    return(
        <div>
            <Header/>
            <div className="h-full bg-black">
                <Todo/>
                <SearchBar/>
                <TodosList/>
            </div>
        </div>
    );
}
