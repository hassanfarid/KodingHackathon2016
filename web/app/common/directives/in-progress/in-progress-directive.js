(function(){
        var inProgress = function(){
            return {
                restrict: 'A',
                link: function(scope, element, attributes){
                    var text = element.html();

                    var showSpinner = function(){
                        element.html('<span><i class="fa fa-spinner fa-spin"></i></span>');
                    };

                    var hideSpinner = function(){
                        element.html(text);
                    };

                    attributes.$observe('inProgress',function(value){
                        if(value == "true"){
                            showSpinner();
                        }
                        else{
                            hideSpinner();
                        }
                    });
                }
            };
        };
        angular.module('Application').directive('inProgress',inProgress);
    }
)();