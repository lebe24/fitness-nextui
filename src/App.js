import { Container } from "@nextui-org/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Main  from "./components/Main";

export default function App() {
  return (
    <Container>
      <Navbar />
      <Hero />
      <Main />
      
    </Container>
  );
}
