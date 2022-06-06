export const errorWithCustomMessage = (status: any, errors: any) => {
  throw new Error(JSON.stringify({ status, errors }))
}
