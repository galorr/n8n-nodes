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
	ZoomInfoContactEnrichResponse,
	ZoomInfoCompanyEnrichResponse,
	ZoomInfoErrorResponse,
	ZoomInfoResponse,
} from '../../types';
import { createToken } from '../../types/utils';

export class ZoominfoEnrich implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ZoomInfo Enrich',
		name: 'zoominfoEnrich',
		icon: 'file:zoominfoEnrich.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Enrich contact and company data using ZoomInfo API',
		defaults: {
			name: 'ZoomInfo Enrich',
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
						name: 'Contact Enrich',
						value: 'contactEnrich',
						description: 'Enrich contact data',
						action: 'Enrich contact data',
					},
					{
						name: 'Company Enrich',
						value: 'companyEnrich',
						description: 'Enrich company data',
						action: 'Enrich company data',
					},
				],
				default: 'contactEnrich',
			},
			{
				displayName: 'API Endpoint',
				name: 'apiEndpoint',
				type: 'string',
				default: 'https://api.zoominfo.com',
				description: 'The ZoomInfo API endpoint to use',
				required: true,
			},

			// Contact Enrich Parameters
			{
				displayName: 'Contact Identifier',
				name: 'contactIdentifier',
				type: 'options',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
					},
				},
				options: [
					{
						name: 'Email',
						value: 'email',
						description: 'Identify contact by email address',
					},
					{
						name: 'Contact ID',
						value: 'contactId',
						description: 'Identify contact by ZoomInfo contact ID',
					},
					{
						name: 'Name and Company',
						value: 'nameAndCompany',
						description: 'Identify contact by name and company',
					},
				],
				default: 'email',
				description: 'How to identify the contact to enrich',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Email address of the contact to enrich',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
						contactIdentifier: [
							'email',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				description: 'ZoomInfo contact ID to enrich',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
						contactIdentifier: [
							'contactId',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of the contact to enrich',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
						contactIdentifier: [
							'nameAndCompany',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of the contact to enrich',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
						contactIdentifier: [
							'nameAndCompany',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				default: '',
				description: 'Company name where the contact works',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
						contactIdentifier: [
							'nameAndCompany',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Company Domain',
				name: 'companyDomain',
				type: 'string',
				default: '',
				description: 'Company domain where the contact works (optional but recommended)',
				displayOptions: {
					show: {
						operation: [
							'contactEnrich',
						],
						contactIdentifier: [
							'nameAndCompany',
						],
					},
				},
			},

			// Company Enrich Parameters
			{
				displayName: 'Company Identifier',
				name: 'companyIdentifier',
				type: 'options',
				displayOptions: {
					show: {
						operation: [
							'companyEnrich',
						],
					},
				},
				options: [
					{
						name: 'Domain',
						value: 'domain',
						description: 'Identify company by domain',
					},
					{
						name: 'Company ID',
						value: 'companyId',
						description: 'Identify company by ZoomInfo company ID',
					},
					{
						name: 'Company Name',
						value: 'companyName',
						description: 'Identify company by name',
					},
				],
				default: 'domain',
				description: 'How to identify the company to enrich',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				description: 'Domain of the company to enrich',
				displayOptions: {
					show: {
						operation: [
							'companyEnrich',
						],
						companyIdentifier: [
							'domain',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ZoomInfo company ID to enrich',
				displayOptions: {
					show: {
						operation: [
							'companyEnrich',
						],
						companyIdentifier: [
							'companyId',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Company Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the company to enrich',
				displayOptions: {
					show: {
						operation: [
							'companyEnrich',
						],
						companyIdentifier: [
							'companyName',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Location of the company (city, state, country) to improve matching',
				displayOptions: {
					show: {
						operation: [
							'companyEnrich',
						],
						companyIdentifier: [
							'companyName',
						],
					},
				},
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
						displayName: 'Output Field Name',
						name: 'outputField',
						type: 'string',
						default: 'data',
						description: 'The name of the field to store the enrichment results',
					},
					{
						displayName: 'Match Confidence',
						name: 'matchConfidence',
						type: 'options',
						options: [
							{
								name: 'High',
								value: 'high',
								description: 'Only return high confidence matches',
							},
							{
								name: 'Medium',
								value: 'medium',
								description: 'Return medium or high confidence matches',
							},
							{
								name: 'Low',
								value: 'low',
								description: 'Return all matches including low confidence ones',
							},
						],
						default: 'high',
						description: 'The minimum confidence level for matches',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData(); console.log('items:', items);
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('zoomInfoApi') as {
			userName: string;
			clientId: string;
			privateKey: string;
		};

		const accessToken = await createToken(credentials.userName, credentials.clientId, credentials.privateKey);
		console.log('Access Token:', accessToken);

		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {
				// Get API endpoint
				const apiEndpoint = this.getNodeParameter('apiEndpoint', i) as string;

				// Get additional fields
				const additionalFields = this.getNodeParameter('additionalFields', i) as {
					outputField?: string;
					matchConfidence?: string;
				};

				// Set default output field name if not provided
				const outputField = additionalFields.outputField || 'data';
				const matchConfidence = additionalFields.matchConfidence || 'high';

				// Handle "Contact Enrich" operation
				if (operation === 'contactEnrich') {
					const contactIdentifier = this.getNodeParameter('contactIdentifier', i) as string;
					let requestBody: Record<string, any> = {};

					// Build request body based on identifier type
					if (contactIdentifier === 'email') {
						const email = this.getNodeParameter('email', i) as string;
						requestBody = { email };
					} else if (contactIdentifier === 'contactId') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						requestBody = { id: contactId };
					} else if (contactIdentifier === 'nameAndCompany') {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const companyName = this.getNodeParameter('companyName', i) as string;

						requestBody = {
							firstName,
							lastName,
							companyName,
						};

						// Add company domain if provided
						const companyDomain = this.getNodeParameter('companyDomain', i, '') as string;
						if (companyDomain) {
							requestBody.companyDomain = companyDomain;
						}
					}

					// Add match confidence if provided
					if (matchConfidence) {
						requestBody.matchConfidence = matchConfidence;
					}

					// Make API request to ZoomInfo
					const requestOptions: IHttpRequestOptions = {
						method: 'POST',
						url: `${apiEndpoint}/enrich/contact`,
						body: requestBody,
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
					const contactResponse = response as ZoomInfoContactEnrichResponse;

					// Clone the item to add our new data
					const newItem: INodeExecutionData = {
						json: {
							...items[i].json,
						},
						pairedItem: items[i].pairedItem,
					};

					// Add enrichment results to the output
					newItem.json[outputField] = contactResponse;

					returnData.push(newItem);
				}
				// Handle "Company Enrich" operation
				else if (operation === 'companyEnrich') {
					const companyIdentifier = this.getNodeParameter('companyIdentifier', i) as string;
					let requestBody: Record<string, any> = {};

					// Build request body based on identifier type
					if (companyIdentifier === 'domain') {
						const domain = this.getNodeParameter('domain', i) as string;
						requestBody = { domain };
					} else if (companyIdentifier === 'companyId') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						requestBody = { id: companyId };
					} else if (companyIdentifier === 'companyName') {
						const name = this.getNodeParameter('name', i) as string;
						requestBody = { name };

						// Add location if provided
						const location = this.getNodeParameter('location', i, '') as string;
						if (location) {
							requestBody.location = location;
						}
					}

					// Add match confidence if provided
					if (matchConfidence) {
						requestBody.matchConfidence = matchConfidence;
					}

					// Make API request to ZoomInfo
					const requestOptions: IHttpRequestOptions = {
						method: 'POST',
						url: `${apiEndpoint}/enrich/company`,
						body: requestBody,
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
					const companyResponse = response as ZoomInfoCompanyEnrichResponse;

					// Clone the item to add our new data
					const newItem: INodeExecutionData = {
						json: {
							...items[i].json,
						},
						pairedItem: items[i].pairedItem,
					};

					// Add enrichment results to the output
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
