import { Container } from "@nextui-org/react";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Main  from "./components/Main";
import './App.css';

export default function App() {
  return (
    <Container>
      <Navbar />
      <Hero />
      <Main />
    </Container>
  );
}
