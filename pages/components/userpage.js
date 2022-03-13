import { useEffect, useState } from "react"
import LoginSignup from './authentication'

const UserPage = () =>{

    const [data, setData] = useState([])

    const apiKey = '4e73e1dfa07d9055c678d3e4ad6ac341'

    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=4e73e1dfa07d9055c678d3e4ad6ac341&language=en-US&page=1`
    var options = {
        url: url,
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }

    const fetchMovie = async() =>{
        const response = await fetch(url, options)
        const data = await response.json()
        setData(data.results)
    }


    useEffect(() =>{
        fetchMovie()
    }, [])




    return (
        <>
            <div>
                <h1>{data.map((data) =>{
                    const {id, name, overview} = data;
                    return(
                        <div key={id}>
                            <p>{name}</p>
                            <p>{overview}</p>    
                        </div>
                    )
                })}</h1>
            </div>
        </>
    )
}

export default UserPage