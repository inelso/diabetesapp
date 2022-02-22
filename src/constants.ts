export const calibrateX: number = 0;
export const calibrateY: number = -20;

export const minZoom = 4;
export const mediumZoom = 5;
export const maxZoom = 6;

export const minNodeScale = 7;
export const mediumNodeScale = 13;
export const maxNodeScale = 20;

export const minNodeStrokeScale = 1;
export const mediumNodeStrokeScale = 2;
export const maxNodeStrokeScale = 3;

export const minZoomEdge = 7;
export const mediumZoomEdge = 15;
export const maxZoomEdge = 22;

export const BLUE = "#52C4F1";
export const strokeWeight = 2;

export const backgroundBounds = {
    north: 85,
    south: -85,
    east: 120.1,
    west: -120.1,
  };

export const mapRestriction = {
    north: 30,
    south: -30,
    east: 40,
    west: -40,
  };

export const center = { lat: 22, lng: 0 };

export function scaleNode(mapZoom: number): number {
    switch (mapZoom) {
        case ScaleEnum.MIN:
            return Scale.MIN.node;
        case ScaleEnum.MED:
            return Scale.MED.node;
        case ScaleEnum.MAX:
            return Scale.MAX.node;
        default:
            return Scale.MIN.node;
    }
}

export function scaleNodeStroke(mapZoom: number): number {
    switch (mapZoom) {
        case ScaleEnum.MIN:
            return Scale.MIN.nodeStroke;
        case ScaleEnum.MED:
            return Scale.MED.nodeStroke;
        case ScaleEnum.MAX:
            return Scale.MAX.nodeStroke;
        default:
            return Scale.MIN.nodeStroke;
    }
}

export function isLabelVisible(mapZoom: number): boolean {
    switch (mapZoom) {
        case ScaleEnum.MIN:
            return Scale.MIN.label;
        case ScaleEnum.MED:
            return Scale.MED.label;
        case ScaleEnum.MAX:
            return Scale.MAX.label;
        default:
            return Scale.MIN.label;
    }
}

export function scaleEdge(mapZoom: number): number {
    console.log("mapzoom " + mapZoom);
    switch (mapZoom) {
        case ScaleEnum.MIN:
            console.log("edge " + Scale.MIN.edge);
            return Scale.MIN.edge;
        case ScaleEnum.MED:
            console.log("edge " + Scale.MED.edge);
            return Scale.MED.edge;
        case ScaleEnum.MAX:
            console.log("edge " + Scale.MAX.edge);
            return Scale.MAX.edge;
        default:
            console.log("edge " + Scale.MIN.edge);
            return Scale.MIN.edge;
    }
}

enum ScaleEnum {
    MIN = minZoom,
    MED = mediumZoom,
    MAX = maxZoom,
}

export class Scale {
    static readonly MIN = new Scale(minZoom, minNodeScale, minNodeStrokeScale, minZoomEdge, false);
    static readonly MED = new Scale(mediumZoom, mediumNodeScale, mediumNodeStrokeScale, mediumZoomEdge, true);
    static readonly MAX = new Scale(maxZoom, maxNodeScale, maxNodeStrokeScale, maxZoomEdge, true);

    private constructor(
        private readonly zoom: number, 
        public node: number, 
        public nodeStroke: number, 
        public edge: number, 
        public label: boolean) {
      this.zoom = zoom;
    }
    
    toString() {
      return this.zoom;
    }
  }

