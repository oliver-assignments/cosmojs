// const requestsManager = require('../controllers/request.js');

// module.exports = (app) => {
//     //  Get all simulation requests
//   app.get('/request/', requestsManager.getSimulationRequests);
//   //     (err, requests) => {
//   //       if (err) {
//   //         res.status = (err.status || 500);
//   //         res.json(err);
//   //       } else {
//   //         res.json(requests);
//   //       }
//   //     });
//   // });
//   //  Post new simulation request
//   app.post('/request/', requestsManager.queueSimulationRequest);
//   //     (err, requests) => {
//   //       if (err) {
//   //         res.status = (err.status || 500);
//   //         res.json(err);
//   //       } else {
//   //         res.json(requests);
//   //       }
//   //     });
//   // });

//   //  Clear simulation requests
//   app.delete('/request/', requestsManager.clearSimulationRequests);
//   //     (err, requests) => {
//   //       if (err) {
//   //         res.status = (err.status || 500);
//   //         res.json(err);
//   //       } else {
//   //         res.json(requests);
//   //       }
//   //     });
//   // });

//   //  Delete all simulation requests of worldname
//   app.delete('/request/:name', requestsManager.deleteSimulationRequestsForWorld);
//   //     (err, requests) => {
//   //       if (err) {
//   //         res.status = (err.status || 500);
//   //         res.json(err);
//   //       } else {
//   //         res.json(requests);
//   //       }
//   //     });
//   // });
//   app.post('/request/process', requestsManager.processSimulationRequests);
//   //     (err, requests) => {
//   //       if (err) {
//   //         res.status = (err.status || 500);
//   //         res.json(err);
//   //       } else {
//   //         res.json(requests);
//   //       }
//   //     });
//   // });
// };

