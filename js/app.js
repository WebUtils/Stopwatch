angular.module("stopwatch", ["ca-helpers", "appcache"])

.controller("stopwatch", function($scope, $interval, appcache) {

  appcache.checkForUpdate().then(function(applyUpdate) {
    applyUpdate(); // Function call here not a bug
  }, function() {
    console.log("No update found");
  });

  $scope.countDown = false;

  $scope.time = 0;
  $scope.initialTime = 0;

  $scope.moment = moment;

  $scope.currentInterval = false;

  var alertUser = function() {
    if ("vibrate" in window.navigator) {
      window.navigator.vibrate([500, 250, 500, 250, 500])
    }
  }

  $scope.goToCountdown = function() {
    $scope.countDown = true;
    if ($scope.time < 1) {
      $scope.setTime();
    }
  }

  $scope.start = function() {
    if ($scope.currentInterval) {
      return;
    }
    $scope.initialTime = $scope.time;
    $scope.currentInterval = $interval(function() {
      $scope.time = $scope.time + (($scope.countDown ? -1 : 1) * 0.01);
      if ($scope.time < 0) {
        $scope.time = 0;
        $scope.stop();
        if ($scope.countDown) {
          alertUser();
        }
      }
    }, 10);
  }

  $scope.stop = function() {
    if (!$scope.currentInterval) {
      return;
    }
    $interval.cancel($scope.currentInterval);
    $scope.currentInterval = false;
  }

  $scope.reset = function() {
    $scope.stop();
    $scope.time = $scope.initialTime;
  }

  $scope.chooseTime = false;

  $scope.setTime = function() {
    $scope.stop();
    $scope.time = Math.round($scope.time);
    $scope.chooseTime = true;
  }

  $scope.timeSet = function() {
    $scope.chooseTime = false;
    $scope.countDown = true;
  }

  var checkTime = function() {
    if ($scope.time < 0) {
      $scope.time = 0;
    }
  }

  var generateTimeFunction = function(seconds) {
    return function() {
      $scope.time += seconds;
      checkTime();
    }
  }

  $scope.addHour = generateTimeFunction(60*60);
  $scope.addMinute = generateTimeFunction(60);
  $scope.addSecond = generateTimeFunction(1);
  $scope.removeHour = generateTimeFunction(-60*60);
  $scope.removeMinute = generateTimeFunction(-60);
  $scope.removeSecond = generateTimeFunction(-1);

});
