import Link from "next/link"


const Footer = () =>{
    return(
        <>
        <div className="mx-10 py-5 border-t-2 border-gray-400 flex justify-between items-center">
            <div>
                <Link href='./support'>
                <p className="cursor-pointer underline mb-2 font-light"> Series Purge - Support</p>
                </Link>
                
                <h1 className="text-base">Information</h1>
                <p className="font-thin text-sm">This product uses the TMDB API but is not endorsed or certified by TMDB</p>
                <img className="w-16 mt-3" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" alt='TMDB Logo' />
            </div>
            <div className='flex justify-center font-'>
                <h1 className="font-thin">Designed and built by the team at <span className="font-bold">SERIES PURGE</span> </h1>
            </div>
        </div>
        </>
    )
}

export default Footer