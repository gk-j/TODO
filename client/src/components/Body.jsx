import { BrowserRouter, Route,Routes} from "react-router-dom"
import Login from "./Login"
import Home from "./Home"
// import ProtectedRoute from "./ProtectedRoute"

const Body=()=>{

    
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Body