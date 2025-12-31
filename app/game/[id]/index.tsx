import Board from "@/components/Board"
import { useLocalSearchParams } from "expo-router"


export default function GameScreen() {

  const { id, type} = useLocalSearchParams<{ id : string, type : string}>()

  return (
    <Board id={id} type={type}/>
  )
}