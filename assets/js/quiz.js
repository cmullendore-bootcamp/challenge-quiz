
var questionData = "./assets/data/questions.json";
var timerDefault = 60;
var timerCurrent = timerDefault;

var timerInterval = null;

var maxScore = 0;

var currentScore = 0;

var questions = [];

$.getJSON(questionData, function(data) {
    data.Questions.forEach(element => {
        maxScore += 10;
        questions.push(element);
    });
});

var highScoresData = localStorage.getItem("highScores");
var highScores = [];

if (highScoresData) {
    highScores = JSON.parse(highScoresData);
}

var completionDialog = $("#completion-container" ).dialog({
    autoOpen: false,
    title: "Save High Score",
    height: 400,
    width: 350,
    modal: true
});

var highScoresDialog = $("#highscores-container" ).dialog({
    autoOpen: false,
    title: "High Score",
    height: 400,
    width: 350,
    modal: true
});

form = completionDialog.find( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    var initials = $("#initials").val();
    SaveScore(initials, currentScore, maxScore);
    completionDialog.dialog("close");
});

function SaveScore(initials, current, max) {
    highScores.push({
        initials: initials,
        current: current,
        max: max
    })

    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function intervalTick() {
    timerCurrent -= 1;

    $("#countdown-timer").text("Seconds Remaining: " + timerCurrent);

    if (timerCurrent <= 0) {
        $("#countdown-timer").text("Time Expired!");
        EndQuiz();
    }
}

function EndQuiz() {
    clearInterval(timerInterval);
    $("#questions-container").empty();
    completionDialog.dialog("open");
    $("#end-container")
        .removeClass("invisible");
}

function NextQuestion() {
    var question = questions.pop();
    if (!question) {
        EndQuiz();
    }

    $("#question").text(question.text);
    var answers = $("#answers");
    answers.empty();
    question.answers.forEach(function(item) {
        var newItem = $("<li>");
        newItem.text(item.text);
        newItem.val(item.id);
        newItem.addClass("btn btn-block mx-2 my-2 px-3 p1-3 ui-selectee");
        answers.append(newItem);
    });
}

$("#start-btn").on("click", function() {
    $("#welcome-container").empty();
    NextQuestion();
    $("#welcome-container").addClass("invisible");
    $("#questions-container").removeClass("invisible");
    timerCurrent = timerDefault;
    $("#countdown-timer").text("Seconds Remaining: " + timerCurrent);
    timerInterval = setInterval(intervalTick, 1000);
});

$("#highscores-header").on("click", function() {
    var hsCont = $("#highscores-container");
    hsCont.empty();
    highScores.forEach(function(item) {
        $newRow = $("<div>")
            .addClass("row")
            .html("<p>" + item.initials + ": " + item.current + "/" + item.max + "</p>");
        
        hsCont.append($newRow);
    });
    highScoresDialog.dialog("open");

});

$("#answers").selectable({
    selected: function( event, ui ) {
        if(ui.selected.value) {
            currentScore += 10;
        }
        NextQuestion();
    }
  });

  

