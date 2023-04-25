export type stayImages = {
  id: number;
  image: string;
  main: boolean;
};

export type ActivityFee = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  price_type: "PER PERSON" | "WHOLE GROUP" | "PER PERSON PER NIGHT";
};

export type Inclusions = {
  name: string;
};

export type ExtrasIncluded = {
  name: string;
};

export type Facts = {
  name: string;
};

export type PrivateSafari = {
  price?: number;
  available: boolean;
  private_safari_images: stayImages[];
};

export type SharedSafari = {
  price?: number;
  available: boolean;
  shared_safari_images: stayImages[];
};

export type AllInclusive = {
  price?: number;
  available: boolean;
  all_inclusive_images: stayImages[];
};

export type OtherPackages = {
  price?: number;
  available: boolean;
  title?: string;
  about?: string;
  other_option_images: stayImages[];
};

export type OtherFeesResident = {
  id: number;
  name?: string;
  price: number;
  resident_fee_type?: string;
  guest_type?: "CHILD" | "ADULT" | "INFANT" | "TEEN" | "";
};

export type OtherFeesNonResident = {
  id: number;
  name?: string;
  price: number;
  nonresident_fee_type?: string;
  guest_type?: "CHILD" | "ADULT" | "INFANT" | "TEEN" | "";
};

export type RoomAvailabilityResidentGuest = {
  id: number;
  name?: string;
  description?: string;
  age_group?: string;
  price: number;
};

export type RoomAvailabilityResident = {
  id: number;
  slug?: string;
  num_of_available_rooms: number;
  room_resident_guest_availabilities: RoomAvailabilityResidentGuest[];
  price: number;
  date: string;
};

export type RoomAvailabilityNonResident = {
  id: number;
  slug?: string;
  num_of_available_rooms: number;
  room_non_resident_guest_availabilities: RoomAvailabilityResidentGuest[];
  price: number;
  date: string;
};

export type RoomType = {
  id: number;
  slug?: string;
  name?: string;
  capacity: number;
  child_capacity: number;
  infant_capacity: number;
  package: string;
  room_resident_availabilities: RoomAvailabilityResident[];
  room_non_resident_availabilities: RoomAvailabilityNonResident[];
};

export interface Stay {
  id: number;
  name: string;
  slug: string;
  property_name?: string;
  room_type: string;
  type_of_stay: string;
  description?: string;
  unique_about_place?: string;
  location?: string;
  city?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  capacity?: number;
  rooms?: number;
  beds?: number;
  bathrooms?: number;
  has_options: boolean;
  lodge_price_data_pdf?: string;
  total_num_of_reviews: number;
  stay_images: stayImages[];
  inclusions: Inclusions[];
  extras_included: ExtrasIncluded[];
  facts: Facts[];
  private_safari: PrivateSafari;
  shared_safari: SharedSafari;
  all_inclusive: AllInclusive;
  other_options: OtherPackages[];
  room_types: RoomType[];
  other_fees_resident: OtherFeesResident[];
  other_fees_non_resident: OtherFeesNonResident[];
  activity_fees: ActivityFee[];

  // Amenities
  swimming_pool: boolean;
  hot_tub: boolean;
  sauna: boolean;
  gym: boolean;
  patio: boolean;
  terrace: boolean;
  balcony: boolean;
  firepit: boolean;
  barbecue_grill: boolean;
  outdoor_dining_area: boolean;
  spa: boolean;
  wifi: boolean;
  parking: boolean;
  tv: boolean;
  air_conditioning: boolean;
  heating: boolean;
  kitchen: boolean;
  fridge: boolean;
  laundry: boolean;
  washing_machine: boolean;
  dedicated_working_area: boolean;
  smoke_alarm: boolean;
  first_aid_kit: boolean;
  medical_service_on_site: boolean;
  carbon_monoxide_detector: boolean;
  lockable_room: boolean;
  bar: boolean;
  restaurant: boolean;
  giftshop: boolean;
  photography_room: boolean;
  themed_room: boolean;
  pet_friendly: boolean;
  barber_shop: boolean;
  beauty_salon: boolean;
  ensuite_room: boolean;
  purified_drinking_water: boolean;
  firewood: boolean;
  conference_center: boolean;
  library: boolean;
  beachfront: boolean;
}

export interface UserTypes {
  id: number;
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
  avatar_url?: string;
  is_partner: boolean;
  email: string;
}
