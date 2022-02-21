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

import background from './static/background.png';
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

declare var $: any;

const calibrateX: number = 0;
const calibrateY: number = -20;

const minZoom = 5;
const maxZoom = 6;
const minZoomEdgeStroke = 10;
const maxZoomEdgeStroke = 20;

const BLUE = "#52C4F1";

let backgroundOverlay;
var markers : google.maps.Marker[] = [];
var labels : google.maps.Marker[] = [];

// Add the image to our existing div.
const backgroundIcon = new Image();
backgroundIcon.src = background;

function initMap(): void {
 
  // Create basic map
  const backgroundBounds = {
    north: 85,
    south: -85,
    east: 120.1,
    west: -120.1,
  };
  const mapRestriction = {
    north: 30,
    south: -30,
    east: 40,
    west: -40,
  };
  const center = { lat: 22, lng: 0 };

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 5,
      center: center,
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
      strokeWeight: (map.getZoom() == minZoom) ? minZoomEdgeStroke : maxZoomEdgeStroke,
    });
    polyline.setMap(map);

    // Listener for edge width resize and static label markers
    google.maps.event.addListener(map, 'zoom_changed', function() {
      let zoom = map.getZoom();
      if (zoom == minZoom) {
        polyline.setOptions({strokeWeight: minZoomEdgeStroke});
        labels.forEach(label => {
          label.setVisible(false);
        });
      } else if (zoom == maxZoom) {
        polyline.setOptions({strokeWeight: maxZoomEdgeStroke});
        labels.forEach(label => {
          label.setVisible(true);
        });
      }
    });
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let nodeData = nodes[i];
    let center = { lat: nodeData.y + calibrateY, lng: nodeData.x + calibrateX};
    const node = new google.maps.Circle({
      strokeColor: "#FFFFFF",
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: nodeData.colour,
      fillOpacity: 1,
      map,
      center: center,
      radius: 60000,
    });

    // Marker to hold the label
    // We set a circle with the very small scale (1), so that the labelOrigin can work
    // otherwise if the scale is 0, the labelOrigin does not work
    let labelStaticMarker = new google.maps.Marker({
      position: center,
      map: map,
      icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 1,
          strokeColor: nodeData.colour,
          labelOrigin: new google.maps.Point(
            nodeData!.label != undefined ? nodeData.label.x : 0, 
            nodeData!.label != undefined ? nodeData.label.y : 0)
      },
      visible: true
    });
    labelStaticMarker.setLabel({text: nodeData.title!, fontWeight: "bold"});
    labels.push(labelStaticMarker);

    let marker = new google.maps.Marker({
      position: center,
      map: map,
      visible: false
    });
    
    // Store the marker reference in the global array
    markers.push(marker);

    // Listener on the node/shape for mousedown event
    google.maps.event.addListener(node, 'mousedown', () => {
      // Set all markers to invisible
      markers.forEach(marker => {
        marker.setVisible(false);
      });

      // Set specific marker to visible and center on it

      /*Bootstrap Modal Pop Up Open Code*/
      $(".modal-title").text(nodeData.title);
      $(".modal-body").html(nodeData.description);
      $("#myModal").modal('show');

      marker.setVisible(true);
      map.panTo(marker.getPosition()!);
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
  let symbolsOverlay = 
    generateOverlay(symbols, {east: groups[3].east, west: groups[3].west, north: groups[3].north, south: groups[3].south});
  symbolsOverlay.setMap(map);

  let logoOverlay = 
    generateOverlay(logo, {east: groups[4].east, west: groups[4].west, north: groups[4].north, south: groups[4].south});
    logoOverlay.setMap(map);

  // Set texts
  groups.forEach(group => {
    if (group.hasText) {
      let labelStaticMarker = new google.maps.Marker({
        position: { lat: group.y + calibrateY, lng: group.x + calibrateX},
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 1,
            strokeColor: BLUE
        },
        visible: true
      });
      labelStaticMarker.setLabel({text: group.title, fontWeight: "bold", color: group.colour, fontSize: group.size, fontFamily: "Helvetica"});
    }
  });
}

function generateOverlay(image: any, boundaries: google.maps.LatLngBoundsLiteral): google.maps.GroundOverlay {
  return new google.maps.GroundOverlay(
    image,
    boundaries
  );
}

export { initMap };
