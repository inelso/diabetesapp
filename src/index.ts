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

// This example uses a GroundOverlay to place an image on the map
// showing an antique map of Newark, NJ.

let backgroundOverlay;
let assessmentOverlay;

// Add the image to our existing div.
const backgroundIcon = new Image();
backgroundIcon.src = background;

const assessmentIcon = new Image();
assessmentIcon.src = assessment;

function initMap(): void {
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

  var path : google.maps.LatLngLiteral[] = [];
  // Draw lines
  for (let i = 0; i < edges.length; i++) {
    var edge = edges[i];
    path.push({ lat: edge.y, lng: edge.x });
  }

  var flightPath = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "#52C4F1",
    strokeOpacity: 1.0,
    strokeWeight: (map.getZoom() == 4) ? 20 : 40,
  });

  flightPath.setMap(map);

  // Listener for edge width resize
  google.maps.event.addListener(map, 'zoom_changed', function() {
    console.log(map.getZoom())
    var zoom = map.getZoom();
    if (zoom == 4) {
      flightPath.setOptions({strokeWeight: 20});
    } else if (zoom == 5) {
      flightPath.setOptions({strokeWeight: 40});
    }
});
  
  // Drawing Assessment node
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
    var node = nodes[i];
    const cityCircle = new google.maps.Circle({
      strokeColor: "#FFFFFF",
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: "#932B8F",
      fillOpacity: 1,
      map,
      center: { lat: node.y, lng: node.x },
      radius: 200000,
    });
  }
}

export { initMap };
