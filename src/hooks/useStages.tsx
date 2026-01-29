import { Difficulty, STAGES } from "@/components/stages";

const CATEGORY_COLORS: Record<string, string> = {
  '일일': '#FF6B6B',
  '쉬움': '#51CF66',
  '보통': '#FCC419',
  '어려움': '#339AF0',
  '극한': '#B197FC',
};

export const useStages = (type: string) => {
  const stages = STAGES[type as Difficulty] || [];
  const currentColor = CATEGORY_COLORS[type] || "#339AF0";
  const totalStages = stages.length;

  return {
    stages,
    currentColor,
    totalStages,
  };
};