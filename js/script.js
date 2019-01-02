jQuery(function($){
    var Coords = {
        screenX: 0 ,
        screenY: 0
    };
    function getDist(x1,x2,y1,y2) {
        return Math.pow((Math.pow((x1-x2),2)+Math.pow((y1-y2),2)),0.5);
    }
    $('body').on('mouseenter', 'a', function(e) {
        Coords.screenX = e.screenX;
        Coords.screenY = e.screenY;
        var o = this;
        if ( o.href != '#' ) {
            chrome.runtime.sendMessage({method: 'show' , url: o.href , Coords: {x: e.screenX , y: e.screenY }}, function(r) {
                console.log(r.Coords.x ,  Coords.screenX , r.Coords.y , Coords.screenY );
                console.log(getDist(r.Coords.x ,  Coords.screenX , r.Coords.y , Coords.screenY ));
                if(getDist(r.Coords.x ,  Coords.screenX , r.Coords.y , Coords.screenY ) < 30) {
                    var uri = $.url.parse(o.href),
                        position,
                        text = "<img  style = \"display: block;\n" +
                            "  max-width:200px;\n" +
                            "  max-height:200px;\n" +
                            "  width: auto;\n" +
                            "  height: auto;\" src='data:image/jpeg;base64," + r.dataUrl + "'/>";
                    // Check if is a tooltip or not
                    if (r.istooltip) {
                        position = {
                            my: 'top left',
                            target: 'mouse',
                            viewport: $(window),
                            adjust: {
                                y: +25
                            }
                        }
                    } else {
                        position = {
                            my: r.position,
                            at: r.position,
                            target: $(window),
                            adjust: {
                                y: ( r.position === 'left bottom' ? -20 : 0 )
                            }
                        }
                    }
                    // Is the target a new window?
                    if ( $(o).attr('target') == '_blank' ) text = '<i class="fa fa-external-link-square" style="padding-right: 5px;"></i>' + text;
                    // Show the qtip
                    $(o).qtip({
                        overwrite: false,
                        content: {
                            text: text
                        },
                        show: {
                            event: e.type,
                            ready: true,
                            delay: r.time
                        },
                        hide: {
                            fixed: true
                        },
                        position: position,
                        style: {
                            classes: 'qtip-dark',
                            tip: {
                                corner: false
                            }
                        }
                    }, e);
                }
            })
        }
    }).on('mouseleave', 'a', function(e){
        $(this).qtip('destroy');
    })
});