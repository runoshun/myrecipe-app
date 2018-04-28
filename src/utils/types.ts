
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];  
export type Omit<T, K extends keyof T> = {[P in Diff<keyof T, K>]: T[P]};  

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & { [P in K]: T[P] }