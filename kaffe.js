var runde = 0;
var tekst = "HVAD MED NOGET COFFEE OG CONCEPTS HOS MIG 20 APRIL KL.20?";

//var tekst = "VAR DET HYGGELIGT AT SNAKKE MED DINE FORÆLDRE OG VÆRE I BAD?";

//var tekst = "Det er dejligt at være                      sammen med dig <3";


$(document).ready(function() {

    for (var i = 0; i < tekst.length; i++) {
        console.log(tekst[i]);
        if (tekst[i] == " ") {
            if (i % 3 === 0) {
                $(".kaffe").append("<br/>");
                console.log("break");
            }else{
            	$(".kaffe").append(" ");
            }
        } else {
            $(".kaffe").append("<span class='bogstav' style='padding:10px'>" + tekst[i] + "</span>");

            $(".bogstav").eq(i).css("font-size", 30 + Math.random() * 2a0);
        }
    }

    $(".bogstav").click(function() {
        console.log($(this).html);
    });
    //console.log(kaffe);
});


window.setInterval(changeText, 50);

function changeText() {

    var int = Math.floor(Math.random() * tekst.length);

    $(".bogstav").eq(int).animate({
        "font-size": 30 + Math.random() * 30,
        "opacity": .2 + Math.random() * 1

    }, 300, function() {
        // Animation complete.
    });

};
