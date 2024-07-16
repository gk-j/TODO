import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BG_IMG } from "../constants/constants"
// import useSignup from "../hooks/useSignup"
import axios from "axios"
import Cookies from "js-cookie"
const Login = () =>{

    const [isLoginForm,setIsLoginForm]=useState(true)
    // const [errMsg,setErrMsg] = useState("")

    const navigate = useNavigate()

    const fullNameRef = useRef(null)
    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const passwordRef= useRef(null)

    
    const toggleForm = () =>{
        setIsLoginForm(!isLoginForm)
    }
    
    const handleButtonClick = () =>{
        const username = usernameRef?.current?.value || "";
        const fullName = fullNameRef?.current?.value|| "";
        const email = emailRef?.current?.value || "";
        const password = passwordRef?.current?.value || "";
        
        if(!isLoginForm){
            //signup
            
            const signUp = async()=>{
                try {
                    const data = await axios.post('http://localhost:3000/user/signup/',{username,fullName,email,password})
                    console.log(data.data)
                    setIsLoginForm(true)
                } catch (error) {
                    console.log(error)
                }
                
            }
            signUp()
        }else{
            //signin
            const signIn = async()=>{
                try {
                    const data = await axios.post('http://localhost:3000/user/signin/',{username:"",email,password})
                    Cookies.set('accessToken', data.data.accessToken,{expires:10000});
                    Cookies.set('refreshToken', data.data.refreshToken,{expires:1000000});
                    // setIsLoginForm(true)
                    navigate("/home")
                } catch (error) {
                    console.log(error)
                }
                
            }
            signIn()
        }
    }

    

    

    return(
        <div>
            <div className="absolute">
                <img className="h-screen w-screen" src={BG_IMG} alt="bg"/>
                {/* <button onClick={async()=>{const response = await axios.get("http://localhost:3000/");console.log(response.data)}}>Hi</button> */}
            </div>
            <form onSubmit={(e)=>e.preventDefault()} className="absolute my-36 p-12 bg-black w-full md:w-4/12 mx-auto left-0 right-0 text-white bg-opacity-80 rounded-sm">
                <h1 className="font-bold text-3xl py-4">{isLoginForm?"Sign In":"Sign Up"}</h1>
                {!isLoginForm?<input 
                  ref={fullNameRef}  
                  type="text" 
                  placeholder="Full Name" 
                  className="p-4 my-2 w-full bg-gray-700 rounded-sm"/>:""}
                  {!isLoginForm?<input 
                  ref={usernameRef}
                  type="username" 
                  placeholder="User Name" 
                  className="p-4 my-2 w-full bg-gray-700 rounded-sm "/>:""}
                <input 
                  ref={emailRef}  
                  type="text" 
                  placeholder="Email Address" 
                  className="p-4 my-2 w-full bg-gray-700 rounded-sm"/>
                <input 
                  ref={passwordRef}
                  type="password" 
                  placeholder="Password" 
                  className="p-4 my-2 w-full bg-gray-700 rounded-sm "/>
                <p className="text-red-900">{"errMsg"}</p>
                <button className="p-4 my-4 bg-red-600 w-full rounded-md" onClick={handleButtonClick}> {isLoginForm?"Signin":"Signup"}</button>
                {!isLoginForm?<p>Already Registered? <span onClick={toggleForm} className="cursor-pointer">Sign In Now</span></p>:<p>New to Website? <span onClick={toggleForm} className="cursor-pointer">Sign Up Now</span></p>}
            </form> 
        
        </div>
    )
}

export default Login