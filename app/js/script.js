let gameDifficulty = null;
let gameBoard;
let minutes, seconds;
let timerInterval;

$(document).ready(async function () {
    $("header").hide();
    $("main").hide();
    $(".main__timer").hide();
    $(".main__toast").hide();
    $(".main__board").hide();
    $(".main__again").hide();
    await sleep(1000);
    $("header").fadeIn("slow");
    await sleep(2000);
    $("header").fadeOut("slow", function () {
        $("main").fadeIn("slow");
    });
});

$("#difficulty__easy").hover(function (e) {
    $(this).addClass("selected");
    $("#difficulty__normal").removeClass("selected");
    $("#difficulty__hard").removeClass("selected");
}, function (e) {
    if (!gameDifficulty) {
        $(".difficulty__button").removeClass("selected");
    }
});

$("#difficulty__normal").hover(function (e) {
    $("#difficulty__easy").addClass("selected");
    $(this).addClass("selected");
    $("#difficulty__hard").removeClass("selected");
}, function (e) {
    if (!gameDifficulty) {
        $(".difficulty__button").removeClass("selected");
    }
});

$("#difficulty__hard").hover(function (e) {
    $("#difficulty__easy").addClass("selected");
    $("#difficulty__normal").addClass("selected");
    $(this).addClass("selected");
}, function (e) {
    if (!gameDifficulty) {
        $(".difficulty__button").removeClass("selected");
    }
});

$(".difficulty__button").click(function (e) {
    e.preventDefault();
    $(".difficulty__button").css("pointer-events", "none");
    gameDifficulty = $(this).index();
    for (let i = 0; i < gameDifficulty; i++) {
        $(".difficulty__button").eq(i).addClass("selected");
    }
    $(".main__difficulty").fadeOut("slow", function () {
        $(".difficulty__button").removeClass("selected");
        $(".main__board").fadeIn("slow", startGame);
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function timer() {
    timerInterval = setInterval(() => {
        seconds += 1;
        if (seconds === 60) {
            minutes += 1;
            seconds = 0;
        }
        $(".main__timer").text(`${minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`);
    }, 1000);
}

async function startGame() {
    minutes = seconds = 0;
    gameBoard = Array((gameDifficulty) * 8).fill(null);
    while (gameBoard.includes(null)) {
        let position = random(gameBoard.length);
        let secondPosition = random(gameBoard.length);
        let cardNumber = random(18);
        if (!gameBoard[position] && !gameBoard[secondPosition] && !gameBoard.includes(cardNumber) && position !== secondPosition) {
            gameBoard[position] = cardNumber;
            gameBoard[secondPosition] = cardNumber;
        }
    }
    for (let j = 0; j < gameBoard.length; j++) {
        $(`<div class='board__card'><img class="card__img" src="${images[gameBoard[j]]}"></div>`).appendTo(".main__board");
        $(".board__card").eq(j).hide();
        $(".board__card").eq(j).fadeIn("slow");
        if ((j + 1) % 4 === 0) {
            await sleep(500);
        }
    }
    $(".board__card").css("pointer-events", "visible");
    $(".main__timer").text(`${minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`);
    $(".main__timer").fadeIn("slow");
    timer();
    $(".board__card").click(async function (e) {
        e.preventDefault();
        $(".board__card").css("pointer-events", "none");
        $(this).addClass("selected");
        await sleep(400);
        if ($(".selected").length === 2) {
            if (gameBoard[$(".selected").eq(0).index()] === gameBoard[$(".selected").eq(1).index()]) {
                $(".selected").addClass("match");
                $(".match").css("pointer-events", "none");
            }
            $(".selected").removeClass("selected");
        }
        $(".board__card:not(.match)").css("pointer-events", "visible");
        if ($(".match").length === gameBoard.length) {
            clearInterval(timerInterval);
            $(".board__card").css("pointer-events", "none");
            $(".main__board").addClass("winner");
            await sleep(3000);
            $("#stat__difficulty").text($(".difficulty__button").eq(gameDifficulty - 1).text());
            if (minutes) {
                $("#stat__time").text(`${minutes} minutes and ${seconds} seconds`);
            } else {
                $("#stat__time").text(`${seconds} seconds`);
            }
            $(".main__timer").fadeOut("slow", function () {
                $(".main__toast").fadeIn("slow");
                $(".main__again").fadeIn("slow");
            })
        }
    });
}

$(".main__again").click(function (e) {
    e.preventDefault();
    $(".main__toast").fadeOut("slow");
    $(".main__again").fadeOut("slow", function () {
        $(".main__board").fadeOut("slow", function () {
            $(".main__board").removeClass("winner");
            $(".main__board").empty();
            $(".main__difficulty").fadeIn("slow", function () {
                $(".difficulty__button").css("pointer-events", "visible");
            });
        });
    });
});