export type Review = {
  user: string;
  date: string;
  message: string;
  imageUri?: string | null;
}

export type Location = {
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
    numMachines: number;
    address: string;
    placeID: string;
    imageURL?: string;
    reviews?: Review[];
};

export interface Photo {
  photo_reference: string;
  width: number;
  height: number;
}

export interface PlaceDetailsResponse {
  result: {
    photos: Photo[];
  };
}

export const apiKey = "AIzaSyCtvMQ8y_ZAh7QPCLNWh_iAmR9ffkhcUns"