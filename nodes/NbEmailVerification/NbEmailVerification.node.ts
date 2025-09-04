import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IHttpRequestOptions,
} from 'n8n-workflow';

export enum VerifyStatusCode {
	VALID = 0,
	INVALID = 1,
	DISPOSABLE = 2,
	CATCHALL = 3,
	UNKNOWN = 4,
}

export enum VerifyStatus {
	VALID = 'valid',
	INVALID = 'invalid',
	DISPOSABLE = 'disposable',
	CATCHALL = 'catchall',
	UNKNOWN = 'unknown',
}

export interface RawVerifiedEmail {
	status: VerifyStatusCode;
	result: VerifyStatus;
	email: string;
	created_at: string;
	flags: string[];
	suggested_correction: string;
	execution_time: number;
}

export class NbEmailVerification implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NeverBounce Email Verification',
		name: 'nbEmailVerification',
		icon: 'file:nbEmailVerification.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Verify email addresses using NeverBounce API',
		defaults: {
			name: 'NeverBounce Email Verification',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'neverBounceApi',
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
						name: 'Verify Email',
						value: 'verifyEmail',
						description: 'Verify an email address',
						action: 'Verify an email address',
					},
				],
				default: 'verifyEmail',
			},
			{
				displayName: 'Email Field',
				name: 'emailField',
				type: 'string',
				default: 'email',
				description: 'The name of the field that contains the email address',
				displayOptions: {
					show: {
						operation: [
							'verifyEmail',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'verifyEmail',
						],
					},
				},
				options: [
					{
						displayName: 'Output Field Name',
						name: 'outputField',
						type: 'string',
						default: 'verification_result',
						description: 'The name of the field to store the verification results',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 30,
						description: 'Timeout in seconds for the API request',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('neverBounceApi') as {
			apiKey: string;
		};

		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {
				// Handle "Verify Email" operation
				if (operation === 'verifyEmail') {
					const emailField = this.getNodeParameter('emailField', i) as string;

					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						outputField?: string;
						timeout?: number;
					};

					// Set default output field name if not provided
					const outputField = additionalFields.outputField || 'verification_result';

					// Get email from input data
					const email = items[i].json[emailField] as string || '';

					if (!email) {
						throw new NodeOperationError(this.getNode(), `No email found in field "${emailField}"`, { itemIndex: i });
					}

					// Make API request to NeverBounce
					const requestOptions: IHttpRequestOptions = {
						method: 'GET',
						url: `https://api.neverbounce.com/v4/single/check?key=${credentials.apiKey}&email=${email}`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					// Execute the request
					const response = await this.helpers.httpRequest(requestOptions) as RawVerifiedEmail;

					// Clone the item to add our new data
					const newItem: INodeExecutionData = {
						json: {
							...items[i].json,
						},
						pairedItem: items[i].pairedItem,
					};

					// Add verification results to the output
					newItem.json[outputField] = {
						valid: response.result === VerifyStatus.VALID,
						status: response.result,
						status_code: response.status,
						flags: response.flags || [],
						suggested_correction: response.suggested_correction || null,
						raw_response: response,
					};

					// Add metadata about this operation
					newItem.json.email_verified = true;
					newItem.json.verification_timestamp = new Date().toISOString();

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
