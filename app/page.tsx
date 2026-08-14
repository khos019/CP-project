import { AlgoYolApp } from "./ui/AlgoYolApp";
import { LearningProvider } from "./ui/LearningContext";

export default function Home() {
  return (
    <LearningProvider>
      <AlgoYolApp />
    </LearningProvider>
  );
}
