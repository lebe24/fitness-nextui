import { Container,Text,Row} from "@nextui-org/react"
import './hero.css'
import rect from "../assets/rectangle.svg"
import person from "../assets/female.png"
import vector from '../assets/Vector.png'
import { useState, useEffect } from "react"
import { exercisequoteapi } from "../services/exerciseapi"

const Hero = () => {

  const [quote , setQuote ] = useState('')

  useEffect(() => {
    const random = async () => {
      const string = 'random-quote'
      const response = await exercisequoteapi({string})

      setQuote(response)
    }

    random()
   
  }, [])

  // console.log(quote.quote)
  
  return (
   
    <Container fluid >
      <Row id="row" css={{
        borderBottom: '2px solid #2a2727',
      }}>
        <Text css={{
          // border: '1px solid #e6e6e6',
          width: '100%',
          textAlign: 'center',
          transform: 'translateY(10%)',
        }}>
          <Text css={{ h:"440px"}} >
            <Text 
               h1
               size={120}
               id="text"
               css={{
                
                 lineHeight:"normal",
                 textGradient: "45deg, $blue600 -20%, $pink600 50%",
               }}
               weight="bold"
            
              >Health</Text>
              <Row justify="center" css={{
                    height:'125px',
              }}>
                <Text
                  
                  size={70}
                  id="text2"
                  >&</Text>
                <Text
                  h1
                  id="text3"
                  size={100}
                  css={{
                    lineHeight:"normal",
                    textGradient: "45deg, $yellow600 -20%, $red600 100%",
                    transform: 'translateX(-10%)',
                    transform: 'translateY(-20%)'
                  }}
                  weight="bold"
                  >Fitness</Text>
              </Row>
              <Text h1 size={40}>{quote.author}</Text> 
               <Text h1 size={20} css={{w:"100%"}}>{quote.quote}</Text>
          </Text>
          
        </Text>
        <Row >
          {/* <Image id="im1"   src={person} css={{
            width: '100%',
          }}></Image>
          <img width={400} src={rect} id="im2" /> */}
          <img width={420} src={person} id="im1"alt=""  />
          <img src={vector} id="im3" alt="" />
          <img width={400} src={rect} id="im2" alt="" />
        </Row>
        
      </Row>
    </Container>
    
  )
}

export default Hero