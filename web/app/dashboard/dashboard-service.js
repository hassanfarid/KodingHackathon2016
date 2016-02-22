(function () {
    angular.module('Application').service('dashboardService', ['$http', '$q', '$timeout', '$location', 'appService',
        function ($http, $q, $timeout, $location, appService) {

            // [POST] Get Tweet Count
            this.getTweetCount = function (event_id) {
                var query = {
                    size: 0,
                    aggregations: {
                        tweetCount: {
                            cardinality: {
                                field: "tweet_id"
                            }
                        }
                    }
                };


                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Sentiment Tweet Count
            this.getSentimentTweetCount = function (event_id, sentiment) {
                var query = {
                    query: { match: { tweet_sentiment: sentiment } },
                    size: 0,
                    aggregations: {
                        tweetCount: {
                            cardinality: {
                                field: "tweet_id"
                            }
                        }
                    }
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Gender Sentiment Tweet Count
            this.getGenderSentimentTweetCount = function (event_id, gender, sentiment) {
                var query = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "tweet_gender": gender
                                    }
                                },
                                {
                                    "match": {
                                        "tweet_sentiment": sentiment
                                    }
                                }
                            ]
                        }
                    },
                    "size": 0,
                    "aggregations": {
                        "tweetCount": {
                            "cardinality": {
                                "field": "tweet_id"
                            }
                        }
                    }
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Unique Users
            this.getUniqueUsers = function (event_id) {
                var query = {
                    "size": 0,
                    "aggregations": {
                        "tweetCount": {
                            "cardinality": {
                                "field": "tweet_userid"
                            }
                        }
                    }
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Language Tweet Count
            this.getLanguageTweetCount = function (event_id, language) {
                var query = {
                    "query": { "match": { "tweet_lang": language } },
                    "size": 0,
                    "aggregations": {
                        "tweetCount": {
                            "cardinality": {
                                "field": "tweet_id"
                            }
                        }
                    }
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            
            // [POST] Get Gender Sentiment Last Tweet
            this.getGenderSentimentLastTweet = function (event_id, gender, sentiment) {
                var query = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "tweet_gender": gender
                                    }
                                },
                                {
                                    "match": {
                                        "tweet_sentiment": sentiment
                                    }
                                }
                            ]
                        }
                    },
                    "size": 1,
                    "sort": [
                        { "tweet_timestamp": "desc" }
                    ]
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Recent Tweets
            this.getRecentTweets = function (event_id, limit) {
                var query = {
                    "size": limit,
                    "sort": [
                        { "tweet_timestamp": "desc" }
                    ]
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Top Tweeters
            this.getTopTweeters = function (event_id) {
                var query = {
                    "aggregations": {
                        "tweetCount": {
                            "terms": { "field": "tweet_userid" }
                        }
                    },
                    "size": 0
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };
            
            // [POST] Get Tweeter Pic
            this.getTweeterPic = function (event_id, tweeterId) {
                var query = {
                    "_source": ["tweet_profile_image_url"],
                    "query": { "match": { "tweet_userid": tweeterId } },
                    "size": 1
                };

                return $http.post(appService.elasticURL + '/twitter_' + event_id.toLowerCase() + '/_search/', angular.toJson(query));
            };

            this.getTweeterPicWithCount = function (event_id, tweeterId, count) {
                var deferred = $q.defer();
                this.getTweeterPic(event_id, tweeterId)
                    .success(function (data, status, headers, config) {

                        deferred.resolve({
                            tweet_profile_image_url: data.hits.hits[0]._source.tweet_profile_image_url,
                            doc_count: count
                        });

                    }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            
            




        }]);
})();
