import { Card, Col,Row,Button, Text } from "@nextui-org/react";
import mot from '../assets/leg.webp'


const workoutpic =
  {
    "lower leg" : '../assets/leg.webp',
    "back": '../assets/leg.webp',
    "cardio": '../assets/leg.webp',
   "chest" : '../assets/leg.webp',
    "lower arms": '../assets/leg.webp',
    "neck" : '../assets/leg.webp',
    "upper arms" : '../assets/leg.webp',
    "upper legs" : '../assets/leg.webp',
    "waist" : '../assets/waist.jpeg',
  }


export const CardPart = ({setBodyItem,setYt, body }) => {

  // console.log(workoutpic['back'])
  // console.log()
  return (
    <div onClick={() =>{ 
          setBodyItem(body)
          setYt(false)
      }} >
    <Card css={{ cursor:"pointer", h: "$24", $$cardColor: '$colors$primary',w:"100%" }} >
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
            <Col>
                <Text h4 color="white">
                    {body}
                </Text>
            </Col>
        </Card.Header>
        <Card.Image
            src={mot}
            objectFit="cover"
            width="100%"
            height="100%"
            alt="Relaxing app background"
          />
    </Card>
    </div>
    
  )
}

export const CardExercise = ({exercise}) => {
  return (
  <Card css={{ w: "100%", h: "400px"}}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
      <Col>
        
        <Text h3 color="black">
          {exercise.name}
        </Text>
      </Col>
    </Card.Header>
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src={exercise.gifUrl}
        objectFit="cover"
        width="100%"
        height="100%"
        alt={exercise.name}
      />
    </Card.Body>
    <Card.Footer
      isBlurred
      css={{
        position: "absolute",
        bgBlur: "#0f111466",
        borderTop: "$borderWeights$light solid $gray800",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Row>
        <Col>
          <Row>
            <Col span={3}>
              <Card.Image
                src="https://nextui.org/images/breathing-app-icon.jpeg"
                css={{ bg: "black", br: "50%" }}
                height={40}
                width={40}
                alt="Breathing app icon"
              />
            </Col>
            <Col>
              <Text color="#d1d1d1" size={12}>
                {exercise.bodyPart}
              </Text>
              <Text color="#d1d1d1" size={12}>
                {exercise.target}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row justify="flex-end">
            <Button
              flat
              auto
              rounded
              css={{ color: "#94f9f0", bg: "black" }}
            >
              <Text
                css={{ color: "inherit" }}
                size={12}
                weight="bold"
                transform="uppercase"
              >
                view
              </Text>
            </Button>
          </Row>
        </Col>
      </Row>
    </Card.Footer>
  </Card>
  )
}
export const CardYT = ({yt}) => {

  return (
      <Card isPressable>
            <Card.Body css={{ p: 0 }}>
              <Card.Image
                src={yt.snippet.thumbnails.high.url}
                objectFit="cover"
                width="100%"
                height={140}
                alt={yt.snippet.title}
              />
            </Card.Body>
            <Card.Footer css={{ justifyItems: "flex-start" }}>
              <Row wrap="wrap" justify="space-between" align="center">
                <Text b>{yt.snippet.title}</Text>
              </Row>
            </Card.Footer>
      </Card>
  )

}