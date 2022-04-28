import User from '../../models/User'
import { prismaMock } from '../../utils/singleton'

const userMock = {
  id: 2,
  email: 'test@test.com',
  token_id: 'token_id_rand',
  google_id: 'google_id_rand',
  created_at: new Date(),
  updated_at: new Date()
}

describe('User.insertOrUpdateUser', () => {
  it('should insert data to DB if not existed', async () => {
    const { created_at, updated_at, ...userPayload } = userMock
    prismaMock.user.upsert.mockResolvedValue(userMock)

    const userModel = new User()
    await expect(userModel.insertOrUpdateUser(userPayload)).resolves.toMatchObject(userPayload)
  })

  it('should update token_id if email has already exists', async () => {
    const newUser = { ...userMock, token_id: 'new_token_id' }
    const { created_at, updated_at, ...userPayload } = newUser

    prismaMock.user.create.mockResolvedValue(userMock)
    prismaMock.user.upsert.mockResolvedValue(newUser)

    const userModel = new User()
    const result = await userModel.insertOrUpdateUser(userPayload)

    expect(result).toMatchObject(userPayload)
    expect(result.token_id).not.toEqual(userMock.token_id)
  })
})

describe('User.destroyToken', () => {
  it('should empty the token_id column', async () => {
    const { created_at, updated_at, ...userPayload } = userMock
    prismaMock.user.create.mockResolvedValue(userMock)

    const userModel = new User()
    await userModel.destroyToken(userPayload)
    prismaMock.user.findFirst.mockResolvedValue({ ...userMock, token_id: null })

    await expect(userModel.findByEmail(userPayload.email)).resolves.toMatchObject({
      token_id: null
    })
  })
})
