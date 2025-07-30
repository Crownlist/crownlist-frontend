import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const UserLayout = ({children} : {children: React.ReactNode} ) =>{
    const {userData} = useSelector((state: RootState)=> state.userData);
    console.log('data', userData)
    return(
       <>
         {children}
       </>
    )
}

export default UserLayout;