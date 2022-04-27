const BacklogService = require('../services/Backlog')
const ClockifyService = require('../services/clockify')
const AccountService = require('../services/account')

// get all tests data from backlog and clockify services
module.exports.all = async (req, res) => {
  const backlogResult = await BacklogService.allTests()
  const clockifyResult = await ClockifyService.allTests()
  const AccountResult = await AccountService.allTests()

  res.send({
    backlogServiceTests: backlogResult,
    clockifyServiceTests: clockifyResult,
    AccountServiceTests: AccountResult
  })
}
