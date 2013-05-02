var streetView = null;

function initializeStreetView() {

  
  var pos = currentPuzzle ? new google.maps.LatLng(+currentPuzzle.lat,+currentPuzzle.lng) : new google.maps.LatLng(47.49992,19.036801); 
  var pov = currentPuzzle ? { heading: +currentPuzzle["heading"], pitch: +currentPuzzle["pitch"]} : { heading: 34, pitch: -20 };  

  /*var mapOptions = {
    center: fenway,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };*/

  var panoramaOptions = {
    addressControl: false,
    linksControl: false,
    /*panControl: false,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },*/
   // enableCloseButton: false,
    
    position: pos,
    pov: pov
    
  };
  streetView = new  google.maps.StreetViewPanorama(document.getElementById('streetView'),panoramaOptions);
  //map.setStreetView(panorama);
}

google.maps.event.addDomListener(window, 'load', initializeStreetView);
