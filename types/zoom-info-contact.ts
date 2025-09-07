/**
 * Interface representing a contact from ZoomInfo API
 */
export interface ZoomInfoContact {
  // Basic information
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string;
  gender?: string;

  // Contact information
  email?: string;
  emailStatus?: string;
  directPhone?: string;
  mobilePhone?: string;

  // Professional information
  jobTitle?: string;
  jobFunction?: string;
  jobLevel?: string;
  managementLevel?: string;
  department?: string;

  // Company information
  companyId?: string;
  companyName?: string;
  companyWebsite?: string;
  companyPhone?: string;
  companyIndustry?: string;
  companyRevenue?: string;
  companyEmployeeCount?: number;

  // Location information
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Social profiles
  linkedInUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;

  // Additional information
  lastUpdated?: string;
  accuracy?: number;
  confidenceScore?: number;

  // Raw response data
  rawData?: Record<string, any>;
}
