import Link from 'next/link'
import { MantineProvider } from '@mantine/core'
import { AppShell, Header, Space, Text, ThemeIcon } from '@mantine/core'
import { Affiliate } from 'tabler-icons-react'
import { NotificationsProvider } from '@mantine/notifications'
import Logout from '@/src/components/molecules/Logout'

const myTheme = {
  fontFamily: 'sans-serif, Open Sans',
}

const Main = ({ children }) => (
  <MantineProvider theme={myTheme}>
    <NotificationsProvider position='bottom-right' zIndex={2077}>
      <AppShell
        padding='md'
        header={
          <Header
            height={60}
            p='xs'
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link href='/' passHref>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ThemeIcon
                  size='lg'
                  variant='gradient'
                  gradient={{ from: 'teal', to: 'blue' }}
                >
                  <Affiliate />
                </ThemeIcon>
                <Space w={8} />
                <Text
                  component='span'
                  align='center'
                  variant='gradient'
                  gradient={{ from: 'teal', to: 'blue', deg: 45 }}
                  size='xl'
                  weight={700}
                  style={{ fontFamily: 'Greycliff CF, sans-serif' }}
                >
                  Uni-Charts
                </Text>
              </div>
            </Link>
            <Logout />
          </Header>
        }
      >
        {children}
      </AppShell>
    </NotificationsProvider>
  </MantineProvider>
)

export default Main
