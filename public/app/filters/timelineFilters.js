angular.module("timelineApp")
  .filter('reverse', () => {
    return (items) => {
      return items;//.slice().reverse();
    };
  });