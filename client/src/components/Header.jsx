import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

export default function Header(){
    const access_token = Cookies.get("accessToken")
    const navigate = useNavigate()
    const signout = ()=>{
        Cookies.set("accessToken","")
        Cookies.set("refreshToken","")
        navigate("/")
    }
    if(access_token){
        return(
            <div className="flex justify-end">
                <button onClick={signout} className="m-2">SignOut</button>
            </div>
        )
    }
    return(
        null
    )
}