export interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string | null;
  overview?: string;
}