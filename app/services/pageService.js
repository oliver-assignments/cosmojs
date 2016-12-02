angular.module('pageApp')
  .factory('pageService',['contextService','simulationRendererService', (context,renderer) => {
    let service = {};

    service.pages = [
      { name:"Create", url: "partials/partial-new.html" }
      ,{ name:"About", url: "partials/partial-about.html" }
      ,{ name:"Blog", url: "https://oliverbarnum.wordpress.com/category/cosmopolitos/" }
    ];
    // ook
    service.page = service.pages[0];

    service.changePage = (name, res) => {
      for(var p = 0 ; p < service.pages.length; p++) {
        if(service.pages[p].name == name) {
          service.page = service.pages[p];

          // if(name == "Home") {
          //   renderer.renderWorldAtDateWithMode(
          //     {
          //       name:context.name
          //       ,mode:context.mode
          //       ,days:context.days
          //     }, (err,data) => {
          //       (err ? res(err) : res(null));
          //     });
          //   return;
          // }
        }
      }
      res("Cannot find page named " + name + ".");
    };
    return service;
  }]);