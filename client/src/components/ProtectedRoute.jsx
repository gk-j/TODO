import {redirect, Route} from 'react-router-dom'
import Cookies from "js-cookie"


const ProtectedRoute = props=>{
    const access_token = Cookies.get("access_token")
    if (access_token == undefined){
        return redirect("/")
    }
    return (
        <Route {...props}/>
      );

}

export default ProtectedRoute