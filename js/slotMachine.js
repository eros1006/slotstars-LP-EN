$(document).ready(function () {

    function slotDesktop(){
        let step = 0;

        $(".js-slot").click(function() {
            $(this).addClass("disabled");
            var steps = 2 - step;
            $(".--counter").html(steps);
            if (step == 0) {
                $(".slot__col").each(function () {
                    $(this).css('transition', 'transform ' + $(this).data("time") + ' ease-in-out');
                });
                $(".slot__col:nth-child(1)").css('transform', 'translateY(-0.5%)');
                $(".slot__col:nth-child(2)").css('transform', 'translateY(-0.5%)');
                $(".slot__col:nth-child(3)").css('transform', 'translateY(-5.5%)');
                $(".slot__col:nth-child(4)").css('transform', 'translateY(-2.2%)');
                $(".slot__col:nth-child(5)").css('transform', 'translateY(-0.5%)');
            }
            if (step == 1) {
                $(".slot__col").each(function () {
                    $(this).css('transition', 'transform ' + $(this).data("time") + ' ease-in-out');
                    $(this).css('transform', 'translateY(-76.3%)');
                });
            }
            if (step == 2) {
                $(".slot__col").each(function () {
                    $(this).css('transition', 'transform ' + $(this).data("time") + ' ease-in-out');
                });
                $(".slot__col:nth-child(1)").css('transform', 'translateY(-0.5%)');
                $(".slot__col:nth-child(2)").css('transform', 'translateY(-0.5%)');
                $(".slot__col:nth-child(3)").css('transform', 'translateY(-5.5%)');
                $(".slot__col:nth-child(4)").css('transform', 'translateY(-2.2%)');
                $(".slot__col:nth-child(5)").css('transform', 'translateY(-7.1%)');
            }

            setTimeout(() => {
                $(".slot__win[data-step=" + (step + 1) +"]").addClass('is-active');
                $(".js-slot").removeClass("disabled");
                step++;
                setTimeout(() => {
                    if (step == 3) {
                        $(".slot__col").each(function() {
                            $(this).css('transition', '');
                            let offset = '-93.1%';
                            if ( $(this).data("offset") !== undefined )
                                offset = 'calc(-93.1% + '+ $(this).data("offset") +')';
                            $(this).css('transform', 'translateY('+ offset +')');
                        });

                        console.log('show result...');
                        app.setState('reg');

                        $(".--counter").html('3');
                        $(".slot__win").removeClass('is-active');
                        step = 0;
                    }
                }, 1000);
            }, 2000);
        });
    }

    slotDesktop();
});