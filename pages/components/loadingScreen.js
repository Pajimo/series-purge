import { useEffect, useState } from "react"

const Loading = ({setIsLoading}) =>{
    const load = () =>{
        setIsLoading(false)
    }

    useEffect(() =>{
      setTimeout(load, 3000)  
    }, [])
    return(
        <>
            <div>Loading....</div>
        </>
    )
}

export default Loading