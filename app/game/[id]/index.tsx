import Board from "@/components/Board";
import { useLocalSearchParams, useRouter } from "expo-router";


export default function GameScreen() {

  const {id, type} = useLocalSearchParams<{ id : string, type : string}>()
  const router = useRouter();
  
  const handleNextStage = () => {
    const nextId = parseInt( id as string) + 1;

    if(nextId < 20) {
      router.push(`/game/${nextId}?type=${type}`)
    } else {
      router.back();
    }

  }

  return (
    <Board id={id} type={type} onWin ={handleNextStage}/>
  )
}