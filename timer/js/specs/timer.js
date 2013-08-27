describe('Timer: ', function () {
    beforeEach(function () {
        $('body').append($('<div class="fixture-container"><div class="fixture"></div></div>'));
        fixtureContainer = $('body .fixture-container');
        fixture = $('body .fixture');
    });

    afterEach(function () {
        fixtureContainer.empty();
    });

    it('Should display a timer widget when invoked', function () {
        fixture.timer();
        expect(fixture.hasClass('timer-widget')).toBe(true);
    });

    it('Should display a start time of two minutes when invoked', function () {
        fixture.timer();
        expect(fixture.children('.timer-widget-digits').text()).toEqual('2:00');
    });

    it('Should display a given start time when supplied as an option', function () {
        fixture.timer({minutes: 3});
        expect(fixture.children('.timer-widget-digits').text()).toEqual('3:00');
    });

    it('Should throw an exception if a start time is not supplied as an integer', function () {
        var brokenInvokation = function () {
            fixture.timer({minutes: '3'});
        };

        expect(brokenInvokation).toThrow();
    });

    describe('When the widget is clicked', function () {
        beforeEach(function () {
            jasmine.Clock.useMock();
            fixture.timer();
            fixture.trigger('click');
        });

        afterEach(function () {
            fixture.data('timer').stop();
        });

        // This is an example of specifying inner state and
        // should generally be discouraged
        it('The timer should start', function () {
            expect(fixture.data('timer').state()).toEqual('started');
        });

        // This is an example of specifying interaction with
        // other things, which is better
        it('The timer should start', function () {
            expect(fixture.data('timer').time()).toEqual('2:00');
            jasmine.Clock.tick(3001);
            expect(fixture.data('timer').time()).not.toEqual('2:00');
        });

        // This is an example of specifying inner state and
        // should generally be discouraged
        it('The timer should stop on a subsequent click', function () {
            fixture.trigger('click');
            expect(fixture.data('timer').state()).toEqual('stopped');
        });

        // This is an example of specifying interaction with
        // other things, which is better
        it('The timer should stop on a subsequent click', function () {
            expect(fixture.data('timer').time()).toEqual('2:00');
            fixture.trigger('click');
            jasmine.Clock.tick(3001);
            expect(fixture.data('timer').time()).toEqual('2:00');
        });
    });

    describe('When the timer has been started', function () {
        beforeEach(function () {
            jasmine.Clock.useMock();
            fixture.timer();
            fixture.data('timer').start();
        });

        afterEach(function () {
            fixture.data('timer').stop();
            fixture.data('timer').destroy();
        });

        it('The timer value should start counting down', function () {
            expect(fixture.data('timer').time()).toEqual('2:00');

            jasmine.Clock.tick(1001);
            expect(fixture.data('timer').time()).toEqual('1:59');

            jasmine.Clock.tick(1000);
            expect(fixture.data('timer').time()).toEqual('1:58');

        });

        it('The timer should stop counting down after it is stopped', function () {
            expect(fixture.data('timer').time()).toEqual('2:00');

            jasmine.Clock.tick(1001);
            expect(fixture.data('timer').time()).toEqual('1:59');

            jasmine.Clock.tick(1000);
            expect(fixture.data('timer').time()).toEqual('1:58');

            fixture.data('timer').stop();

            jasmine.Clock.tick(2000);
            expect(fixture.data('timer').time()).toEqual('1:58');        
        });
    });

    describe('When the timer has been started', function () {
        beforeEach(function () {
            fixture.timer();
            fixture.data('timer').start();
        });

        afterEach(function () {
            fixture.data('timer').stop();
            fixture.data('timer').destroy();
        });

        // Asynchronous version of 'timer should start counting down'
        it('The timer value should start counting down', function () {
            expect(fixture.data('timer').minutes()).toEqual(2);
            // TopTip: don't use this with jasmine.Clock.useMock()!
            waitsFor(function () {
                return (fixture.data('timer').minutes() < 2);
            }, 'the timer to start counting down', 1100);

            runs(function () {
                expect(fixture.data('timer').minutes()).toBeLessThan(2);
            });
        });
    });

    describe('When the timer hits zero', function () {
        var callback;

        beforeEach(function () {
            jasmine.Clock.useMock();
            callback = jasmine.createSpy('callback');
            fixture.timer({minutes: 0, seconds: 2, onZero: callback});
            fixture.data('timer').start();
        });

        afterEach(function () {
           fixture.data('timer').stop();
           fixture.data('timer').destroy();
        });

        it('the timer should stop counting down and stay at zero', function () {
            expect(fixture.data('timer').time()).toEqual('0:02');

            jasmine.Clock.tick(1001);
            expect(fixture.data('timer').time()).toEqual('0:01');

            jasmine.Clock.tick(1000);
            expect(fixture.data('timer').time()).toEqual('0:00');

            jasmine.Clock.tick(2000);
            expect(fixture.data('timer').time()).toEqual('0:00');
        });

        it('the timer should reset when the widget is clicked', function () {
            jasmine.Clock.tick(3000);
            fixture.trigger('click');
            expect(fixture.data('timer').time()).toEqual('0:02');
        });

        it('the timer should call a callback', function () {
            jasmine.Clock.tick(3000);
            expect(callback).toHaveBeenCalled();
        });
    });
});