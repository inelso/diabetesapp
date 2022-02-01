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
import Icon from './static/background.png';
import assessment from './static/assessment.png';
import purpleCircle from './static/circle-purple-01.png';

// This example uses a GroundOverlay to place an image on the map
// showing an antique map of Newark, NJ.

let historicalOverlay;
let assessmentOverlay;
let purpleCircleOverlay;

// Add the image to our existing div.
const myIcon = new Image();
myIcon.src = Icon;

const assessmentIcon = new Image();
assessmentIcon.src = assessment;

const purpleCircleIcon = new Image();
purpleCircleIcon.src = purpleCircle;

function initMap(): void {
  const imageBounds = {
    north: 40.773941,
    south: 40.712216,
    east: -74.12544,
    west: -74.22655,
  };

  const center = { lat: 40.70, lng: -74.18 };

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13,
      center: { lat: 40.74, lng: -74.18 },
      restriction: {
        latLngBounds: imageBounds,
        strictBounds: false,
      }
    }
  );

  historicalOverlay = new google.maps.GroundOverlay(
    myIcon.src,
    imageBounds
  );
  historicalOverlay.setMap(map);
  
  // Drawing Assessment node
  const assessmentBounds = {
    north: 40.753941,
    south: 40.742216, 
    east: -74.16544, 
    west: -74.17655,
  };

  assessmentOverlay = new google.maps.GroundOverlay(
    assessmentIcon.src,
    assessmentBounds
  );
  assessmentOverlay.setMap(map);

  // Drawing first purple node
  const nodeBounds = {
    north: 40.743216,
    south: 40.739216, 
    east: -74.16544, 
    west: -74.17655,
  };

  purpleCircleOverlay = new google.maps.GroundOverlay(
    purpleCircleIcon.src,
    nodeBounds
  );
  purpleCircleOverlay.setMap(map);

  const zoomOptions = { minZoom: 14, maxZoom: 16 };
  map.setOptions(zoomOptions);
  map.fitBounds(imageBounds);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(40.74, -74.18),
    map: map,
    icon: {
      url: purpleCircleIcon.src,
      size: new google.maps.Size(256, 256),
      anchor: new google.maps.Point(0, 0),
      labelOrigin: new google.maps.Point(0, 0)
     },
    label: {text: "hi"}
   });
  // const marker = new google.maps.Marker({
  //   position: center,
  //   icon: {
  //     url: purpleCircleIcon.src,
  //     labelOrigin: new google.maps.Point(0, 0)
  //   },
  //   map: map,
  //   label: {text: "hi"},
  // });
  // marker.setShape({type: "rect", coords: null})

  const imageMapType = new google.maps.ImageMapType({
    tileSize: new google.maps.Size(256, 256),
  });

  map.overlayMapTypes.push(imageMapType);
}
export { initMap };
