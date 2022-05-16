import { createStyles, Center, Loader } from '@mantine/core'

const useStyles = createStyles(() => ({
  loader: {
    height: '100%',
    width: '100%',
    position: 'fixed',
    left: 0,
    top: 0,
    background: ' #80808078',
    zIndex: 9999,
  },
}))

const Index = () => {
  const { classes } = useStyles()

  return (
    <div className={classes.loader}>
      <Center style={{ height: '100vh' }}>
        <Loader size='xl' />
      </Center>
    </div>
  )
}

export default Index
