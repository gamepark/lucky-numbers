export const headerHeight = 7
export const cloverSize = 7

export const boardTop = (index: number) => index < 2 ? 58 : 9
export const boardLeft = (index: number) => index % 2 === 0 ? 15 : 128

export const playerCloverLeft = (playerIndex: number) => playerIndex % 2 === 0 ? 52 : 119
export const playerCloverTop = (playerIndex: number, index: number) => playerIndex < 2 ? 60 + index * 8 : 35 - index * 8