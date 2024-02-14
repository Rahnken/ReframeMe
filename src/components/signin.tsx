
import { capitalize } from "../utils/stringUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";
import { SignInRequest, signInUser } from "../api/auth";
import { useMutation} from "@tanstack/react-query";
import { TextInput } from "./TextInput";
import { useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import {useNavigate} from '@tanstack/react-router'

export const SignIn = () => {

 
  // This state will likely live elsewhere , just getting this setup for local work for now 
  const [username,setUsername] = useState("") ;
  const [password,setPassword] = useState(""); 
  const [serverMessage, setServerMessage] = useState(""); // Use this state to hold server messages
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["signInUser"],
    mutationFn: (body:SignInRequest) => signInUser(body),
    onSuccess: (data) => {
      // Handle success state, e.g., navigate to a different page or show success message
     navigate({to:'/dashboard',})
    },
    onError: (error) => {
      // Handle error state, e.g., show error message from server
      setServerMessage(error.response?.data?.message || "An error occurred");
    },
  });

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage(""); // Clear previous messages
    const requestBody:SignInRequest = {username,password}
    mutation.mutate(requestBody);
  };
  
  return (
    <div className=" flex flex-col content-center">
      <img
        src="/ReframeMe_logo.svg"
        className="w-128 my-5 self-center"
        alt="Reframe Me Logo"
      />
        {serverMessage && <div>{serverMessage}</div>}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col items-center"
        >
          <TextInput labelText={"Username"} inputAttr={{
            name:"username",
            placeholder:"username",
            value:username,
            onChange: (e) => setUsername(e.target.value),
          }}/>
          <ErrorMessage message={"Username is required..."} show={true}/>
       
          <TextInput labelText={"Password"} inputAttr={{
            name:"password",
            placeholder:"password",
            type:"password",
            value:password,
            onChange: (e) => setPassword(e.target.value),
          }}/>
          <ErrorMessage message={"Password is required..."} show={true}/>

          <button type="submit"  className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40 hover:bg-slate-800 disabled:bg-gray-600">
          {"Login"}{" "} <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />{" "}
          </button>
        </form>
     </div>
  );
};
