import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Header(){
    const access_token = Cookies.get("accessToken")
    const [userDetails,setUserDetails] = useState({}) 
    const navigate = useNavigate()
    const signout = ()=>{
        Cookies.set("accessToken","")
        Cookies.set("refreshToken","")
        navigate("/")
    }
    useEffect(()=>{
        const headers = {'Authorization':Cookies.get("accessToken")}
        fetch("http://localhost:3000/user",{headers})
          .then(async(res)=>{
            const json = await res.json()
            setUserDetails(json.user)
          })
    },[])
    if(access_token){
        return(
            <div className="flex justify-between bg-slate-500">
                <h1 className="text-black-900 m-2">Welcome {userDetails.username}</h1>
                <button onClick={signout} className="m-2">SignOut</button>
            </div>
        )
    }
    return(
        null
    )
}