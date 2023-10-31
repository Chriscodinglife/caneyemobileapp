// Set some types so we can track the status across different machines
export type MachineIndex = number;
export type MachineType = 'glass' | 'can' | 'bottle';
export type MachineStatus = 'thumbsUp' | 'repairNeeded';

// Set the expected types for the machine types
export type MachineData = {
    glass: { count: number; status: MachineStatus[] };
    can: { count: number; status: MachineStatus[] };
    bottle: { count: number; status: MachineStatus[] };
};

export type Review = {
  user: string;
  date: string;
  message?: string;
  imageUri?: string | null;
  machineData?: MachineData
  finish?: number
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
    recentReview?: Review;
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