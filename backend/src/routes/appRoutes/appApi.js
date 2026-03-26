const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');
const { globalSearch } = require('@/controllers/appControllers/searchController');
const analyticsController = require('@/controllers/appControllers/analyticsController');

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
  }
};

// Custom analytics routes (must be before routesList forEach to take priority)
router.route('/invoice/revenueChart').get(catchErrors(appControllers['invoiceController']['revenueChart']));
router.route('/invoice/topClients').get(catchErrors(appControllers['invoiceController']['topClients']));

// Global search
router.route('/search').get(catchErrors(globalSearch));

// Deal custom routes
router.route('/deal/moveStage/:id').patch(catchErrors(appControllers['dealController']['moveStage']));

// Lead custom routes
router.route('/lead/convert/:id').patch(catchErrors(appControllers['leadController']['convert']));

// Task custom routes
router.route('/task/complete/:id').patch(catchErrors(appControllers['taskController']['complete']));
router.route('/task/overdueCount').get(catchErrors(appControllers['taskController']['overdueCount']));

// Note custom routes
router.route('/note/byEntity').get(catchErrors(appControllers['noteController']['byEntity']));

// Analytics routes
router.route('/analytics/pipeline').get(catchErrors(analyticsController.pipeline));
router.route('/analytics/leads').get(catchErrors(analyticsController.leads));
router.route('/analytics/tasks').get(catchErrors(analyticsController.tasks));

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
