import express from 'express'
import ProviderController from '../controllers/ProviderController'

const router = express.Router()
router.post('/add', ProviderController.add)
router.get('/', ProviderController.getProviders)
router.get('/:id', ProviderController.filterListByProvider)

export default router

// import express from 'express'
// import ProviderController from '../controllers/ProviderController'

// const router = express.Router()
// const providerController = new ProviderController()

// class ProjectRoute {
//   controller: ProviderController

//   constructor(controller: ProviderController) {
//     this.controller = controller
//   }

//   getProjects(endpoint: string) {
//     return router.get(`${endpoint}`, this.controller.add)
//   }

//   getProjectById(endpoint: string) {
//     return router.get(`${endpoint}`, this.controller.getProjectById)
//   }
// }

// const routes = new ProjectRoute(providerController)
// routes.getProjects('/')
// routes.getProjectById('/:id')

// export default router
