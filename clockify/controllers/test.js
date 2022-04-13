const { PrismaClient } = require('@prisma/client')

module.exports.all = async (req, res) => {
  const prisma = new PrismaClient()
  const tests = await prisma.test.findMany()
  res.send(tests)
}
