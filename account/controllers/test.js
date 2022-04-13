const { PrismaClient } = require('@prisma/client')

// get all data from Test table
module.exports.all = async (req, res) => {
  const prisma = new PrismaClient()
  const tests = await prisma.test.findMany()
  res.send(tests)
}
