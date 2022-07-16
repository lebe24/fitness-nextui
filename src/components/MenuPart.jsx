import { CardPart } from "./Card"
import { Grid ,Container } from "@nextui-org/react";
import { useEffect , useState } from "react"
import  Exercise  from "./Exercise";

const MenuPart = ({setBodyPart, bodypart}) => {
    const [bodyitem, setBodyitem] = useState('')
  return (
    <>
      <div style={{
        border: "5px solid #dddd",
        
        justifyContent:'center',
        alignItems:'center',
      }}>
      <Grid.Container fluid gap={2} justify="center">
              { 
                bodypart &&  bodypart.map((item,index) => (
                      <Grid xs={12} sm={2}>
                          <CardPart body={item} setBodyItem={setBodyitem} />
                      </Grid>
                  ))
              }   
      </Grid.Container>
      </div>
      <Exercise bodypart={bodyitem} />
    </>
    
  )
}

export default MenuPart