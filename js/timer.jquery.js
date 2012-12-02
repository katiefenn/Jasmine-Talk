// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

(function($) {

    $.timer = function(element, options) {

        var defaults = {
            foo: 'bar',
            onStart: function() {},
            onZero: function () {},
            clock: {
                start: function () {
                    this.clock = setInterval(function () {
                        plugin.tick();
                    }, 1000);
                },
                stop: function () {
                    clearInterval(this.clock);
                }
            },
            minutes: 2,
            seconds: 0
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            $element.data('state', 'stopped');
            $element.data('seconds', plugin.settings.seconds);
            $element.data('minutes', plugin.settings.minutes);
            
            prepareWidget();
            prepareEvents();

            plugin.time($element.data('minutes'), $element.data('seconds'));
        }

        plugin.destroy = function () {
            if ($element.data('ticker')) {
                clearInterval($element.data('clock'));
            }

            $element.removeClass('timer-widget');
            $element.empty();
        }

        plugin.start = function () {
            $element.data('state', 'started');
            plugin.settings.clock.start();
        }

        plugin.stop = function () {
            $element.data('state', 'stopped');
            plugin.settings.clock.stop();
        }

        plugin.reset = function () {
            plugin.time(plugin.settings.minutes, plugin.settings.seconds);
        }

        plugin.state = function () {
            return $element.data('state');
        }

        plugin.time = function (minutes, seconds) {
            if (minutes == undefined && seconds == undefined) {
                if (plugin.seconds() < 10) {
                    return $element.data('minutes') + ':0' + $element.data('seconds');
                }
                return $element.data('minutes') + ':' + $element.data('seconds');
            } 

            plugin.minutes(minutes);
            plugin.seconds(seconds);
        }

        plugin.seconds = function (seconds) {
            if (seconds == undefined) {
                return $element.data('seconds');
            }

            if (typeof seconds != 'number') {
                throw {
                    name: 'Type error',
                    level: 'Blocker',
                    message: 'Resource provided to loader should be of type string or array'
                };
            }

            $element.data('seconds', seconds);
            $element.data('digits').text(plugin.time());
        };

        plugin.minutes = function (minutes) {
            if (minutes == undefined) {
                return $element.data('minutes');
            }

            if (typeof minutes != 'number') {
                throw {
                    name: 'Type error',
                    level: 'Blocker',
                    message: 'Resource provided to loader should be of type string or array'
                };
            }

            $element.data('minutes', minutes);
            $element.data('digits').text(plugin.time());
        };

        plugin.isZero = function () {
            if ($element.data('minutes') == 0 && $element.data('seconds') == 0) {
                return true;
            }

            return false;
        }

        plugin.tick = function () {
            var minutes = plugin.minutes(),
                seconds = plugin.seconds();

            if (seconds == 0) {
                if (minutes == 0) {
                    plugin.settings.onZero();
                    plugin.stop();
                } else {
                    minutes = minutes - 1;
                    seconds = 59;
                }                
            } else {
                seconds = seconds - 1;
            }

            plugin.time(minutes, seconds);
        }

        var prepareWidget = function () {
            $element.addClass('timer-widget');

            var digits = $('<div class="timer-widget-digits"></div>');
            $element.append(digits);

            $element.data('digits', $element.children('.timer-widget-digits'));
        }

        var prepareEvents = function () {
            $element.bind('click', function () {
                if (plugin.state() == 'stopped') {
                    if (!plugin.isZero()) {
                        plugin.start();
                    } else {
                        plugin.reset();
                    }
                } else {
                    plugin.stop();
                }
            });
        }

        plugin.init();
    }

    $.fn.timer = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('timer')) {
                var plugin = new $.timer(this, options);
                $(this).data('timer', plugin);
            }
        });

    }

})(jQuery);