/** Owner id used for pins created on this device (until accounts exist). */
export const ME = "me";

export type Pin = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  /** One-line street address shown on the location page. */
  address: string;
  /** Local file URI or remote URL of the location photo. */
  photoUri: string | null;
  /** Free-text tags such as "golden hour", "urban", "florals". */
  tags: string[];
  /** Display name shown as "scouted by …". */
  author: string;
  /** Who created the pin. `ME` for pins made on this device. */
  ownerId: string;
  createdAt: number;
};

export type NewPin = Omit<Pin, "id" | "createdAt" | "ownerId">;

export type Profile = {
  photoUri: string | null;
  businessName: string;
  realName: string;
};
