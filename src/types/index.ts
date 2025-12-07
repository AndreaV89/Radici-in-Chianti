export interface WPContent {
  id: number;
  slug: string;
  date?: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: { 
    rendered: string; 
  };
    _embedded?: {
    'wp:featuredmedia'?: {
      id: number;
      source_url: string;
      alt_text: string;
    }[];
    'wp:term'?: [
        {
            id: number;
            name: string;
            slug: string;
        }[]
    ];
  };
    acf?: { 
    [key: string]: any;
  };
}

export type Page = WPContent;
export type Post = WPContent;
export interface PointOfInterest extends Post {
  acf?: {
    latitudine?: number;
    longitudine?: number;
    [key: string]: any; // Permette altri campi ACF
  };
}

