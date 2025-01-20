declare module 'react-leaflet-draw' {
  import { FC } from 'react';
  import { FeatureGroup } from 'react-leaflet';
  
  interface EditControlProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    draw?: {
      polyline?: boolean | object;
      polygon?: boolean | object;
      rectangle?: boolean | object;
      circle?: boolean | object;
      marker?: boolean | object;
      circlemarker?: boolean | object;
    };
    edit?: {
      edit?: boolean;
      remove?: boolean;
    };
    onCreated?: (e: any) => void;
    onEdited?: (e: any) => void;
    onDeleted?: (e: any) => void;
  }

  export const EditControl: FC<EditControlProps>;
}