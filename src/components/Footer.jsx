import { Container,Text ,Row ,Col ,Link} from '@nextui-org/react'
import {BsGithub, BsTwitter ,BsGlobe} from 'react-icons/bs'
const Footer = () => {
  return (
    <Container css={{
        backgroundColor: '#313131',
        
    }}>
        <Text size={22} lg={43} transform='uppercase' color='white' css={{
            my: '20px',
            textAlign: 'center',
        }} >Fitness App inspired by jsmastery</Text>
        <Row>
            <Col>
                <Text h6 color='white'>contact link</Text>
                <Text h5 color='white' css={{my:"5px"}}><Link href='https://github.com/lebe24'><BsGithub style={{
                    marginRight: '10px'
                }} /></Link>lebe24</Text>
                <Text h5 color='white'><Link href="https://lebe.pages.dev/"><BsGlobe style={{
                    marginRight: '10px'
                }} /></Link>lebepage</Text>
                <Text h5 color='white'><Link href='https://twitter.com/emmanuellebe24'><BsTwitter style={{
                    marginRight: '10px'
                }} /></Link>lebe24</Text>
            </Col>
            <Col>
                <Text h5 color='white'>Resource used</Text>
                <Text h4 color='white'>React</Text>
                <Text h4 color='white'>NextUi</Text>
                <Text h4 color='white'>Rapid api</Text>
            </Col>
            
        </Row>
        <Text size={12} lg={43} transform='uppercase' color='white' css={{
            my: '20px',
            textAlign: 'center',
        }} >© 2022 fitness developer by |<BsGithub style={{
            marginInline: '10px'
        }} /> lebepage</Text>
    </Container>
  )
}

export default Footer