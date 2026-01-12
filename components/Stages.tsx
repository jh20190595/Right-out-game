// src/constants/stages.ts

export type Difficulty = '일일' | '쉬움' | '보통' | '어려움' | '극한';

export interface Stage {
  id: number;
  gridSize: number;
  obstacles: number[];
  shuffleSteps: number;
}

export const STAGES: Record<Difficulty, Stage[]> = {

  '일일': [
    { id: 1, gridSize: 5, obstacles: [6, 8, 12, 16, 18], shuffleSteps: 20 },
  ],


  '쉬움': Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    gridSize: 3,
    obstacles: [],
    shuffleSteps: 3 + Math.floor(i / 4), 
  })),


  '보통': Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    gridSize: 4,
    obstacles: i >= 10 ? [5, 10] : [],
    shuffleSteps: 6 + Math.floor(i / 2), 
  })),


  '어려움': [
    { id: 1, gridSize: 5, obstacles: [12], shuffleSteps: 12 },
    { id: 2, gridSize: 5, obstacles: [0, 4, 20, 24], shuffleSteps: 12 },
    { id: 3, gridSize: 5, obstacles: [6, 8, 16, 18], shuffleSteps: 14 },
    { id: 4, gridSize: 5, obstacles: [7, 11, 13, 17], shuffleSteps: 14 },
    { id: 5, gridSize: 5, obstacles: [2, 10, 14, 22], shuffleSteps: 16 },
    { id: 6, gridSize: 5, obstacles: [1, 3, 5, 9, 15, 19, 21, 23], shuffleSteps: 16 },
    { id: 7, gridSize: 5, obstacles: [0, 1, 2, 3, 4, 20, 21, 22, 23, 24], shuffleSteps: 18 },
    { id: 8, gridSize: 5, obstacles: [0, 5, 10, 15, 20, 4, 9, 14, 19, 24], shuffleSteps: 18 },
    { id: 9, gridSize: 5, obstacles: [6, 7, 8, 11, 12, 13, 16, 17, 18], shuffleSteps: 20 },
    { id: 10, gridSize: 5, obstacles: [0, 2, 4, 10, 12, 14, 20, 22, 24], shuffleSteps: 22 },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 11,
      gridSize: 5,
      obstacles: [i + 5, i + 15],
      shuffleSteps: 20 + i,
    })),
  ],


  '극한': [
    { id: 1, gridSize: 5, obstacles: [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24], shuffleSteps: 12 }, // 중앙 3x3 남김
    { id: 2, gridSize: 5, obstacles: [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24], shuffleSteps: 14 }, // 십자가
    { id: 3, gridSize: 5, obstacles: [0, 4, 6, 7, 8, 11, 13, 16, 17, 18, 20, 24], shuffleSteps: 16 }, // X자
    { id: 4, gridSize: 5, obstacles: [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23], shuffleSteps: 16 }, // 다이아몬드
    { id: 5, gridSize: 5, obstacles: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24], shuffleSteps: 18 }, // 샌드위치
    { id: 6, gridSize: 5, obstacles: [0, 4, 5, 9, 10, 14, 15, 19, 20, 24], shuffleSteps: 20 }, // 가로 3줄
    { id: 7, gridSize: 5, obstacles: [2, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 22], shuffleSteps: 22 }, // 마름모 외곽
    { id: 8, gridSize: 5, obstacles: [6, 7, 8, 11, 13, 16, 17, 18], shuffleSteps: 25 }, // 도넛
    { id: 9, gridSize: 5, obstacles: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23], shuffleSteps: 28 }, // 체크무늬
    { id: 10, gridSize: 5, obstacles: [0, 1, 2, 3, 4, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9], shuffleSteps: 30 }, // 테두리만
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 11,
      gridSize: 5,
      obstacles: [0, 4, 20, 24, 12],
      shuffleSteps: 30 + i,
    })),
  ],
};