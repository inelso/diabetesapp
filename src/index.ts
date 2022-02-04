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
import nodes from './static/nodes.json';
import edges from './static/edge.json';
import { getEffectiveConstraintOfTypeParameter, getPositionOfLineAndCharacter } from "typescript";

// This example uses a GroundOverlay to place an image on the map
// showing an antique map of Newark, NJ.

let backgroundOverlay;
let assessmentOverlay;
var markers : google.maps.Marker[] = [];

// Add the image to our existing div.
const backgroundIcon = new Image();
backgroundIcon.src = background;

const assessmentIcon = new Image();
assessmentIcon.src = assessment;

function initMap(): void {
 
  // Create basic map
  const backgroundBounds = {
    north: 85,
    south: -85,
    east: 120.1,
    west: -120.1,
  };
  const center = { lat: 0, lng: 0 };
  const zoomOptions = { minZoom: 4, maxZoom: 5 };

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 6,
      center: center,
      restriction: {
        latLngBounds: backgroundBounds,
        strictBounds: false,
      }
    }
  );

  map.setOptions(zoomOptions);
  map.fitBounds(backgroundBounds);

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
      pathToPush.push({ lat: line.y, lng: line.x });
    }

    let polyline = new google.maps.Polyline({
      path: pathToPush,
      geodesic: false,
      strokeColor: "#52C4F1",
      strokeOpacity: 1.0,
      strokeWeight: (map.getZoom() == 4) ? 10 : 20,
    });
    polyline.setMap(map);

    // Listener for edge width resize
    google.maps.event.addListener(map, 'zoom_changed', function() {
      let zoom = map.getZoom();
      if (zoom == 4) {
        polyline.setOptions({strokeWeight: 10});
      } else if (zoom == 5) {
        polyline.setOptions({strokeWeight: 20});
      }
    });
  }

  // Asssessment Icon
  // TODO: Will add these icons in a JSON, similar to nodes and edges
  const assessmentBounds = {
    north: 3,
    south: -3, 
    east: 4, 
    west: -4,
  };

  assessmentOverlay = new google.maps.GroundOverlay(
    assessmentIcon.src,
    assessmentBounds
  );
  assessmentOverlay.setMap(map);

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let nodeData = nodes[i];
    let center = { lat: nodeData.y, lng: nodeData.x };
    const node = new google.maps.Circle({
      strokeColor: "#FFFFFF",
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: "#932B8F",
      fillOpacity: 1,
      map,
      center: center,
      radius: 200000,
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
    labelStaticMarker.setLabel({text: nodeData.title!});

    let marker = new google.maps.Marker({
      position: center,
      map: map,
      visible: false
    });
    
    // Store the marker reference in the global array
    markers.push(marker);

    // Listener on the node/shape for click event
    google.maps.event.addListener(node, 'click', () => {
      // Set all markers to invisible
      markers.forEach(marker => {
        marker.setVisible(false);
      });

      // Set specific marker to visible and center on it
      marker.setVisible(true);
      map.panTo(marker.getPosition()!);
    });
  }
}
export { initMap };
