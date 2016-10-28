// const soilScape = require('soil-scape');
// const manager = require('./manager.js');

// let requests = [];

// exports.queueSimulationRequest = (request, res) => {
//   if (request.name && request.days) {
//     if (request.days >= 1) {
//       //  Do we have that simulation?
//       manager.getSimulation(request.name, (err, data) => {
//         if (err) {
//           res(err);
//           return;
//         }
//         requests.push(request);
//         res(null, requests);
//       });
//     } else {
//       res(`${request.name} cannot be simulated for ${request.days}. Year values must be above 0.`, requests);
//     }
//   } else {
//     res('Bad or missing request data.', requests);
//   }
// };

// exports.deleteSimulationRequestsForWorld = (request, res) => {
//   for (let i = requests.length - 1; i >= 0; i - 1) {
//     const item = requests[i];

//     if (item.name === request.name) {
//       requests.splice(i, 1);
//     }
//   }
//   res(null, requests);
// };

// exports.getSimulationRequests = (res) => {
//   res(null, requests);
// };

// exports.clearSimulationRequests = (res) => {
//   requests = [];
//   res(null, requests);
// };
// // exports.saveCtx = function(simulation, ctx)
// // {
// //   simulate.calculateHighest(ctx);
// //   simulation.dates.push(utility.cloneObject(ctx));
// // }

// exports.processSimulationRequests = (res) => {
//   const lastOutputDay = 0;
//   for (let r = 0; r < requests.length; r + 1) {
//     // manager.getSimulation(requests[r].name,function(err,simulation)
//     // {
//       // if(err)
//       // {
//       //   res(err);
//       //   return;
//       // }
//       // var newDates = soilScape.simulate(simulation.dates[simulation.dates.length-1], request[r].days, 10);
//       // for(var d = 0 ; d < newDates.length; d++)
//       //   simulation.dates.push(newDates[d]);
//       // }
//   }
//   requests = [];
//   res(null, requests);
// };
