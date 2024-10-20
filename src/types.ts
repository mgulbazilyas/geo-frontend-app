export enum LocationEnum {
  Bath = 'bath',
  Bedroom = 'bedroom',
  DoubleRoom = 'double_room',
  DiningRoom = 'dining_room',
  Entrance = 'entrance',
  Hallway = 'hallway',
  Kitchen = 'kitchen',
  LivingRoom = 'living_room',
}

export enum RoleEnum {
  Admin = 'admin',
  BuildingOwner = 'building_owner',
  Resident = 'resident',
}

export interface Building {
  id: number;
  owner: number;
  number: number;
}

export interface Device {
  id: number;
  house: number;
  number: number;
  location: LocationEnum;
  type: string;
  last_state: string;
}

export interface House {
  id: number;
  resident: number | null;
  building: number;
  number: string;
}

export interface Reading {
  id: number;
  device: number;
  serial_number: number;
  date: string;
  reading_value: number;
  unit: string;
  power: number;
  method: string;
  battery_level: number;
}

export interface User {
  username: string;
  role: RoleEnum;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TokenObtainPair {
  access: string;
  refresh: string;
}

export interface TokenRefresh {
  access: string;
}

export interface PaginatedList<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaginatedBuildingList = PaginatedList<Building>;
export type PaginatedDeviceList = PaginatedList<Device>;
export type PaginatedHouseList = PaginatedList<House>;
export type PaginatedReadingList = PaginatedList<Reading>;
export type PaginatedUserList = PaginatedList<User>;
