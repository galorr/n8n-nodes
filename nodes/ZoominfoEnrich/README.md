# ZoomInfo Enrich

This node allows you to enrich contact and company data using the ZoomInfo API.

## Operations

### Contact Enrich

Enrich contact data using one of the following identifiers:
- Email address
- ZoomInfo contact ID
- Name and company information

### Company Enrich

Enrich company data using one of the following identifiers:
- Domain
- ZoomInfo company ID
- Company name (with optional location)

## Prerequisites

- You need a ZoomInfo API account with access to the Enrich API endpoints
- You need to obtain an API access token from ZoomInfo

## Configuration

1. Create a new ZoomInfo API credential in n8n
2. Enter your ZoomInfo API access token
3. Use the ZoomInfo Enrich node in your workflow

## Example Usage

### Contact Enrichment by Email

This example shows how to enrich contact data using an email address:

1. Add the ZoomInfo Enrich node to your workflow
2. Select "Contact Enrich" as the operation
3. Select "Email" as the Contact Identifier
4. Enter the email address to enrich
5. Optionally set the match confidence level
6. Execute the workflow

### Company Enrichment by Domain

This example shows how to enrich company data using a domain:

1. Add the ZoomInfo Enrich node to your workflow
2. Select "Company Enrich" as the operation
3. Select "Domain" as the Company Identifier
4. Enter the domain to enrich
5. Optionally set the match confidence level
6. Execute the workflow

## API Documentation

For more information about the ZoomInfo API, refer to the [official API documentation](https://api-docs.zoominfo.com/#4c495fb6-68df-44bb-8703-0616f81cfdcb).
