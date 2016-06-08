var runde = 0;
var user_select;
var rotateCSS;
var hovering = false;
var opg_type;
var json_Array = [];
var revert = false;

var score = 0;

$(document).ready(function() {

    if (jsonData[0].Konklusion) {
        $(".instr_container").html(instruction("Du skal vurdere konklusionen og swipe til højre hvis den er god og til venstre hvis den er dårlig"));
        opg_type = "konklusion";
    } else {
        $(".instr_container").html(instruction("Du skal vurdere problemformuleringen og swipe til højre hvis den er god og til venstre hvis den er dårlig"));
        opg_type = "problemformulering"
        shuffle_Array(jsonData);
        $(".tinder_container").css("height", "750px");
    }

    console.log(typeof(runde));
    enable_audio();
    generateHTML();
    makeDraggable();

    $(".btn_no, .btn_yes").click(function() {
        console.log(this);
        var class_type = $(this).attr("class").split(' ')[4];
        btn_click(class_type);
    });


    $(".dropzone").droppable({
        drop: function(event, ui) {
            var class_type = $(this).attr("class").split(' ')[1];

            if (class_type == "dropzone_no") {
                user_select = false;
                ui.draggable.animate({
                    opacity: 1,
                    left: "-=1400"
                }, 200, function() {
                    feedback(ui);
                });

            } else if (class_type == "dropzone_yes") {
                user_select = true;
                //UserMsgBox("body", "<h3>Du har svaret <span class='label label-danger'>Forkert</span> </h3><h3> Feedback:</h3><p>Lorem ipsum....</p>");

                ui.draggable.animate({
                    opacity: 1,
                    left: "+=1400"
                }, 200, function() {
                    feedback(ui);
                });
            }
        },
        hoverClass: function(event, ui, is_valid_drop) {
            var dropclass = $(this).attr("class").split(' ')[1];

            if (dropclass == "dropzone_no") {
                $(".txt_vurdering").eq(0).css("opacity", 1);
                $(".txt_vurdering").eq(0).html("<span class='label label-danger'>Dårlig " + opg_type + "</span>");
            } else if (dropclass == "dropzone_yes") {
                $(".txt_vurdering").eq(0).css("opacity", 1);
                $(".txt_vurdering").eq(0).html("<span class='label label-success'>God " + opg_type + "</span>");
            }
        }
    });

});

function generateHTML() {
    //alert(jsonData.length);

    for (var i = 0; i < jsonData.length; i++) {


        $(".tinder_container").append("<div class='text_container tinder_card card_" + i + "'></div>");
        if (opg_type == "problemformulering") {
            $(".tinder_card").eq(i).html("<p class='card_header'><b>Nøgleproblem:</b> " + jsonData[i].Nogleproblem + "</p><p class='card_text'>''" + jsonData[i].Problemformulering + "''</p><div class='txt_vurdering'></div>");
        } else {
            $(".tinder_card").eq(i).html("<p class='card_header card_header_konkl'><b>Problemformulering:</b> ''" + jsonData[i].Problemformulering + "''</p><p class='card_text_konkl'></p><p class='card_text_konkl'>''" + jsonData[i].Konklusion + "''</p><div class='txt_vurdering'></div>");
        }
        $(".tinder_card").eq(i).css("z-index", 20 - i);
        $(".tinder_card").eq(i).css("margin-top", i * 7);
        if (i > 4) {
            $(".tinder_card").eq(i).fadeOut(0);
        }
    }
    $(".knap_container").css("z-index", 1);
    $(".txt_vurdering").css("opacity", 0);

    $(".tinder_container").append('<div class="knap_container col-md-12"><div class="btn_tinder btn-lg btn btn-info btn_no"><span class="glyphicon glyphicon-remove"></span></div><div class="btn_tinder btn btn-info btn-lg btn_yes"><span class="glyphicon glyphicon-heart"></span></div></div>');
    //$(".boxit").boxfit({ multiline: true });
    //$(".card_text").boxfit({ multiline: true });
    //$(".tinder_container .tinder_card").shuffle_div_position();
};

function makeDraggable() {
    $(".tinder_card").eq(0).draggable({
        revert: function(is_valid_drop) {
            if (is_valid_drop) {

            } else {

                revert = true;
                $(this).css({
                    '-moz-transform': 'rotate(0deg)',
                    '-webkit-transform': 'rotate(0deg)',
                });

                $(".txt_vurdering").eq(0).css("opacity", 0);
                return true;

            }
        },
        axis: "x",
        containment: "body",
        revertDuration: 500,
        start: function(event, ui) {
            updateStack();
        },

        drag: function(event, ui) {
            var body_width = $("body").width() / 2;
            var this_width = $(this).width() / 2;
            var x_pos = body_width - this_width;

            //console.log("BW:" + body_width + ", this_width: " + this_width + "hej: " + x_pos);
            rotateCSS = 'rotate(' + (($(this).offset().left - x_pos) / 20) + 'deg)';
            //console.log("offset: " + $(this).offset().left);
            $(this).css({
                '-moz-transform': rotateCSS,
                '-webkit-transform': rotateCSS
            });
        },
        stop: function(event, ui) {
            if (jsonData[runde].Korrekt === user_select && revert == false) {
                correct_sound();
                score++;
                console.log("Score: " + score + "LEnght: " + jsonData.length);

            } else if (jsonData[runde].Korrekt != user_select && revert == false) {
                error_sound();
            }
            revert = false;
        },
    });
}

function feedback(ui) {



    if (jsonData[runde].Korrekt == user_select) {
        var svar_type = "<span class='label label-success'>Rigtigt</span>"; //$(".svar").html("Du svarede rigtigt.");
        //correct_sound();
    } else if (jsonData[runde].Korrekt != user_select) {
        var svar_type = "<span class='label label-danger'>Forkert</span>"; //$(".svar").html("Du svarede forkert.");
        //error_sound();
    }
    console.log("Runde: " + runde + ", Korrekt: " + jsonData[runde].Korrekt + ", " + user_select);
    if (opg_type == "problemformulering") {
        if (jsonData[runde].Korrekt === true) {
            UserMsgBox("body", "<h3>Du svarede " + svar_type + "</h3><p class='hidden-xs hidden-sm'>'" + jsonData[runde].Problemformulering + "' <br/><br/>Denne " + opg_type + " er  <span style='font-size:14px; font-weight:100' class='label label-success'>God</span></p><h4>Hvorfor den er god:</h4><p>" + jsonData[runde].Feedback + "</p>");
        } else if (jsonData[runde].Korrekt === false) {
            UserMsgBox("body", "<h3>Du svarede " + svar_type + "</h3><p class='hidden-xs hidden-sm'>'" + jsonData[runde].Problemformulering + "' <br/><br/>Denne " + opg_type + " er  <span style='font-size:14px; font-weight:100' class='label label-danger'>Dårlig</span></p><h4>Hvorfor den er dårlig:</h4><p>" + jsonData[runde].Feedback + "</p>");
        }
    } else if (opg_type == "konklusion") {
        if (jsonData[runde].Korrekt === true) {
            UserMsgBox("body", "<h3>Du svarede " + svar_type + "</h3><p class='hidden-xs hidden-sm'>'" + jsonData[runde].Konklusion + "' <br/><br/>Denne " + opg_type + " er  <span style='font-size:14px; font-weight:100' class='label label-success'>God</span></p><h4>Hvorfor den er god:</h4><p>" + jsonData[runde].Feedback + "</p>");
        } else if (jsonData[runde].Korrekt === false) {
            UserMsgBox("body", "<h3>Du svarede " + svar_type + "</h3><p class='hidden-xs hidden-sm'>'" + jsonData[runde].Konklusion + "' <br/><br/>Denne " + opg_type + " er  <span style='font-size:14px; font-weight:100' class='label label-danger'>Dårlig</span></p><h4>Hvorfor den er dårlig:</h4><p>" + jsonData[runde].Feedback + "</p>");
        }
    }


    $(".tinder_card").eq(0).remove();
    runde++;
    //generateHTML();
    //makeDraggable();
    updateStack();
}

function updateStack() {
    //console.log("hej");
    $(".tinder_card").each(function(index) {
        var ny_margin = index * 7 + "px";
        $(".tinder_card").eq(index).css("margin-top", ny_margin);
        if (index < 6) {
            $(".tinder_card").eq(index).fadeIn();
        }
    });

    if (runde >= jsonData.length) {
        slutFeedback();
    }
    makeDraggable();
}

function btn_click(class_type) {

    if (class_type == "btn_no") {
        user_select = false;
        var rotate = 0;
        var pos = "-=400";
    } else if (class_type == "btn_yes") {
        user_select = true;

        var rotate = 0;
        var pos = "+=400";
    }

    if (jsonData[runde].Korrekt == user_select) {
        correct_sound();
    } else {
        error_sound();
    }

    $(".tinder_card").eq(0).css({
        '-moz-transform': 'rotate(' + rotate + 'deg)',
        '-webkit-transform': 'rotate(' + rotate + 'deg)',
    });

    $(".tinder_card").eq(0).animate({
        left: pos,
        opacity: "0"
    }, 400, function() {



        feedback($(".tinder_card"));
        //$(".tinder_card").eq(0).remove();
        //updateStack();
    });
}

function slutFeedback() {
    var pct = Math.floor(score / jsonData.length * 100);
    var ord = "";
    var label = "";
    if (pct < 33) {
        ord = "Ikke et godt match :-(";
        label = "label-danger";

    } else if (pct < 67) {
        ord = "Et halvårligt match :-/";
        label = "label-warning";
    } else {
        ord = "Et godt match :-)";
        label = "label-success";
    }

    $(".tinder_container").html("<div class ='slutFeedback'><h2>" + ord + "<h2><h3>Du har <div class='label_container'><span class='label label-lg " + label + "'>" + pct + "%</span></div>rigtige svar i opgaven om " + opg_type + "er</h3><div class='btn btn-primary btn_again'>PRØV IGEN</div></div>");

    $(".btn_again").click(function() {
        location.reload();
    });
}
