'use strict';
angular.module('myApp.directives')
    .directive('datepicker', function() {
        return {
            scope: {
                date: "=",
                minYear: "=",
                maxYear: "="
            }, 
            restrict: 'AE', 
            replace: false,
            templateUrl: __uri('./partials/w/timePicker.html'),
            link: function($scope, iElm, iAttrs, controller) {

                (function($) {

                    $.fn.WSlot = function( options ) {

                        if(options=='rollTo'){
                            var args = (Array.prototype.slice.call( arguments, 1 ));
                            this.trigger(wslot_rollto,args);
                            return;
                        }

                        if(options=='get'){
                            // this.trigger('WSlot.get');
                            return this.children('div.'+class_item_selected).index();
                        }

                        if(options=='getText'){
                            // this.trigger('WSlot.get');
                            return this.children('div.'+class_item_selected).text();
                        }

                        var opts = $.extend({},$.fn.WSlot.defaults,options);

                        this.off(wslot_rollto).on(wslot_rollto,function(event,to){
                            self = $(this);
                            if(to) {
                                rollTo(self,to);
                            }
                        });

                        var style = {};
                        style['position'] = 'relative';
                        style[xform] = 'rotateY('+opts.rotation+'deg)';
                        style[xform+'-style'] = 'preserve-3d';
                        this.css(style).addClass('wslot-container');

                        var item = '';
                        if(opts.items.length) {

                            var center_index = 0;
                            if(opts.center == 'first') {
                                center_index = 0;
                            } else if(opts.center == 'last') {
                                center_index = opts.items.length - 1;
                            } else if(opts.center == 'center') {
                                center_index = parseInt(opts.items.length / 2);
                            } else if($.isNumeric(opts.center) && (opts.center >= 0) && (opts.center < opts.items.length)) {
                                center_index = opts.center;
                            } else if(opts.center >= opts.items.length) {
                                center_index = opts.items.length-1;
                            } else {
                                center_index = 0;
                            }

                            var distance = parseInt(this.height() / 2);
                            if($.isNumeric(opts.distance)) {
                                distance = opts.distance;
                            }

                            var style = 'position: absolute;left: 0;width: 100%;height: '+opts.item_height+'px;top: 36%;margin-top: -'+Math.round(opts.item_height/2)+'px;';

                            for (var i = 0; i < opts.items.length; i++) {
                                var displayed = "";
                                if (Math.abs(i - center_index) > opts.displayed_length) {
                                    displayed = "display:none;";
                                }
                                var angle = opts.angle * ( center_index - i );
                                var opacity = 0;
                                // var scale = 0.95;
                                var max_angle = opts.angle * opts.displayed_length;
                                if(Math.abs(angle) <= max_angle) {
                                    opacity = 1 - (Math.abs(angle)/(max_angle*2));
                                    // scale = 1 - (Math.abs(angle)/(max_angle*20));
                                }
                                var transform = 'transform:rotateX('+angle+'deg) translate3d(0,0,'+distance+'px);-webkit-transform:rotateX('+angle+'deg) translate3d(0,0,'+distance+'px);';
                                item += '<div class="wslot-item '+((i==center_index)?class_item_selected:'')+'" style="'+transform+displayed+style+'opacity:'+opacity+';line-height:30px">'+opts.items[i]+'</div>';
                            }

                            return this.html(item).data('cur-angle',(center_index*opts.angle))
                                .off(start).on(start, function(e) {
                                    //console.log('start '+getEventPos(e).y);
                                    var ini = $(this);
                                    ini.children().removeClass('wslot-item-selected');
                                    ini.addClass('w-roll-touched').data('initialtouch', getEventPos(e).y);
                                    return false;
                                }).off(move).on(move, function(e) {
                                    var ini = $(this);
                                    ini.children().removeClass('wslot-item-selected');
                                    if (ini.is('.w-roll-touched')) {
                                        var deltaY = ini.data('initialtouch') - getEventPos(e).y;
                                        // console.log('move '+deltaY);
                                        var mainAngle = parseInt(ini.data('cur-angle')) + parseInt(deltaY/2);

                                        var maxAngle = (opts.items.length - 1) * opts.angle;
                                        if (mainAngle < 0) {
                                            var excess = 0 - mainAngle;
                                            mainAngle = -(25*excess/(excess+25));
                                        } else if (mainAngle > maxAngle) {
                                            var excess = mainAngle - maxAngle;
                                            mainAngle = maxAngle + (25*excess/(excess+25));
                                        }

                                        ini.children('div').each(function () {
                                            var curr = $(this);
                                            var options = {};
                                            var currAngle = mainAngle-(curr.index()*opts.angle);
                                            options['display'] = '';
                                            if(Math.abs(currAngle) > opts.displayed_length*opts.angle) {
                                                options['display'] = 'none';
                                            }
                                            var opacity = 0;
                                            // var scale = 0.95;
                                            var max_angle = opts.angle * opts.displayed_length;
                                            if(Math.abs(currAngle) <= max_angle) {
                                                opacity = 1 - (Math.abs(currAngle)/(max_angle*2));
                                                // scale = 1 - (Math.abs(currAngle)/(max_angle*20));
                                            }
                                            options[xform] = 'rotateX('+currAngle+'deg) translateZ('+distance+'px)';
                                            options['opacity'] = opacity;
                                            curr.css(options);
                                        });
                                    }
                                    return false;
                                }).off(end).on(end, function(e) {
                                    var ini = $(this);
                                    //console.log('end');
                                    if (ini.is('.w-roll-touched')) {
                                        var deltaY = ini.data('initialtouch') - getEventPos(e).y;

                                        var mainAngle = parseInt(ini.data('cur-angle')) + parseInt(deltaY/2);

                                        var maxAngle = (opts.items.length - 1) * opts.angle;

                                        var index = Math.round(mainAngle / opts.angle);

                                        if (mainAngle < 0) {
                                            var excess = 0 - mainAngle;
                                            mainAngle = -(25*excess/(excess+25));
                                            index = 0;
                                        } else if (mainAngle > maxAngle) {
                                            var excess = mainAngle - maxAngle;
                                            mainAngle = maxAngle + (25*excess/(excess+25));
                                            index = (opts.items.length - 1);
                                        }

                                        ini.data('cur-angle',mainAngle);

                                        rollTo(ini,index);
                                    }
                                    ini.removeClass('w-roll-touched')
                                    return false;
                                });
                        } else {
                            return this;
                        }

                        function rollTo(objek,index){
                            if (index < 0) {
                                index = 0;
                            } else if (index >= opts.items.length) {
                                index = opts.items.length - 1;
                            }
                            var fromAngle = parseInt(objek.data('cur-angle'));
                            var toAngle = index * opts.angle;
                            var deltaAngle = toAngle - fromAngle;
                            animationStep(10,1,function(step,curStep,objek){
                                var mainAngle = easeOutQuad(curStep,fromAngle,deltaAngle,step);
                                objek.children('div').each(function () {
                                    var curr = $(this);
                                    var options = {};
                                    var currAngle = mainAngle-(curr.index()*opts.angle);
                                    options['display'] = '';
                                    if(Math.abs(currAngle) > opts.displayed_length*opts.angle) {
                                        options['display'] = 'none';
                                    }
                                    var opacity = 0;
                                    // var scale = 0.95;
                                    var max_angle = opts.angle * opts.displayed_length;
                                    if(Math.abs(currAngle) <= max_angle) {
                                        opacity = 1 - (Math.abs(currAngle)/(max_angle*2));
                                        // scale = 1 - (Math.abs(currAngle)/(max_angle*20));
                                    }
                                    options[xform] = 'rotateX('+currAngle+'deg) translateZ('+distance+'px)';
                                    options['opacity'] = opacity;
                                    curr.css(options);
                                });
                            },function(objek){
                                objek.children('div').each(function () {
                                    var curr = $(this).removeClass(class_item_selected);
                                    var options = {};
                                    var currAngle = toAngle-(curr.index()*opts.angle);
                                    options['display'] = '';
                                    if(Math.abs(currAngle) > opts.displayed_length*opts.angle) {
                                        options['display'] = 'none';
                                    }
                                    var opacity = 0;
                                    // var scale = 0.95;
                                    var max_angle = opts.angle * opts.displayed_length;
                                    if(Math.abs(currAngle) <= max_angle) {
                                        opacity = 1 - (Math.abs(currAngle)/(max_angle*2));
                                        // scale = 1 - (Math.abs(currAngle)/(max_angle*20));
                                    }
                                    options[xform] = 'rotateX('+currAngle+'deg) translateZ('+distance+'px)';
                                    options['opacity'] = opacity;
                                    curr.css(options);
                                    if(currAngle == 0) {
                                        curr.addClass(class_item_selected);
                                    }
                                });
                                objek.data('cur-angle',toAngle);
                                objek.trigger('WSlot.change',[index]);
                            },objek);
                        };

                    };

                    $.fn.WSlot.defaults = {
                        items : [],
                        center : 'first',
                        distance : 'auto',
                        displayed_length : 2,
                        angle : 40,
                        rotation : 0,
                        item_height : 30,
                    };

                    var xform = 'transform';
                    ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
                        var e = prefix + 'Transform';
                        if (typeof document.body.style[e] !== 'undefined') {
                            xform = e;
                        }
                    });

                    var start = 'touchstart mousedown';
                    var move = 'touchmove mousemove';
                    var end = 'touchend mouseup mouseleave';
                    var wslot_rollto = 'WSlot.rollTo';
                    var class_item_selected = 'wslot-item-selected';

                    function animationStep(step, curStep, stepFunc, doneFunc, objek){
                        if(curStep <= step)
                        {
                            if(typeof stepFunc == 'function')
                            {
                                stepFunc(step,curStep,objek);
                            }
                            curStep = curStep+1;
                            window.requestAnimationFrame(function() {
                                animationStep(step,curStep,stepFunc,doneFunc,objek);
                            });
                        }
                        else
                        {
                            if(typeof doneFunc == 'function')
                            {
                                doneFunc(objek);
                            }
                        }
                    };

                    function getEventPos(e) {
                        //jquery event
                        if (e.originalEvent) {
                            // touch event
                            if (e.originalEvent.changedTouches && (e.originalEvent.changedTouches.length >= 1)) {
                                return {
                                    x: e.originalEvent.changedTouches[0].pageX,
                                    y: e.originalEvent.changedTouches[0].pageY
                                };
                            }
                            // mouse event
                            return {
                                x: e.originalEvent.clientX,
                                y: e.originalEvent.clientY
                            };
                        } else {
                            // touch event
                            if (e.changedTouches && (e.changedTouches.length >= 1)) {
                                return {
                                    x: e.changedTouches[0].pageX,
                                    y: e.changedTouches[0].pageY
                                };
                            }
                            // mouse event
                            return {
                                x: e.clientX,
                                y: e.clientY
                            };
                        }
                    };

                    function easeOutQuad(t, b, c, d) {
                        return -c * (t /= d) * (t - 2) + b;
                    };
                })(jQuery);

                var today = $scope.date;
                if(today.getFullYear()==2013){
                    var _indexYear = 100 - (new Date().getFullYear() - 2013);
                }else{
                    var _indexYear = 100 - (new Date().getFullYear() - 1985);
                }
                
                $('.month').WSlot({
                    items:['01','02','03','04','05','06','07','08','09','10','11','12'],
                    center:5,
                    angle:18,
                    distance:'auto',
                    displayed_length:2,
                    rotation:0
                }).on('WSlot.change',function(e,index){
                    // console.log(index);
                    initDate(index,parseInt($('.year').WSlot('getText')),$('.day').WSlot('get'));
                    updateText();
                });

                initDate(today.getMonth(),today.getFullYear(),today.getDate()-1);

                var years = [];
                for (var i = parseInt($scope.minYear); i <= parseInt($scope.maxYear); i++) {
                    years.push(i);
                };
                $('.year').WSlot({
                    items:years,
                    center:_indexYear,
                    angle:18,
                    distance:'auto',
                    displayed_length:2,
                    rotation:0
                }).on('WSlot.change',function(e,index){
                    initDate(parseInt($('.month').WSlot('get')),parseInt($('.year').WSlot('getText')),$('.day').WSlot('get'));
                    updateText();
                });
                


                function updateText() {
                    var dd = ('0'+($('.day').WSlot('get')+1)).slice(-2);
                    var mm = ('0'+($('.month').WSlot('get')+1)).slice(-2);
                    var yyyy = $('.year').WSlot('getText');
                    var todaystring = yyyy+'-'+mm+'-'+dd;
                    $scope.date = new Date(todaystring);
                    $scope.$apply();
                }

                function initDate(month,year,selected) {
                    var totalDay = daysInMonth(month,year);
                    var days = [];
                    for (var i = 1; i <= totalDay; i++) {
                        var _dd ;
                        if(i<10){
                            _dd="0"+i;
                        }else{
                            _dd=i
                        }
                        days.push(_dd);
                    };
                    $('.day').empty().WSlot({
                        items:days,
                        center:selected,
                        angle:18,
                        distance:'auto',
                        displayed_length:2,
                        rotation:0
                    }).off('WSlot.change').on('WSlot.change',function(e,index){
                        // console.log(index);
                        updateText();
                    });
                }

                function daysInMonth(month,year) {
                    return new Date(year, month+1, 0).getDate();
                }

                $scope.makeSure = function(){
                    $scope.$emit('_date',$scope.date);
                    $scope.show = false;
                }

                $scope.close = function(){
                     $scope.show = false;
                }

                $scope.$on("show", function(e, m) {
                    $scope.show = m;
                })
            }
        };
    });