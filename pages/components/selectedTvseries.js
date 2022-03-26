import { useState, useEffect } from "react"
import AddToList from "./addToList"
import RemoveShow from "./removeFromList"
import moment from 'moment';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SeasonInfo from './seasonInfo'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/router";
import { RWebShare } from "react-web-share";
import {
    LinkedinIcon,
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    TwitterIcon,
    FacebookIcon,
    EmailIcon,
    WhatsappIcon,
    PinterestIcon,
  } from "react-share";


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Loading from './loadingScreen';


// export async function getServerSideProps() {
//     var options = {
//         method: 'GET',
//         headers:{
//         'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
//         'Content-Type': 'application/json'
//         }
//     }

//     const finalUrl = url+ selectedSeriesID+ '/videos' + apiKey

//         const apiKey = "?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"
//         const url = "https://api.themoviedb.org/3/tv/"
//         const response = await fetch(finalUrl, options);
//         const video = await response.json()
//         //setSelectedVideo(video.results)
//     return {
//       props: {
//         video
//       }
//     }
//   }


const SelectedTvseries = ({setMyListTvseries, closeParticularSeries, showSelected, selectedSeriesID, myListTvseries}) =>{

    const auth = getAuth()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const baseUrl = `https://api.themoviedb.org/3`

    const [selectedTvseriesInfo, setSelectedTvseriesInfo] = useState([])
    const [nextEpisode, setNextEpisode] = useState([])
    const [genres, setGenres] = useState([])
    const [seasons, setSeasons] = useState([])
    const [eachSeason, setEachSeason] = useState('')
    const [eachSeasonId, setEachSeasonId] = useState()
    const [season_number, setSeason_number] = useState()
    const [selectedVideo, setSelectedVideo] = useState([])
    const [videoLoading, setVideoLoading] = useState(true)
    const[smallLoading, setSmallLoading] = useState(true)
    const[similarLoading, setSimilarLoading] = useState(true)
    const [similarShow, setSimilarShow] = useState([])

    // for youtube
    const opts = {
        height: "390",
        width: "640",
        playerVars: {
          autoplay: 1,
        },
      };


    // popper code for modal
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const popperid = open ? 'simple-popover' : undefined;


    const apiKey = "?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"
    const url = "https://api.themoviedb.org/3/tv/"

    const searchUrl = baseUrl+'/search/tv'+apiKey

    const similarUrl  = url + selectedSeriesID + '/recommendations' + apiKey

    var options = {
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }

    const getSelectedTvseries = async(url) =>{
        try{
            const response = await fetch(url, options)
            const data = await response.json()
            setSelectedTvseriesInfo(data)
            setGenres(data.genres)
            setNextEpisode(data.next_episode_to_air)
            setSeasons(data.seasons)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
            toast.error(err)
        }    
    }

    const getSelectedVideo = async(url) =>{
        setVideoLoading(true)
        try{
            const response = await fetch(url, options);
            const video = await response.json()
            const data =  await video.results
            setSelectedVideo(data)
            setVideoLoading(false)
        }catch(err){
            setVideoLoading(false)
            toast.error('Error fetching trailer')
        }
    }

    const getSimilarShow = async(url) =>{
        setSimilarLoading(true)
        try{
            const response = await fetch(url, options);
            const similar = await response.json()
            const data =  await similar.results
            setSimilarShow(data)
            setSimilarLoading(false)
        }catch(err){
            setSimilarLoading(false)
            toast.error('Error fetching similar show')
        }
    }

    const checkSimilarShow = (name) =>{
        router.push({
            pathname: './searchTvseries',
            query: {userPageValue: name, }
        })
    }

    useEffect(() =>{
        if(showSelected === true){
            getSelectedTvseries(url+selectedSeriesID+apiKey)
            getSelectedVideo( url+ selectedSeriesID+ '/videos' + apiKey)
            getSimilarShow(similarUrl)
        }
    }, [showSelected])

    if(!showSelected){
        return null
    }

    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }




    const Img_Url = "https://image.tmdb.org/t/p/w300"
    const {id, name, overview, poster_path, number_of_seasons, next_episode_to_air, status, networks} = selectedTvseriesInfo
    

    var result = name.replace(/\s+/g, '-')

            const airdate = nextEpisode ? [nextEpisode.air_date] : "";
            const newImage = 'https://res.cloudinary.com/pajimo/image/upload/v1647610106/Untitled_1.png'
    return(
        <>
            <div className='modal w-screen'>
                <div className='modal-content h-full md:w-8/12 w-11/12'>
                    <div className='modal-header flex flex-row justify-between pt-10 px-5 pb-2 bg-black text-white'>
                        <h4 className='modal-title font-bold text-3xl'> {name}</h4>
                        <button onClick={() => closeParticularSeries()} className='button font-extrabold text-xl'>X</button>
                    </div>
                    <div className='modal-body bg-black text-white'>
                    {!videoLoading ? ((selectedVideo.length > 0) ? 
                    (
                        <iframe className=" w-full h-96"  src={`https://www.youtube.com/embed/${selectedVideo[selectedVideo.length-1].key}`} 
                                title="YouTube video player" frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen></iframe>) : <img className="h-96 w-full object-contain" src={poster_path ? Img_Url+poster_path : newImage} alt={name}/>)  
                                :  <img className="h-96 w-full object-contain" src={poster_path ? Img_Url+poster_path : newImage} alt={name}/>}
                        <div className="">
                            <div className="flex">
                                {(networks[0]) ? <div> <img className="w-20 bg-white p-2 mt-2" src={Img_Url + networks[0].logo_path} alt={networks[0].name} /> </div> : 'Network'}
                            </div>

                            <div className="w-full flex justify-center">{nextEpisode ? <div><span className='text-xl font-bold'>{status}</span>
                                <p className="mb-3 font-bold">Info for Next Episode</p>
                                <p>Next Episode on {((moment().add((moment(airdate[0]).fromNow())[2] + (moment(airdate[0]).fromNow())[3] + (moment(airdate[0]).fromNow())[4], 'days').calendar(null, {
                                    sameDay: '[Today]',
                                    nextDay: '[Tomorrow]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Yesterday]',
                                    lastWeek: '[Last] dddd',
                                    sameElse: 'DD/MM/YYYY'
                                })))} - Showing {(moment(airdate[0]).fromNow())}</p>
                                <p className="mb-2 mt-2">Title: {nextEpisode.name}</p>
                                <p className="mb-2">S{nextEpisode.season_number} | E{nextEpisode.episode_number}</p>
                            </div>: <div>Tv-Show: {status}<br></br> No new episode release date yet</div>}  
                                
                            </div>
                        </div>
                        <div className='text-sm pt-5'>
                        <button onClick={handleClick} className='rounded-xl shadow-2xl shadow-black bg-slate-600 px-4 py-2 text-center'>
                            <p>Share Show</p>
                        </button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            
                            }}
                        ><Typography sx={{ p: 2 }} className="py-5 px-5 bg-gray-900 text-white">
                            <FacebookShareButton
                                    url={"https://series-purge.vercel.app/components/searchTvseries?userPageValue=" + result}
                                    hashtag={"TvShow on" + name}>
                                    <FacebookIcon logoFillColor="white" size={40} className='m-2'/>
                                </FacebookShareButton>
                                <WhatsappShareButton 
                                url={"https://series-purge.vercel.app/components/searchTvseries?userPageValue=" + result}
                                hashtag={"TvShow on" + name}
                                ><WhatsappIcon logoFillColor='white' size={40} className='m-2'/>
                                </WhatsappShareButton>
                                <PinterestShareButton hashtag={"TvShow on" + name} url={"https://series-purge.vercel.app/components/searchTvseries?userPageValue=" + result}>
                                    <PinterestIcon logoFillColor='white' size={40} className='m-2'/>
                                </PinterestShareButton>
                                <TwitterShareButton hashtag={"TvShow on" + name} url={"https://series-purge.vercel.app/components/searchTvseries?userPageValue=" + result}>
                                    <TwitterIcon logoFillColor='white' size={40} className='m-2'/>
                                </TwitterShareButton>
                                <LinkedinShareButton hashtag={"TvShow on" + name} url={"https://series-purge.vercel.app/components/searchTvseries?userPageValue=" + result}>
                                    <LinkedinIcon logoFillColor='white' size={40} className='m-2'/>
                                </LinkedinShareButton>
                                <EmailShareButton hashtag={"TvShow on" + name} url={"https://series-purge.vercel.app/components/searchTvseries?userPageValue=" + result}>
                                    <EmailIcon logoFillColor='white' size={40} className='m-2'/>
                                </EmailShareButton>
                        </Typography>
                        </Popover>
                                </div> 
                        <div>
                            <div>
                            </div>
                            <div className="mt-5 flex flex-row justify-between">
                                <div>
                                <h1>Genres</h1>
                                {genres.map((genre) =>{
                                    const {id, name} = genre;
                                    return(
                                        <span key={id}>
                                             {`${name}, `}
                                        </span>
                                    )
                                })}
                                </div>
                                
                                <div className="flex justify-between">
                                    <AddToList className='mr-3' id={id} name={name} poster_path={poster_path} nextEpisode={nextEpisode} next_episode_to_air={next_episode_to_air} status={status}/>
                                    <div className="ml-3">{auth.currentUser ? <RemoveShow id={id} name={name} myListTvseries={myListTvseries} setMyListTvseries={setMyListTvseries} selectedSeriesID={selectedSeriesID}/> : ""}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white md:px-14 px-10">
                        <div className="flex flex-row items-center justify-between pt-5">
                            <div>
                                <Box sx={{ minWidth: 90 }} className='w-full'>
                                    <FormControl  className='md:w-40 w-36'>
                                    <InputLabel key={id} id="demo-simple-select-label">Check Seasons</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={eachSeason}
                                    label="Check Seasons"
                                    onChange={(e) => {
                                        setEachSeason(e.target.value)
                                        }}
                                    >
                                        {seasons.map((season) => {
                                            const {id, name, episode_count, season_number} = season
                                            return(    
                                                <MenuItem value={name} key={id} onClick={() => {
                                                    setSeason_number(season_number)
                                                    setSmallLoading(false)
                                                    setEachSeasonId(id)}} className='border-b-4'>{name} <span className="text-sm md:ml-10">({episode_count} episodes)</span></MenuItem>
                                            )
                                    })}
                                    </Select>
                                    </FormControl>
                                </Box>
                            </div>
                            <div className= 'text-2xl font-bold '>  
                                <p className="">Episodes</p>
                            </div>
                        </div>
                    
                        {smallLoading ? '' : <SeasonInfo  id={id} season_number={season_number}/>}

                        <div className="pt-5">
                            <p className="text-center font-bold mb-2">Overview</p>
                            {overview}
                        </div>
                    
                        <div className='modal-footer mb-20'>
                            <button onClick={closeParticularSeries} className='button'></button>
                            <div>
                                <p className="font-semibold text-xl">Similar Tv-Shows</p>
                                {similarLoading ? "" : <div className="flex overflow-x-scroll w-full">
                                    {similarShow.map((similar) => {
                                        const {id, name, poster_path} = similar
                                        return(
                                            <div key={id} className='m-3 mb-20 w-96 border-2' onClick={() => checkSimilarShow(name)}>
                                                <img className=" w-96 mr-40 object-contain" src={Img_Url + poster_path} alt={name} />
                                                <p className='text-center font-bold'>{name}</p>
                                            </div>
                                        )
                                    })}
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


}

export default SelectedTvseries