declare module 'react-globe.gl' {
  import { Component } from 'react';
  
  interface GlobeProps {
    globeImageUrl?: string;
    bumpImageUrl?: string;
    backgroundImageUrl?: string;
    showAtmosphere?: boolean;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    objectsData?: any[];
    objectLat?: string | ((obj: any) => number);
    objectLng?: string | ((obj: any) => number);
    objectAltitude?: number | string | ((obj: any) => number);
    objectThreeObject?: (obj: any) => any;
    objectLabel?: string | ((obj: any) => string);
    onObjectClick?: (obj: any, event: MouseEvent) => void;
    onObjectHover?: (obj: any, prevObj: any) => void;
    width?: number;
    height?: number;
    [key: string]: any;
  }

  class Globe extends Component<GlobeProps> {
    scene(): any;
    camera(): any;
    controls(): any;
    pointOfView(): { lat?: number; lng?: number; altitude?: number };
    pointOfView(pov: { lat?: number; lng?: number; altitude?: number }, transitionMs?: number): void;
  }

  export default Globe;
}
