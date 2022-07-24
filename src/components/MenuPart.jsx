import { CardPart } from "./Card"
import { Grid ,Container } from "@nextui-org/react";
import { useState } from "react";
import  Exercise  from "./Exercise";

const MenuPart = ({setYt, yt, bodypart}) => {
    const [bodyitem, setBodyitem] = useState('')
  return (
    <>
      <div style={{
        border: "5px solid #dddd",
        
        justifyContent:'center',
        alignItems:'center',
      }}>
      <Grid.Container  gap={2} justify="center">
              { 
                bodypart &&  bodypart.map((item,index) => (
                      <Grid xs={5} sm={2}>
                          <CardPart setYt={setYt} body={item} setBodyItem={setBodyitem} />
                      </Grid>
                  ))
              }   
      </Grid.Container>
      </div>
     { yt == false ? <Exercise bodypart={bodyitem} /> : <h3> </h3> }
    </>
    
  )
}

export default MenuPart