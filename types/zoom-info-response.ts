import { ZoomInfoContact } from './zoom-info-contact';
import { ZoomInfoCompany } from './zoom-info-company';

/**
 * Interface for pagination information in ZoomInfo API responses
 */
export interface ZoomInfoPagination {
  currentPage: number;
  perPage: number;
  totalResults: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Base interface for ZoomInfo API responses
 */
export interface ZoomInfoBaseResponse {
  success: boolean;
  status: number;
  message?: string;
  pagination?: ZoomInfoPagination;
}

/**
 * Interface for ZoomInfo contact search response
 */
export interface ZoomInfoContactSearchResponse extends ZoomInfoBaseResponse {
  data: {
    contacts: ZoomInfoContact[];
  };
}

/**
 * Interface for ZoomInfo company search response
 */
export interface ZoomInfoCompanySearchResponse extends ZoomInfoBaseResponse {
  data: {
    companies: ZoomInfoCompany[];
  };
}

/**
 * Interface for ZoomInfo error response
 */
export interface ZoomInfoErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: {
    code: string;
    message: string;
    field?: string;
  }[];
}

/**
 * Type for any ZoomInfo API response
 */
export type ZoomInfoResponse =
  | ZoomInfoContactSearchResponse
  | ZoomInfoCompanySearchResponse
  | ZoomInfoErrorResponse;
