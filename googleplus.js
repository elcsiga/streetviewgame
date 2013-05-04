var currentProfile = null;
var apiKey= "AIzaSyBgJDUb2Z1RrQBw1tb47q11hGhlLKxyzTc";

function getFullName(profile) {
  return profile.name.familyName + " " + profile.name.givenName ;
}
function updateAuthStatus() {
  
  if (currentProfile)
    $.getJSON('rest.php/user/'+currentProfile.id, function(data) {
      var userResolves = data.length > 0 && data[0].resolves ? JSON.parse(data[0].resolves) : {};
      
      if (!$.isEmptyObject(resolves) && $.isEmptyObject(userResolves)
          && confirm( "Már vannak itt megfejtett rejtvények. Te fejtetted meg őket?")) 
        {
          var r = { "resolves" : JSON.stringify( resolves ) };
          $.ajax({
            type: 'PUT',
            url: 'rest.php/user/' +  currentProfile.id,
            data: r,
            success: function(result) {
              console.log("Sikerült átvenni a megfejtéseket!");
              $.cookie(resolvesCookieName, NULL);
            },
            error: function(e) {
              console.log("Nem sikerült átvenni a megfejtéseket!");
              console.log(e);
            }
          });
        }
        else
          resolves = userResolves;
      
      
      updateAuthBasedTexts();
    });
  else {
    var cookie = $.cookie(resolvesCookieName);
    resolves = (cookie) ? JSON.parse(cookie) : {};
    updateAuthBasedTexts();
  }
}
function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult);
}
function updateAuthBasedTexts() {
  if (currentProfile) {
    $(".visibleIfLoggedIn").fadeIn("slow");
    $(".visibleIfNotLoggedIn").fadeOut("slow");  
  } else {
    $(".visibleIfLoggedIn").fadeOut("slow");
    $(".visibleIfNotLoggedIn").fadeIn("slow");
  }
  
  if (currentPuzzle)
    showPuzzle(currentPuzzle);
  else
    loadPuzzles(); 
}

var helper = (function() {
  var BASE_API_PATH = 'plus/v1/';

  return {
    /**
     * Hides the sign in button and starts the post-authorization operations.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult) {
      gapi.client.load('plus','v1', function(){

        if (authResult['access_token']) {
          $('#authOps').fadeIn('slow');
          $('#gConnect').fadeOut('slow');
          helper.profile();
          //helper.people();
        } else if (authResult['error']) {
          // There was an error, which means the user is not signed in.
          // As an example, you can handle by writing to the console:
          console.log('There was an error: ' + authResult['error']);
          $('#authOps').fadeOut('slow');
          $('#gConnect').fadeIn('slow');
          
          currentProfile = null;
          updateAuthStatus();
        }
      });
    },

    /**
     * Calls the OAuth2 endpoint to disconnect the app for the user.
     */
    disconnect: function() {
      // Revoke the access token.
      $.ajax({
        type: 'GET',
        url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
            gapi.auth.getToken().access_token,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(result) {
          console.log('revoke response: ' + result);
          $('#authOps').fadeOut("slow");
          $('#profileImage').empty();
          $('#profileName').empty();
          $('#authResult').empty();
          $('#gConnect').fadeIn("slow");
          
          currentProfile = null;
          
          updateAuthStatus();

        },
        error: function(e) {
          console.log(e);
        }
      });
    },

    /**
     * Gets and renders the list of people visible to this app.
     */
    
    
    people: function() {
      var request = gapi.client.plus.people.list({
        'userId': 'me',
        'collection': 'visible'
      });
      request.execute(function(people) {
        $('#visiblePeople').empty();
        $('#visiblePeople').append('Number of people visible to this app: ' +
            people.totalItems + '<br/>');
        for (var personIndex in people.items) {
          person = people.items[personIndex];
          $('#visiblePeople').append('<img src="' + person.image.url + '">');
        }
      });
    },

    /**
     * Gets and renders the currently signed in user's profile data.
     */
    profile: function(){
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      request.execute( function(profile) {
        $('#profileImage').empty();
        $('#profileName').empty();
        if (profile.error) {
          $('#profileName').append(profile.error);
          return;
        }
        $('#profileImage').append(
            $('<img src=\"' + profile.image.url + '\">'));
        $('#profileName').html(getFullName(profile));
       
        var noLogin = currentProfile && (currentProfile.id == profile.id);
        currentProfile = profile;
        if (!noLogin) {
        
          var userUpdateData = {
            "userId": currentProfile.id,
            "userName": getFullName(currentProfile),
            "image": currentProfile.image.url,
            "lastLoginDate": new Date().getTime()
          };
   
          $.ajax({
            type: 'PUT',
            url: 'rest.php/user/' + currentProfile.id,
            data: userUpdateData,
            success: function(result) {
              updateAuthStatus();
            },
            error: function(e) {
              alert("Nem sikerült bejelentkezni!");
              console.log(e);
            }
          });
        }
        

      });
    }
  };
})();

 
