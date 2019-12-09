angular.module('snooock', []).controller('main', function($scope) {
    $scope.preferences = {
      monday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      tuesday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      wednesday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      thursday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      friday : [{ini: "08:00", end: "15:00"}]
    };

    $scope.selected = null;
    $scope.prev_selected = null;
});