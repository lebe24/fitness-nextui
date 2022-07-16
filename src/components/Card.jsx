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


export const CardPart = ({setBodyItem, body }) => {

  // console.log(workoutpic['back'])
  // console.log()
  return (
    <div onClick={() =>{ setBodyItem(body)}} >
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

export const CardExercise = () => {
  <Card css={{ w: "100%", h: "400px" }}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
      <Col>
        <Text size={12} weight="bold" transform="uppercase" color="#9E9E9E">
          Your day your way
        </Text>
        <Text h3 color="white">
          Your checklist for better sleep
        </Text>
      </Col>
    </Card.Header>
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src="http://d205bpvrqc9yn1.cloudfront.net/0019.gif"
        objectFit="cover"
        width="100%"
        height="100%"
        alt="Relaxing app background"
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
                Breathing App
              </Text>
              <Text color="#d1d1d1" size={12}>
                Get a good night's sleep.
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
              css={{ color: "#94f9f0", bg: "#94f9f026" }}
            >
              <Text
                css={{ color: "inherit" }}
                size={12}
                weight="bold"
                transform="uppercase"
              >
                Get App
              </Text>
            </Button>
          </Row>
        </Col>
      </Row>
    </Card.Footer>
  </Card>
}

