/**
 * Base interface for ZoomInfo search parameters
 */
export interface ZoomInfoBaseSearchParams {
  // Pagination parameters
  page?: number;
  perPage?: number;
  maxResults?: number;
}

/**
 * Interface for ZoomInfo contact search parameters
 */
export interface ZoomInfoContactSearchParams extends ZoomInfoBaseSearchParams {
  // Basic search parameters
  firstName?: string;
  lastName?: string;
  email?: string;

  // Professional parameters
  jobTitle?: string;
  jobFunction?: string;
  jobLevel?: string;
  department?: string;

  // Company parameters
  companyName?: string;
  companyId?: string;
  companyDomain?: string;
  companyIndustry?: string;
  companyRevenue?: string | number;
  companyEmployeeCount?: number;

  // Location parameters
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;

  // Additional parameters
  excludeContactIds?: string[];
  updatedSince?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interface for ZoomInfo company search parameters
 */
export interface ZoomInfoCompanySearchParams extends ZoomInfoBaseSearchParams {
  // Basic search parameters
  name?: string;
  website?: string;
  domain?: string;
  ticker?: string;

  // Industry parameters
  industry?: string;
  subIndustry?: string;
  sic?: string;
  naics?: string;

  // Size parameters
  employeeCount?: number;
  employeeRange?: string;
  revenue?: string | number;
  revenueRange?: string;

  // Location parameters
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;

  // Additional parameters
  excludeCompanyIds?: string[];
  updatedSince?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

  // Technology parameters
  technologies?: string[];
}
