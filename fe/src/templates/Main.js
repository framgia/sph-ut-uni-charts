import { MantineProvider } from '@mantine/core'

const myTheme = {
  fontFamily: 'sans-serif, Open Sans',
}

const Main = ({ children }) => (
  <MantineProvider theme={myTheme}>{children}</MantineProvider>
)

export default Main
