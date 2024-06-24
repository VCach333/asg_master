document.body.onload = () => {
    $('.sidenav').sidenav();
    $('select').formSelect();
    $('.tooltipped').tooltip();
    $('.materialboxed').materialbox();

    $('.fixed-action-btn').floatingActionButton({
        direction: 'top',
        hoverEnabled: false
    });

    $('.modal').modal({
        preventScrolling: false
    });

    $('.collapsible').collapsible({
        accordion: false
    });
    $('.scrollspy').scrollSpy({
        throttle: 50,
        scrollOffset: 10
    });

    $('.tabs').tabs({
        swipeable: true
    });

    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        firstDay: 1,
        showMonthAfterYear: true,
        showClearBtn: true,
        autoClose: true,
    });

    hide3sFunc(4000);
}

document.body.onscroll = () => {
    hide3sFunc(0);
}

var status;

function modoLimpo() {

    if(status % 2 == 0) {
        document.getElementById('senha').setAttribute('type', 'text');        
        status++;
    } else {
        document.getElementById('senha').setAttribute('type', 'password');        
        status++;
    }
    
}


function hide3sFunc(interval) {
    setInterval(() => {
        var hide3s = document.getElementById('hide_3s');
        hide3s.setAttribute('class', 'hide');
    }, interval);
}