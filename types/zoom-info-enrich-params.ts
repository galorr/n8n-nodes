/**
 * Base interface for ZoomInfo enrich parameters
 */
export interface ZoomInfoBaseEnrichParams {
  matchConfidence?: 'high' | 'medium' | 'low';
}

/**
 * Interface for ZoomInfo contact enrich parameters using email
 */
export interface ZoomInfoContactEnrichByEmailParams extends ZoomInfoBaseEnrichParams {
  email: string;
}

/**
 * Interface for ZoomInfo contact enrich parameters using contact ID
 */
export interface ZoomInfoContactEnrichByIdParams extends ZoomInfoBaseEnrichParams {
  id: string;
}

/**
 * Interface for ZoomInfo contact enrich parameters using name and company
 */
export interface ZoomInfoContactEnrichByNameParams extends ZoomInfoBaseEnrichParams {
  firstName: string;
  lastName: string;
  companyName: string;
  companyDomain?: string;
}

/**
 * Type for all ZoomInfo contact enrich parameter types
 */
export type ZoomInfoContactEnrichParams =
  | ZoomInfoContactEnrichByEmailParams
  | ZoomInfoContactEnrichByIdParams
  | ZoomInfoContactEnrichByNameParams;

/**
 * Interface for ZoomInfo company enrich parameters using domain
 */
export interface ZoomInfoCompanyEnrichByDomainParams extends ZoomInfoBaseEnrichParams {
  domain: string;
}

/**
 * Interface for ZoomInfo company enrich parameters using company ID
 */
export interface ZoomInfoCompanyEnrichByIdParams extends ZoomInfoBaseEnrichParams {
  id: string;
}

/**
 * Interface for ZoomInfo company enrich parameters using company name
 */
export interface ZoomInfoCompanyEnrichByNameParams extends ZoomInfoBaseEnrichParams {
  name: string;
  location?: string;
}

/**
 * Type for all ZoomInfo company enrich parameter types
 */
export type ZoomInfoCompanyEnrichParams =
  | ZoomInfoCompanyEnrichByDomainParams
  | ZoomInfoCompanyEnrichByIdParams
  | ZoomInfoCompanyEnrichByNameParams;
