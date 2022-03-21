import nodes from './static/nodes.json';
import {
    calibrateX, 
    calibrateY,
    scaleNode,
    isLabelVisible,
    scaleNodeStroke
} from './constants';

export function setNodeData(marker: google.maps.Marker, map: google.maps.Map): void {
    let index = marker.get("id");
    let nodeData = nodes[index];
    let center = { lat: nodeData.y + calibrateY+1, lng: nodeData.x + calibrateX-1.2};
    marker.setOptions({
        title: nodeData.title,
        position: center,
        map: map,
        icon: {
            path: nodeData.type as string,
            fillOpacity: 1,
            fillColor: nodeData.colour,
            scale: scaleNode(map!.getZoom()!),
            strokeColor: "#FFFFFF",
            strokeWeight: scaleNodeStroke(map!.getZoom()!),
            labelOrigin: new google.maps.Point(
                nodeData!.label != undefined ? nodeData.label.x : 1, 
                nodeData!.label != undefined ? nodeData.label.y : -1.2
                )
        },
        visible: true,
        clickable: true
    });
    if (isLabelVisible(map!.getZoom()!)) {
        marker.setLabel({text: nodeData.title!, fontWeight: "bold"});
    } else {
        marker.setLabel(null);
    }
  }

export function generateOverlay(image: any, boundaries: google.maps.LatLngBoundsLiteral): google.maps.GroundOverlay {
    return new google.maps.GroundOverlay(
      image,
      boundaries
    );
  }