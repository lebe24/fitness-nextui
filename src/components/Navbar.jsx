import { Link } from '@nextui-org/react'

import { Container,Button,Row,Text } from "@nextui-org/react";

import './navbar.css'


const Navbar = () => {
  return (
    
        <Container  css={{ w: "100%",borderBottom:"0.4px solid" }}>
        <Row gap={1} justify="space-between" css={{m:20}} >
            <Text h2 weight="bold" size={25} color="black" css={{ m: 0 , padding:"3px"}}>
                Fitness
            </Text>
            <div className='txt'>
                <Link href='/'><Text h3 css={{
                    px:"7px",
                    mx:"7px",
                    '&:hover':{
                        fontSize:"30px"
                    }
                }}>Home</Text></Link>
                <Link href='/video'><Text h3 css={{
                    px:"7px",
                    mx:"7px",
                    '&:hover':{
                        fontSize:"30px"
                    }
                }}>Fitnessvideo</Text></Link>
            </div>     
            
            <Button 
                auto 
                as="a"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/nextui-org/nextui"
                css={{ 
                    px:'$10',
                    maxWidth: '$12', // space[12]
                    borderRadius: '$xs', // radii.xs
                    border: '$space$1 solid black',
                    background: '#313131', // colors.gray800
                    color: '',
                    height: '$15', // space[12]
                    boxShadow: '$md', // shadows.md
                    '&:hover': {
                    background: '$gray100',
                    color: '$gray800',
                    },
                    '&:active': {
                    background: '$gray200',
                    },
                    '&:focus': {
                    borderColor: '$gray400',
                    },
                }}
                >
                    Workout
            </Button>
        </Row>
        </Container>
    
  )
}

export default Navbar