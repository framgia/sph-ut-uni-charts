const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const auth = require('../middleware/authentication')
const prisma = new PrismaClient()

module.exports.login = async (req, res, next) => {
  const account = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  const isPasswordMatched = !account
    ? false
    : await bcrypt.compareSync(req.body.password, account.password)

  if (isPasswordMatched) {
    res.send({
      message: 'Successfully logged in.',
      id: account.id,
      email: account.email,
      accessToken: auth.createAccessToken(account)
    })
  }

  if (!isPasswordMatched || !account) {
    res.send({
      message: 'Something is wrong. Please try again.'
    })
  }
}

module.exports.register = async (req, res, next) => {
  const account = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (!account) {
    const user = await prisma.user.create({
      data: {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      }
    })

    res.send({
      message: 'successfully created',
      data: user
    })
  } else {
    res.send({ message: 'account already exist' })
  }
}
