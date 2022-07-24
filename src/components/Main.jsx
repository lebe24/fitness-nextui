import {Container ,Input, Button, Grid, Spacer,Text, Link} from "@nextui-org/react"
import { useEffect , useState } from "react"
import { excercisedbapi } from "../services/exerciseapi"
import  {youtubevideo} from '../services/youtubechannelapi'
import MenuPart from "./MenuPart"
import {CardYT} from "./Card"


const Main = () => {

    const [bodypart,setBodypart] = useState('')
    const [search, setSearch] = useState('');
    const [item ,seItem] = useState('')
    const [youtube,setYoutube] = useState(false)


    useEffect(() => {
        const bodyPart = async () => {
            const string = 'bodyPartList'
            const response = await excercisedbapi({string})

            setBodypart(response)
        }
        
        bodyPart()
    },[])

   

    const searchyt = async() =>{
        setYoutube(true)
        seItem(await youtubevideo(search))
        setSearch('');
        console.log(search)
        console.log(item)
    }

    const handleSearch = async(e) =>{
        setSearch(e.target.value)
        console.log(e.target.value)
    }

    // console.log(item.items[0].snippet.title)
    
  return (
    <Container>
        <Text h2 css={{textAlign:'center',marginTop:'20px'}}> Work Out</Text>
        <Spacer y={0.5} />
        {/* center the div */}
        <div style={{
            
            display:"flex",
            justifyContent:'center',
            alignItems:'center',
            }}>
            {/* center the input  */}
            <Input 
                type="text"
                xs={{ width: "100%" }}
                value={search}
                onChange={ handleSearch}
                css={{
                borderRadius: '5px',
                width:'70%',
                boxShadow:'0px 0px 10px #e6e6e6',
            }} clearable bordered placeholder="search Youtube..."  />
        </div>
        <div style={{
            display:"flex",
            justifyContent:'center',
            alignItems:'center',
            }}>
        <Button shadow color="success" css={{
            my: '10px',
            color:'white',
            borderRadius: '5px',
            backgroundColor:'black',
        }} onClick={ searchyt }><Text h5 color="#fff">Search</Text></Button>
        </div>
        <Spacer y={2.5} />

        <MenuPart setYt={setYoutube} yt={youtube}  setBodyPart={setBodypart} bodypart={bodypart} />
        
          { 
            youtube === true ?
            <Grid.Container gap={2} justify="flex-start">
                {
                  item && item.items.map((en,index) => (
                    <Grid xs={6} sm={3} key={index}>
                        <a href={`https://www.youtube.com/watch?v=${en.id.videoId}`}>
                            <CardYT yt={en} />
                        </a>
                    </Grid>
                  ))
                }
            </Grid.Container>

           :
            <h3></h3>
        }  
        
   </Container>
  )
}

export default Main


// item && 
// item.items.map((en,idx) => (
//     <h1>{en.snippet.title}</h1>
// )) 

