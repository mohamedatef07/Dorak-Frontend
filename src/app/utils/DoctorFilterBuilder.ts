import { IDoctorFilter } from '../types/IDoctorFilter';

export function buildDoctorFilter(params: {
  titles?: number[];
  genders?: number[];
  cities?: string[];
  searchText?: string;
  specializations?: string[];
  minRate?: number;
  maxRate?: number;
  minPrice?: number;
  maxPrice?: number;
  availableDate?: string;
}): Partial<IDoctorFilter> {
  const body: Partial<IDoctorFilter> = {};
  if (params.titles?.length)         body.Titles = params.titles;
  if (params.genders?.length)        body.Genders = params.genders;
  if (params.cities?.length)         body.Cities = params.cities;
  if (params.searchText?.trim())     body.SearchText = params.searchText.trim();
  if (params.specializations?.length) body.Specializations = params.specializations;
  if (params.minRate  != null)       body.MinRate  = params.minRate;
  if (params.maxRate  != null)       body.MaxRate  = params.maxRate;
  if (params.minPrice != null)       body.MinPrice = params.minPrice;
  if (params.maxPrice != null)       body.MaxPrice = params.maxPrice;
  if (params.availableDate)          body.AvailableDate = params.availableDate;
  return body;
}
