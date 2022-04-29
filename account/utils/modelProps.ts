const modelList = ['user'] as const
export type ModelNames = typeof modelList[number]
