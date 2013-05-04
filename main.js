var currentPuzzle = null;
var superUser = false;
var resolves = {}; 
var resolvesCookieName = "_resolves";
var baseUrl = "http://streetviewgame.projecthost.hu";

function zeroFill(i)
{
  return (i<10) ? "0" + i : i;
}
function getFormattedDate (d) {
  return d.getFullYear() + "-"  + zeroFill(d.getMonth()+1) + "-"  + zeroFill(d.getDate());
}
function getFormattedDateAndTime (d) {
  return getFormattedDate (d) 
  + " " + zeroFill(d.getHours()) + ":"  + zeroFill(d.getMinutes()) + ":"  + zeroFill(d.getSeconds());
}
function renderScore(score) {
  var s = score % 60;
  return zeroFill( (score-s) / 60 ) +":" + zeroFill( s ); 
}

function getUrlSearchParams() {
  var pairs = window.location.search.substring(1).split("&"),  obj = {}, pair, i;
  for (i in pairs) {
    pair = pairs[i].split("=");
    if (pair.length == 2) {
      var key = decodeURIComponent(pair[0]);
      var val = decodeURIComponent(pair[1]);
      obj[key] = val;
    }
  }
  return obj;
}

function loadComments()  {
  $.getJSON('rest.php/puzzle/'+currentPuzzle["id"] + '/comment', function(data) {
    $("#commentList").html(data.length > 0 ? "<hr style='clear:both;'>" : "");
    $("#newCommentText").val("");
    
    for (var i = 0; i < data.length; i++) {
    
      var comment = data[i];
      var row = "<p><img src='"+comment["image"]+"' class='floatRight'>";
      row += comment["content"]+"<br>";
      row += "<small>"+comment["userName"]+"<br> "+getFormattedDateAndTime(new Date(+comment["date"]))+"</small></p>";
      $("#commentList").append(row);
    }
  });
}
function renderPuzzle(puzzle) {

  var key = puzzle["id"];
      
  var row = "<div id='item_"+key+"' class=thumbnailContainer>";
  row += "<a id='view_"+key+"' href='#'>";

    if ( resolves[key] || puzzle["score"] > 0) {
      row += "<div class = 'thumnailOverlayRect'></div>";
      row += "<img class = 'thumnailOverlay' src='style/resolved.png'>";
    }  
    row += "<img src='rest.php/puzzle/" + key + "/thumbnail' title='" + puzzle["label"] + "' alt='" + puzzle["label"] + "'>";

  row += "</a><br>";

  row += "<small> " + puzzle["label"] + " | ";
  if (superUser || (currentProfile && puzzle["userId"] == currentProfile.id)) {
    row += " <a id='modify_"+key+"' href='#'>[módosítás]</a> | ";
    row += " <a id='delete_"+key+"' href='#'>[törlés]</a> | ";
  } else {
    row += puzzle["userName"]+" | ";
    if (puzzle["score"] > 0)
      row += renderScore(puzzle["score"])+" | ";
  }
  row += getFormattedDate(new Date(+puzzle["date"]))+"</small></div>";
  
  $("#puzzleList").append(row);

  $("#view_"+key).click(function() {
    showPuzzle(puzzle);
  });

    $("#delete_"+key).click(function() {
    if (confirm("Biztos, hogy törölni szeretnéd ezt a rejtvényt? ("+puzzle["label"]+")")){
      $.ajax({
        type: 'DELETE',
        url: 'rest.php/puzzle/'+key ,
        success: function(result) {
          console.log("Sikerült törölni a rejtvényt! ("+result+")");
          loadPuzzles();
        },
        error: function(e) {
          alert("Nem sikerült törölni a rejtvényt!");
          console.log(e);
        }
      });
    }
  });

  $("#modify_"+key).click(function() {  
    showPuzzleDetailsBox( puzzle );
  });
}
function loadPuzzles() {

  currentPuzzle = null;
  $.getJSON('rest.php/puzzles?userId=' + currentProfile.id, function(data) {
    
    $("#answerBox").fadeOut("slow");
    $("#commentBox").fadeOut("slow");
    $("#puzzleDetailsBox").fadeOut("slow");
    $("#resolvedPuzzleBox").fadeOut("slow");
  
    $("#puzzleList").html("");
    
    for (var i = 0; i < data.length; i++)
      renderPuzzle( data[i] ) ;
    
    $("#mainBox").fadeIn("slow");  
    $('.accordion').accordion({
      heightStyle: "fill"
    });
  });
}

function showPuzzle(puzzle) {
  if (puzzle == null) {
    loadPuzzles();
    return;
  }
  
  var noChange  = currentPuzzle && (puzzle.id == currentPuzzle.id);
  currentPuzzle = puzzle;
  
  if (!noChange) {
    currentPuzzle.startTime = new Date().getTime();
    if (streetView) {
      streetView.setPosition(new google.maps.LatLng(+puzzle["lat"],+puzzle["lng"]));
      streetView.setPov( { heading: +puzzle["heading"], pitch: +puzzle["pitch"]} );  
    }
  }
  
  loadComments();

  $(".puzzleCreatorIcon").attr("src", currentPuzzle["image"]);
  $("#mainBox").fadeOut("slow");
  $("#commentBox").fadeIn("slow");
  
  var link = baseUrl + "?puzzle=" + currentPuzzle.id;
  $(".puzzleLinkPlusOne").attr("data-href",link);
  $(".puzzleLink").html(link);
  
  if (resolves[puzzle.id]) {
    $("#resolvedQuestion").html(currentPuzzle["question"]);
    $("#resolvedAnswer").html(currentPuzzle["answer"]);
    $("#resolvedScore").html( resolves[currentPuzzle.id] ? renderScore(resolves[currentPuzzle.id].score) : "-" );
              
    $("#answerBox").fadeOut("slow");
    $("#resolvedPuzzleBox").fadeIn("slow");
  }
  else {
    $("#answer").val("");
    $("#question").html( currentPuzzle["question"] );
    
    $("#resolvedPuzzleBox").fadeOut("slow");
    $("#answerBox").fadeIn("slow", function () { $("#answer").focus();} );
    
    updateTimer();
  }
}

function getScore() {
   var now = new Date().getTime();
   return Math.ceil((now - currentPuzzle.startTime) / 1000);
}

function updateTimer() {
  if (currentPuzzle) {
    $("#currentScore").html(renderScore(getScore()));
    setTimeout(function(){ 
      updateTimer();
    },500);
  }
}
function checkanswer() {
  var tipp = $("#answer").val();
  if (currentPuzzle && tipp.length > 0 ) {
    if (tipp.toUpperCase() == currentPuzzle["answer"].toUpperCase()) {
         
      currentPuzzle.score = getScore();
     
      resolution = {
          "userId": (currentProfile ? currentProfile.id : "") ,
          "score": currentPuzzle.score,
	  "answer" : tipp,
          "date" : now
      };
      resolves[currentPuzzle.id] = resolution;

      
      if (currentProfile) {
        $.ajax({
          type: 'POST',
          url: 'rest.php/puzzle/'+currentPuzzle.id+'/solution',
          data: JSON.stringify(resolution),
          success: function(result) {
            console.log("Sikerült feltölteni a megfejtést!");
            showPuzzle(currentPuzzle);
          },
          error: function(e) {
            console.log("Nem sikerült feltölteni a megfejtést!");
            console.log(e);
            showPuzzle(currentPuzzle);  
          }
        });
      }
      else {
        $.cookie(resolvesCookieName, JSON.stringify( resolves ), { expires: 30 });
        showPuzzle(currentPuzzle);  
      }

    } else {
            
      var now = new Date().getTime();
      var wrongTipp = {
          "userId": (currentProfile ? currentProfile.id : "") ,
	  "score" : -1,
          "answer": tipp,
          "date" : now
      };
          
      $.ajax({
        type: 'POST',
        url: 'rest.php/puzzle/' + currentPuzzle.id + '/solution',
        data: JSON.stringify(wrongTipp),
        success: function(result) {
          console.log("Sikerült feltölteni a rossz választ!");
        },
        error: function(e) {
          console.log("Nem sikerült feltölteni a rossz választ!");
          console.log(e);
        }
      });
    
      var levenshteinDistance = levenshtein( tipp.toUpperCase(), currentPuzzle["answer"].toUpperCase() );
      var acceptableDistance = currentPuzzle["answer"].length * 0.3; 
      if (levenshteinDistance <= acceptableDistance) {
      
        var r = Math.random();
        if ( r< 0.2)
          alert (tipp + "? Hmm, közel jársz, nagyon közel...");
        else if ( r< 0.4)
          alert (tipp + "? Majdnem. Már majdnem eltaláltad.");
        else if ( r< 0.6)
          alert (tipp + "? Nem pont ez, de valami ilyesmi.");
        else if ( r< 0.8)
          alert (tipp + "? Forró! Forró!");
        else 
          alert (tipp + "? Igen! Illetve nem. De majdnem. ");
        
        $("#answer").focus();
      }
      else {
        var r = Math.random();
        if ( r< 0.2)
          alert (tipp + "? Á, dehogy!");
        else if ( r< 0.4)
          alert (tipp + "? Nem-nem...");
        else if ( r< 0.6)
          alert (tipp + "? Hideg, hideg!");
        else if ( r< 0.8)
          alert (tipp + "? Nem jó!");
        else 
          alert (tipp + "? Végképp nem!");

        $("#answer").val("").focus();
      }
    }
  }
}

function submitPuzzle() {
  
  var puzzleId = $("#puzzleId").val();
  var puzzleLabel = $("#puzzleLabel").val();
  var puzzleQuestion = $("#puzzleQuestion").val();
  var puzzleAnswer = $("#puzzleAnswer").val();
  
  if (puzzleLabel.length == 0 || puzzleQuestion.length == 0 || puzzleAnswer.length == 0) {
    alert("Töltsd ki azt összes mezőt!");
    return;
  }
   
  if (currentProfile == null)  {
    alert("Nem vagy bejelentkezve!");
    return;
  }
  
  ////
  
  var pos = streetView.getPosition();
  var pov = streetView.getPov();
  
  var puzzle = {
    "label": puzzleLabel,
    "question": puzzleQuestion,
    "answer": puzzleAnswer,
    "lat" : pos.lat(),
    "lng" : pos.lng(),
    "heading": pov.heading,
    "pitch": pov.pitch
  };
        
  type = '';
  data = '';
  url = '';
    if ( puzzleId > 0) {
	type = 'PUT';
	data = puzzle;
	url = 'rest.php/puzzle/' + puzzleId;
    } else {
	puzzle["userId"] = currentProfile.id;
	puzzle["date"] = new Date().getTime();
	type = 'POST';
	url = 'rest.php/puzzle';
	data = JSON.stringify(puzzle);
    }
   

  $.ajax({
    type: type,
    url: url,
    data: data,
    success: function(result) {
      console.log("Sikerült feltölteni a rejtvényt! (result:"+result+")");
      loadPuzzles();
    },
    error: function(e) {
      alert("Nem sikerült feltölteni a rejtvényt!");
      console.log(e);
    }
  });

}


function submitComment() {
  
  var commentText = $("#newCommentText").val();
  
  if (commentText.length == 0)
    return;
  
   
  if (currentProfile == null)  {
    alert("Nem vagy bejelentkezve!");
    return;
  }
 
  var comment = {
    "userId" : currentProfile.id,
//    "afterResolved" : false,
    "content": commentText,
    "date" : new Date().getTime()
  };
          
  $.ajax({
    type: 'POST',
    url: 'rest.php/puzzle/' + currentPuzzle["id"] + '/comment',
    data: JSON.stringify(comment),
    success: function(result) {
      console.log("Sikerült feltölteni a kommentet! (result:"+result+")");
      loadComments();
    },
    error: function(e) {
      alert("Nem sikerült feltölteni a kommentet!");
      console.log(e);
    }
  });

}

function showPuzzleDetailsBox( puzzle ) {

  $("#mainBox").fadeOut("slow");

  streetView.setPosition(new google.maps.LatLng(+puzzle["lat"],+puzzle["lng"]));
  streetView.setPov( { heading: +puzzle["heading"], pitch: +puzzle["pitch"]} );

  $("#puzzleId").val(puzzle["id"]);
  $("#puzzleLabel").val(puzzle["label"]);
  $("#puzzleQuestion").val(puzzle["question"]);
  $("#puzzleAnswer").val(puzzle["answer"]);

  $("#puzzleDetailsBox").fadeIn("slow", function () { $("#puzzleLabel").focus();} )            
}

function startCreatingPuzzle() {
  var address = $("#addressOfPuzzle").val();
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        var pos = results[0].geometry.location;
        var streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanoramaByLocation(pos,1000, function(streetViewPanoramaData, streetViewStatus) {
          if (streetViewStatus == "OK") {
          
            var puzzle = {
              "lat" : streetViewPanoramaData.location.latLng.lat(),
              "lng" : streetViewPanoramaData.location.latLng.lng(),
              "heading" : 0,
              "pitch" : 0,
              "label" : "",
              "question" : "",
              "answer" : ""
            }          
            showPuzzleDetailsBox( puzzle );              
          } 
          else
            alert("Ezt a címet nem sikerült megtalálnom (" + streetViewStatus + ")" );
        });
    } else {
      alert("Ezt a címet nem sikerült megtalálnom (" + status + ")" );
    }
  });
}
  
$(document).ready(function() {

  $('#disconnect').click(helper.disconnect);
  $(".backToPuzzleList").click(loadPuzzles);
  $("#sendanswer").click(checkanswer);
  $("#submitPuzzle").click(submitPuzzle);
  $("#submitComment").click(submitComment);
  $("#startCreatingPuzzle").click(startCreatingPuzzle);
  
  $(document).keypress(function(e) {
    if(currentPuzzle && e.which == 13)
      checkanswer();
  });
  
  var urlSearchParams = getUrlSearchParams();
  if (urlSearchParams.puzzle) {
    $.ajax({
	dataType: "json",
	url: 'rest.php/puzzle/'+urlSearchParams.puzzle,
	success: function(data) {
	    showPuzzle(data);
	},
	error: function(data) {
	    alert("Nincs meg ez a rejtvény.");
	    loadPuzzles();
	}});
  }
  else
    loadPuzzles();
});
