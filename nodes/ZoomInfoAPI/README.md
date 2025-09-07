# ZoomInfo API Node

This node allows you to interact with the ZoomInfo API to search for and retrieve contact and company information, providing detailed B2B data for your workflows.

## Overview

The ZoomInfo API node connects to the ZoomInfo API to search for and retrieve contact and company information. It provides access to ZoomInfo's extensive B2B database, allowing you to enrich your data with detailed information about companies and contacts.

## Prerequisites

- **ZoomInfo API Access Token**: You need a valid access token from ZoomInfo to use this node. You can obtain one by subscribing to the ZoomInfo API service.

## Operations

### Contact Search
- **Search for contacts**: Search for contacts using various criteria such as name, email, company, job title, location, etc.

### Company Search
- **Search for companies**: Search for companies using various criteria such as name, website, industry, size, location, etc.

## Input Parameters

### Operation
- **Contact Search**: Search for contacts in the ZoomInfo database.
- **Company Search**: Search for companies in the ZoomInfo database.

### API Endpoint
- **API Endpoint**: The ZoomInfo API endpoint to use. Default is `https://api.zoominfo.com`.

### Search Parameters
- **Search Parameters**: Various parameters to filter your search, depending on the operation selected.

### Additional Fields (Optional)
- **Max Results**: Maximum number of results to return. Default is 10.
- **Page**: Page number for paginated results. Default is 1.
- **Output Field Name**: The name of the field where search results will be stored. Default is `data`.

## Output Fields

The node adds the search results to the output data in the specified output field (default: `data`). The results include:

- **For Contact Search**: Detailed information about contacts matching your search criteria, including name, email, phone, job title, company, etc.
- **For Company Search**: Detailed information about companies matching your search criteria, including name, website, industry, size, revenue, etc.

## Examples

### Basic Contact Search

This example shows how to search for contacts by company name and job title.

1. **ZoomInfo API node**:
   - Set "Operation" to `Contact Search`
   - Set "Company Name" to `Acme Inc`
   - Set "Job Title" to `Marketing Manager`
   - Leave other settings as default

2. **IF node**: Routes the workflow based on search results.
   - If `{{$json.data.contacts.length > 0}}`, proceed with processing contacts
   - Otherwise, handle no results case

### Company Enrichment

This example shows how to enrich company data using the company domain.

1. **HTTP Request node**: Receives a webhook with company domain to look up.
2. **ZoomInfo API node**:
   - Set "Operation" to `Company Search`
   - Set "Domain" to `{{$json.domain}}`
   - Leave other settings as default
3. **Set node**: Combines the original data with the enriched company data.

## Additional Resources

- [ZoomInfo API Documentation](https://api.zoominfo.com/docs)
- [ZoomInfo Website](https://www.zoominfo.com/)
