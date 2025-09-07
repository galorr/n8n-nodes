/**
 * Interface representing a company from ZoomInfo API
 */
export interface ZoomInfoCompany {
  // Basic information
  id: string;
  name: string;
  website?: string;
  ticker?: string;
  description?: string;
  founded?: string;

  // Contact information
  phone?: string;
  fax?: string;
  email?: string;

  // Industry information
  industry?: string;
  subIndustry?: string;
  sic?: string;
  naics?: string;

  // Size information
  employeeCount?: number;
  employeeRange?: string;
  revenue?: string;
  revenueRange?: string;

  // Location information
  headquarters?: ZoomInfoLocation;
  locations?: ZoomInfoLocation[];

  // Social profiles
  linkedInUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;

  // Additional information
  technologies?: string[];
  competitors?: string[];
  lastUpdated?: string;

  // Raw response data
  rawData?: Record<string, any>;
}

/**
 * Interface representing a company location
 */
export interface ZoomInfoLocation {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isHeadquarters?: boolean;
}
