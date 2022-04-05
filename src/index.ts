/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

import background from './static/grid-trial.png';
import assessment from './static/assessment.png';
import diagnosis from './static/DIAGNOSES.png';
import management from './static/management.png';
import symbols from './static/symbols.png';
import logo from './static/MOPH-logo.png';

import nodes from './static/nodes.json';
import edges from './static/edge.json';
import groups from './static/groups.json';
require('bootstrap/dist/css/bootstrap.css');
import 'bootstrap';

import { setNodeData, generateOverlay } from "./utils";
import { 
  scaleNode, scaleNodeStroke, scaleEdge,
  calibrateX, calibrateY,
  minZoom, maxZoom, minZoomEdge, maxZoomEdge,
  backgroundBounds, mapRestriction, center,
  BLUE
 } from "./constants";

 //import  './search';

declare var $: any;

let backgroundOverlay;
var nodeMarkers : google.maps.Marker[] = [];
var clickMarkers : google.maps.Marker[] = [];

// Add the image to our existing div.
const backgroundIcon = new Image();
backgroundIcon.src = background;

function initMap(): void {
 
  // Create basic map
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: minZoom,
      center: center,
      disableDefaultUI: true,
      restriction: {
        latLngBounds: mapRestriction,
        strictBounds: false,
      }
    }
  );

  const zoomOptions = { minZoom: minZoom, maxZoom: maxZoom };
  map.setOptions(zoomOptions);
  map.fitBounds(mapRestriction);

  backgroundOverlay = new google.maps.GroundOverlay(
    backgroundIcon.src,
    backgroundBounds
  );
  backgroundOverlay.setMap(map);

  //Top Left logo
  var topLeftDiv = document.createElement('DIV');
  var topLeftLogo = document.createElement('DIV');
  topLeftLogo.style.cursor = 'pointer';
  topLeftLogo.style.backgroundImage = "url(https://i.imgur.com/UU1Z0Le.png)";
  //topLeftLogo.style.backgroundImage = "url(https://i.imgur.com/eRwDjYZ.png)";
  topLeftLogo.style.height = '149px';
  topLeftLogo.style.width = '400px';
  //topLeftLogo.style.zIndex = '10';
  topLeftLogo.title = 'Click to set the map to Home';
  topLeftDiv.appendChild(topLeftLogo);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(topLeftLogo);
  
  topLeftLogo.addEventListener('click', function() {
    window.open('https://www.moph.gov.qa/arabic/Pages/default.aspx', '_blank');
  });

  //Bottom Right logo
  var bottomRightDiv = document.createElement('DIV');
  var bottomRightLogo = document.createElement('DIV');
  bottomRightLogo.style.cursor = 'pointer';
  bottomRightLogo.style.backgroundImage = "url(https://i.imgur.com/g8bBxCf.png)";
  bottomRightLogo.style.height = '46px';
  bottomRightLogo.style.width = '298px';
  bottomRightLogo.title = 'Click to set the map to Home';
  bottomRightDiv.appendChild(bottomRightLogo);

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(bottomRightLogo);

  bottomRightLogo.addEventListener('click', function() {
    window.open('https://www.moph.gov.qa/arabic/Pages/default.aspx', '_blank');
  });

    //Top Right logo
    var topRightDiv = document.createElement('DIV');
    var topRightLogo = document.createElement('DIV');
    topRightLogo.style.cursor = 'pointer';
    topRightLogo.style.backgroundImage = "url(https://i.imgur.com/9U6yse4.png)";
    topRightLogo.style.height = '160px';
    topRightLogo.style.width = '400px';
    topRightLogo.title = 'Click to set the map to Home';
    topRightDiv.appendChild(topRightLogo);
  
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(topRightLogo);

  // Draw lines
  for (let pathIndex = 0; pathIndex < edges.length; pathIndex++) {
    let path = edges[pathIndex];

    let pathToPush : google.maps.LatLngLiteral[] = [];
    for (let lineIndex = 0; lineIndex < path.length; lineIndex++) {
      let line = path[lineIndex];
      pathToPush.push({ lat: line.y + calibrateY, lng: line.x + calibrateX });
    }

    let polyline = new google.maps.Polyline({
      path: pathToPush,
      geodesic: false,
      strokeColor: BLUE,
      strokeOpacity: 1.0,
      strokeWeight: scaleEdge(map!.getZoom()!),
      
    });

    polyline.setMap(map);

    // Listener for edge width resize and static label markers
    google.maps.event.addListener(map, 'zoom_changed', function() {
      let zoom = map.getZoom();
      polyline.setOptions({strokeWeight: scaleEdge(zoom!), zIndex: 1000000000000000});
      nodeMarkers.forEach(nodeMarker => {
        setNodeData(nodeMarker!, map!);
      });
    });
  }
  
  for (let i = 0; i < nodes.length; i++) {
    // Generate marker and store the reference in the global array
    let nodeData = nodes[i];
    let center = { lat: nodeData.y + calibrateY, lng: nodeData.x + calibrateX};
    const node = new google.maps.Marker({
      
      title: nodeData[i],
      position: center,
      map: map,
      icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillOpacity: 1,
          fillColor: nodeData.colour,
          scale: scaleNode(map.getZoom()!),
          strokeColor: "#FFFFFF",
          strokeWeight: scaleNodeStroke(map!.getZoom()!)
      },
      visible: true,
      clickable: true
    });
    node.setValues({"id": nodeData.id})
    nodeMarkers.push(node);

    // Marker to hold the arrow when the node is clicked
    let clickMarker = new google.maps.Marker({
      position: center,
      map: map,
      visible: false
    });
    clickMarkers.push(clickMarker);

    // Listener on the node/shape for mousedown event
    google.maps.event.addListener(node, 'mousedown', () => {
      // Set all markers to invisible
      clickMarkers.forEach(arrows => {
        arrows.setVisible(false);
      });

      // Set specific marker to visible and center on it
      clickMarker.setVisible(true);
      map.panTo(node.getPosition()!);

      /*Bootstrap Modal Pop Up Open Code*/
      $(".modal-title").text(nodeData.title);
      $(".modal-body").html(nodeData.description);
      $("#myModal").modal('show');
    });
  }

  // Set static icons
  let assessmentOverlay = 
    generateOverlay(assessment, {east: groups[0].east, west: groups[0].west, north: groups[0].north, south: groups[0].south});
  assessmentOverlay.setMap(map);


  let diagnosesOverlay = 
    generateOverlay(diagnosis, {east: groups[1].east, west: groups[1].west, north: groups[1].north, south: groups[1].south});  
    diagnosesOverlay.setMap(map);


  let managementOverlay = 
    generateOverlay(management, {east: groups[2].east, west: groups[2].west, north: groups[2].north, south: groups[2].south});
  managementOverlay.setMap(map);

  // Set symbols and logo
  //let symbolsOverlay = 
   // generateOverlay(symbols, {east: groups[3].east, west: groups[3].west, north: groups[3].north, south: groups[3].south});
  //symbolsOverlay.setMap(map);

  //let logoOverlay = 
   // generateOverlay(logo, {east: groups[4].east, west: groups[4].west, north: groups[4].north, south: groups[4].south});
    //logoOverlay.setMap(map);

  // Set texts
  groups.forEach(group => {
    if (group.hasText) {
      let labelStaticMarker = new google.maps.Marker({
        position: { lat: group.y + calibrateY+1, lng: group.x + calibrateX-1.2},
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 1,
            strokeColor: BLUE
        },
        visible: true
      });
      labelStaticMarker.setLabel({text: group.title, fontWeight: "bold", color: group.colour, fontSize: group.size, fontFamily: "Articulate"});
    }
  });
}

export { initMap };
