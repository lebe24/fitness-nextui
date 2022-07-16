import {Container ,Input, Button, Spacer,Text} from "@nextui-org/react"
import { useEffect , useState } from "react"
import { excercisedbapi } from "../services/exerciseapi"
import  {youtubevideo} from '../services/youtubechannelapi'
import MenuPart from "./MenuPart"




const Main = () => {

    const [bodypart,setBodypart] = useState('')
    const [search, setSearch] = useState('');
    const [item ,seItem] = useState('')
    const [youtube,setYoutube] = useState(false)

    // useEffect(() => {
    //     const bodyPart = async () => {
    //         const string = 'bodyPartList'
    //         const response = await excercisedbapi({string})

    //         setBodypart(response)
    //     }
        
    //     bodyPart()
    // },[])

    // const handleSearch = async() =>{
    //     setYoutube(true)
    //     const ytsearch = await youtubevideo({search})
    //     setSearch('');
    //     seItem(ytsearch)
    //     console.log('yes')
        
    // }

    const Search = async() =>{
        seItem(await youtubevideo(search))
        setSearch('');
        console.log(item)
        console.log(search)
    }
    
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
                onChange={(e) => setSearch(e.target.value)}
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
        }} onClick={Search}>hello</Button>
        </div>
        <Spacer y={2.5} />
        hhh
        { <MenuPart setBodypart={setBodypart} bodypart={bodypart}/> } 
   </Container>
  )
}

export default Main

