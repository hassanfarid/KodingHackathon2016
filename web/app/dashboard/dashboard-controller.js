(function () {
    angular.module('Application').controller('DashboardController',
        ['$scope', '$routeParams', '$location', '$window', '$mdDialog', 'appService', 'dashboardService',
            function ($scope, $routeParams, $location, $window, $mdDialog, appService, dashboardService) {

                $scope.showLoader = false;
                $scope.event = angular.copy(appService.event);
                
                if ($scope.event && ($scope.event._id == null || $scope.event._id == ''))
                    $location.path('/event');

                $scope.load_data = function() {
                    $scope.showLoader = true;

                    // Tweet Count
                    dashboardService.getTweetCount($scope.event._id)
                        .success(function (data) {
                            $scope.tweetCount = data.aggregations.tweetCount.value;
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Positive Tweet Count
                    dashboardService.getSentimentTweetCount($scope.event._id, "POSITIVE")
                        .success(function (data) {
                            $scope.positiveTweetCount = data.aggregations.tweetCount.value;
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Neutral Tweet Count
                    dashboardService.getSentimentTweetCount($scope.event._id, "NEUTRAL")
                        .success(function (data) {
                            $scope.neutralTweetCount = data.aggregations.tweetCount.value;
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Negative Tweet Count
                    dashboardService.getSentimentTweetCount($scope.event._id, "NEGATIVE")
                        .success(function (data) {
                            $scope.negativeTweetCount = data.aggregations.tweetCount.value;
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Unique User Count
                    dashboardService.getUniqueUsers($scope.event._id)
                        .success(function (data) {
                            $scope.uniqueUserCount = data.aggregations.tweetCount.value;
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                    
                    // English Language Tweet Ratio
                    dashboardService.getLanguageTweetCount($scope.event._id, 'en')
                        .success(function (data) {
                            $scope.englishLanguageTweetCount = data.aggregations.tweetCount.value;
                            $scope.englishLanguageTweetRatio = data.aggregations.tweetCount.value / $scope.tweetCount * 100;
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Get Gender Tweet Count MALE
                    dashboardService.getGenderSentimentTweetCount($scope.event._id, "MALE", "POSITIVE")
                        .success(function (data) {
                            $scope.malePositiveTweetCount = data.aggregations.tweetCount.value;
                            
                            dashboardService.getGenderSentimentTweetCount($scope.event._id, "MALE", "NEGATIVE")
                                .success(function (data) {
                                    $scope.maleNegativeTweetCount = data.aggregations.tweetCount.value;
                                    $scope.maleSentimentRatio = $scope.malePositiveTweetCount / ($scope.malePositiveTweetCount + $scope.maleNegativeTweetCount) * 100;  
                                })
                                .error(function (error) {
                                })
                                .finally(function () {
                                });
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                        
                    // Get Gender Tweet Count FEMALE
                    dashboardService.getGenderSentimentTweetCount($scope.event._id, "FEMALE", "POSITIVE")
                        .success(function (data) {
                            $scope.femalePositiveTweetCount = data.aggregations.tweetCount.value;
                            
                            dashboardService.getGenderSentimentTweetCount($scope.event._id, "FEMALE", "NEGATIVE")
                                .success(function (data) {
                                    $scope.femaleNegativeTweetCount = data.aggregations.tweetCount.value;
                                    $scope.femaleSentimentRatio = $scope.femalePositiveTweetCount / ($scope.femalePositiveTweetCount + $scope.femaleNegativeTweetCount) * 100;  
                                })
                                .error(function (error) {
                                })
                                .finally(function () {
                                });
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Get Last Sentiment Tweet MALE
                    dashboardService.getGenderSentimentLastTweet($scope.event._id, "MALE", "POSITIVE")
                        .success(function (data) {
                            if (data.hits.hits.length == 0)
                                return; // no data yet
                            
                            $scope.lastMalePositiveTweet = data.hits.hits[0]._source;
                            
                            dashboardService.getGenderSentimentLastTweet($scope.event._id, "MALE", "NEGATIVE")
                                .success(function (data) {
                                      $scope.lastMaleNegativeTweet = data.hits.hits[0]._source;
                                })
                                .error(function (error) {
                                })
                                .finally(function () {
                                });
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                        
                    // Get Last Sentiment Tweet FEMALE
                    dashboardService.getGenderSentimentLastTweet($scope.event._id, "FEMALE", "POSITIVE")
                        .success(function (data) {
                            if (data.hits.hits.length == 0)
                                return; // no data yet
                            
                            $scope.lastFemalePositiveTweet = data.hits.hits[0]._source;
                            
                            dashboardService.getGenderSentimentLastTweet($scope.event._id, "FEMALE", "NEGATIVE")
                                .success(function (data) {
                                      $scope.lastFemaleNegativeTweet = data.hits.hits[0]._source;
                                })
                                .error(function (error) {
                                })
                                .finally(function () {
                                });
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                        });
                        
                    // Get Recent Tweets
                    dashboardService.getRecentTweets($scope.event._id, 10)
                        .success(function (data) {
                            if (data.hits.hits.length == 0)
                                return; // no data yet
                            
                            $scope.recentTweets = [];
                            for (var i=0; i<data.hits.hits.length; i++) {
                                $scope.recentTweets.push(data.hits.hits[i]._source);
                            }
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                            $scope.showLoader = false;
                        });
                        
                    // Get Top 10 Tweeters
                    dashboardService.getTopTweeters($scope.event._id)
                        .success(function (tweeters) {
                            $scope.topTweeters = [];
                                                        
                            for (var i=0; i<tweeters.aggregations.tweetCount.buckets.length; i++) {
                                
                                if (i==10) break;
                                dashboardService.getTweeterPicWithCount($scope.event._id, tweeters.aggregations.tweetCount.buckets[i].key, tweeters.aggregations.tweetCount.buckets[i].doc_count)
                                    .then(function (data) {
                                        $scope.topTweeters.push({
                                            tweet_profile_image_url: data.tweet_profile_image_url,
                                            doc_count: data.doc_count
                                        });
                                    },
                                    function (error) {
                                    });
                            }
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                            $scope.showLoader = false;
                        });
                        
                }
                
                if ($scope.event && ($scope.event._id != null && $scope.event._id != ''))
                    $scope.load_data();

            }]);

})();
