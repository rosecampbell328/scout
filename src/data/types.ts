export type Pin = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  /** Local file URI or remote URL of the location photo. */
  photoUri: string | null;
  /** Free-text tags such as "golden hour", "urban", "florals". */
  tags: string[];
  author: string;
  createdAt: number;
};

export type NewPin = Omit<Pin, "id" | "createdAt">;
