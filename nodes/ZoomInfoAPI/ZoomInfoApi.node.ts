import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IHttpRequestOptions,
} from 'n8n-workflow';
import {
	ZoomInfoContactSearchParams,
	ZoomInfoCompanySearchParams,
	ZoomInfoContactSearchResponse,
	ZoomInfoCompanySearchResponse,
	ZoomInfoErrorResponse,
	ZoomInfoResponse,
} from '../../types';
import { createToken } from '../../types/utils';

export class ZoomInfoApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ZoomInfo API',
		name: 'zoomInfoApi',
		icon: 'file:zoomInfoApi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Search for contacts and companies using ZoomInfo API',
		defaults: {
			name: 'ZoomInfo API',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zoomInfoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact Search',
						value: 'contactSearch',
						description: 'Search for contacts',
						action: 'Search for contacts',
					},
					{
						name: 'Company Search',
						value: 'companySearch',
						description: 'Search for companies',
						action: 'Search for companies',
					},
				],
				default: 'contactSearch',
			},
			{
				displayName: 'API Endpoint',
				name: 'apiEndpoint',
				type: 'string',
				default: 'https://api.zoominfo.com',
				description: 'The ZoomInfo API endpoint to use',
				required: true,
			},

			// Contact Search Parameters
			{
				displayName: 'Search Parameters',
				name: 'contactSearchParameters',
				type: 'collection',
				placeholder: 'Add Parameter',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'contactSearch',
						],
					},
				},
				options: [
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City of the contact',
					},
					{
						displayName: 'Company Domain',
						name: 'companyDomain',
						type: 'string',
						default: '',
						description: 'Company domain the contact works for',
					},
					{
						displayName: 'Company Name',
						name: 'companyName',
						type: 'string',
						default: '',
						description: 'Company name the contact works for',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country of the contact',
					},
					{
						displayName: 'Department',
						name: 'department',
						type: 'string',
						default: '',
						description: 'Department of the contact',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'name@email.com',
						description: 'Email address of the contact',
					},
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'First name of the contact',
					},
					{
						displayName: 'Job Function',
						name: 'jobFunction',
						type: 'string',
						default: '',
						description: 'Job function of the contact',
					},
					{
						displayName: 'Job Level',
						name: 'jobLevel',
						type: 'string',
						default: '',
						description: 'Job level of the contact',
					},
					{
						displayName: 'Job Title',
						name: 'jobTitle',
						type: 'string',
						default: '',
						description: 'Job title of the contact',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'Last name of the contact',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'State of the contact',
					},
					{
						displayName: 'Zip Code',
						name: 'zipCode',
						type: 'string',
						default: '',
						description: 'Zip code of the contact',
					},
				],
			},

			// Company Search Parameters
			{
				displayName: 'Search Parameters',
				name: 'companySearchParameters',
				type: 'collection',
				placeholder: 'Add Parameter',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'companySearch',
						],
					},
				},
				options: [
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City of the company',
					},
					{
						displayName: 'Company Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the company',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country of the company',
					},
					{
						displayName: 'Domain',
						name: 'domain',
						type: 'string',
						default: '',
						description: 'Domain of the company',
					},
					{
						displayName: 'Employee Count',
						name: 'employeeCount',
						type: 'number',
						default: 0,
						description: 'Number of employees at the company',
					},
					{
						displayName: 'Industry',
						name: 'industry',
						type: 'string',
						default: '',
						description: 'Industry of the company',
					},
					{
						displayName: 'NAICS Code',
						name: 'naics',
						type: 'string',
						default: '',
						description: 'NAICS code of the company',
					},
					{
						displayName: 'Revenue',
						name: 'revenue',
						type: 'string',
						default: '',
						description: 'Revenue of the company',
					},
					{
						displayName: 'SIC Code',
						name: 'sic',
						type: 'string',
						default: '',
						description: 'SIC code of the company',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'State of the company',
					},
					{
						displayName: 'Sub-Industry',
						name: 'subIndustry',
						type: 'string',
						default: '',
						description: 'Sub-industry of the company',
					},
					{
						displayName: 'Website',
						name: 'website',
						type: 'string',
						default: '',
						description: 'Website of the company',
					},
					{
						displayName: 'Zip Code',
						name: 'zipCode',
						type: 'string',
						default: '',
						description: 'Zip code of the company',
					},
				],
			},

			// Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Max Results',
						name: 'maxResults',
						type: 'number',
						default: 10,
						description: 'Maximum number of results to return',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for paginated results',
					},
					{
						displayName: 'Output Field Name',
						name: 'outputField',
						type: 'string',
						default: 'data',
						description: 'The name of the field to store the search results',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('EnrichType', 0) as string;

		// Get credentials
				const credentials = await this.getCredentials('zoomInfoApi') as {
					userName: string;
					clientId: string;
					privateKey: string;
				};

				const accessToken = await createToken(credentials.userName, credentials.clientId, credentials.privateKey);

		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {
				// Get API endpoint
				const apiEndpoint = this.getNodeParameter('apiEndpoint', i) as string;

				// Get additional fields
				const additionalFields = this.getNodeParameter('additionalFields', i) as {
					maxResults?: number;
					page?: number;
					outputField?: string;
				};

				// Set default output field name if not provided
				const outputField = additionalFields.outputField || 'data';

				// Set pagination parameters
				const maxResults = additionalFields.maxResults || 10;
				const page = additionalFields.page || 1;

				// Handle "Contact Search" operation
				if (operation === 'contactSearch') {
					// Get search parameters
					const searchParameters = this.getNodeParameter('contactSearchParameters', i) as ZoomInfoContactSearchParams;

					// Prepare search parameters
					const searchParams: ZoomInfoContactSearchParams = {
						...searchParameters,
						page,
						perPage: maxResults,
					};

					// Make API request to ZoomInfo
					const requestOptions: IHttpRequestOptions = {
						method: 'POST',
						url: `${apiEndpoint}/enrich/contact`,
						body: searchParams,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`,
						},
						json: true,
					};

					// Execute the request
					const response = await this.helpers.httpRequest(requestOptions) as ZoomInfoResponse;

					// Check if the request was successful
					if (!response.success) {
						const errorResponse = response as ZoomInfoErrorResponse;
						throw new NodeOperationError(this.getNode(), `ZoomInfo API error: ${errorResponse.message}`);
					}

					// Process the response
					const contactResponse = response as ZoomInfoContactSearchResponse;

					// Clone the item to add our new data
					const newItem: INodeExecutionData = {
						json: {
							...items[i].json,
						},
						pairedItem: items[i].pairedItem,
					};

					// Add search results to the output
					newItem.json[outputField] = contactResponse;

					returnData.push(newItem);
				}
				// Handle "Company Search" operation
				else if (operation === 'companySearch') {
					// Get search parameters
					const searchParameters = this.getNodeParameter('companySearchParameters', i) as ZoomInfoCompanySearchParams;

					// Prepare search parameters
					const searchParams: ZoomInfoCompanySearchParams = {
						...searchParameters,
						page,
						perPage: maxResults,
					};

					// Make API request to ZoomInfo
					const requestOptions: IHttpRequestOptions = {
						method: 'POST',
						url: `${apiEndpoint}/enrich/company`,
						body: searchParams,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`,
						},
						json: true,
					};

					// Execute the request
					const response = await this.helpers.httpRequest(requestOptions) as ZoomInfoResponse;

					// Check if the request was successful
					if (!response.success) {
						const errorResponse = response as ZoomInfoErrorResponse;
						throw new NodeOperationError(this.getNode(), `ZoomInfo API error: ${errorResponse.message}`);
					}

					// Process the response
					const companyResponse = response as ZoomInfoCompanySearchResponse;

					// Clone the item to add our new data
					const newItem: INodeExecutionData = {
						json: {
							...items[i].json,
						},
						pairedItem: items[i].pairedItem,
					};

					// Add search results to the output
					newItem.json[outputField] = companyResponse;

					returnData.push(newItem);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
