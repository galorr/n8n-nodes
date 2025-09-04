import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class EmailVerificationHints implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Email Verification Hints',
		name: 'emailVerificationHints',
		icon: 'file:emailVerificationHints.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Enhance email verification with agent instructions',
		defaults: {
			name: 'Email Verification Hints',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Add Agent Instructions',
						value: 'addInstructions',
						description: 'Add agent instructions based on email verification results',
						action: 'Add agent instructions based on email verification results',
					},
				],
				default: 'addInstructions',
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
							'addInstructions',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Verification Result Field',
				name: 'verificationField',
				type: 'string',
				default: 'verification_result',
				description: 'The name of the field that contains the verification result',
				displayOptions: {
					show: {
						operation: [
							'addInstructions',
						],
					},
				},
				required: true,
			},
			{
				displayName: 'Instruction Selection Method',
				name: 'instructionSelectionMethod',
				type: 'options',
				noDataExpression: false,
				options: [
					{
						name: 'Random Valid Instruction',
						value: 'random',
						description: 'Select a random instruction for valid emails',
					},
					{
						name: 'Fixed Instruction Number',
						value: 'fixed',
						description: 'Select a specific instruction by number',
					},
					{
						name: 'Based on Email Domain',
						value: 'domain',
						description: 'Select instruction based on email domain',
					},
				],
				default: 'random',
				displayOptions: {
					show: {
						operation: [
							'addInstructions',
						],
					},
				},
			},
			{
				displayName: 'Instruction Number',
				name: 'instructionNumber',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 10,
				},
				default: 1,
				description: 'The specific instruction number to use (1-10)',
				displayOptions: {
					show: {
						operation: [
							'addInstructions',
						],
						instructionSelectionMethod: [
							'fixed',
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
							'addInstructions',
						],
					},
				},
				options: [
					{
						displayName: 'Invalid Email Instruction',
						name: 'invalidInstruction',
						type: 'string',
						default: 'Invalid email address. Do not send emails to this address.',
						description: 'The instruction to use for invalid emails',
					},
					{
						displayName: 'Output Field Name',
						name: 'outputField',
						type: 'string',
						default: 'agent_instructions',
						description: 'The name of the field to store the agent instructions',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Define the predefined prompts
		const AGENT_INSTRUCTIONS = [
			"Valid address. Send max 1 email every 3 days. Personalize first line; include unsubscribe footer.",
			"Valid. Use plain-text body (<25 lines), no images, no more than 2 hyperlinks.",
			"Valid. Subject line ≤ 55 chars, no ALL-CAPS, avoid words 'free' & 'guarantee'.",
			"Valid. Track opens with 1 pixel; disable click-tracking to reduce spam risk.",
			"Valid. Throttle to 200 msgs/day from this domain; pause if bounce rate > 3 %.",
			"Valid. Add '{{first_name}},' greeting and 1 personalized company fact.",
			"Valid. If no reply after 4 days, schedule exactly 1 follow-up; then stop.",
			"Valid. Attachments NOT allowed; share files via link only.",
			"Valid. Ensure SPF/DKIM pass; send from warm IP pool only.",
			"Valid. End every email with clear postal address + easy opt-out link (CAN-SPAM)."
		];

		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {
				// Handle "Add Agent Instructions" operation
				if (operation === 'addInstructions') {
					const emailField = this.getNodeParameter('emailField', i) as string;
					const verificationField = this.getNodeParameter('verificationField', i) as string;
					const instructionSelectionMethod = this.getNodeParameter('instructionSelectionMethod', i) as string;

					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						invalidInstruction?: string;
						outputField?: string;
					};

					// Set default output field name if not provided
					const outputField = additionalFields.outputField || 'agent_instructions';
					// Set default invalid instruction if not provided
					const invalidInstruction = additionalFields.invalidInstruction || 'Invalid email address. Do not send emails to this address.';

					// Get email and verification result from input data
					const email = items[i].json[emailField] as string || '';
					const verificationResult = items[i].json[verificationField] as {
						valid?: boolean;
						status?: string;
						sub_status?: string;
					} || {};

					// Clone the item to add our new data
					const newItem: INodeExecutionData = {
						json: {
							...items[i].json,
						},
						pairedItem: items[i].pairedItem,
					};

					// Check if email is valid based on verification result
					const isValid = verificationResult.valid === true || verificationResult.status === 'valid';

					// Select appropriate instruction
					let selectedInstruction = '';

					if (!isValid) {
						// For invalid emails, use the invalidInstruction
						selectedInstruction = invalidInstruction;
					} else {
						// For valid emails, select instruction based on method
						switch (instructionSelectionMethod) {
							case 'random':
								// Select random instruction
								const randomIndex = Math.floor(Math.random() * AGENT_INSTRUCTIONS.length);
								selectedInstruction = AGENT_INSTRUCTIONS[randomIndex];
								break;

							case 'fixed':
								// Select fixed instruction by number
								const instructionNumber = this.getNodeParameter('instructionNumber', i) as number;
								selectedInstruction = AGENT_INSTRUCTIONS[Math.min(instructionNumber, 10) - 1];
								break;

							case 'domain':
								// Select instruction based on email domain
								if (email && typeof email === 'string') {
									const domain = email.split('@')[1]?.toLowerCase();
									// Hash the domain to get a consistent instruction number for the same domain
									let hash = 0;
									for (let j = 0; j < domain?.length || 0; j++) {
										hash = ((hash << 5) - hash) + domain.charCodeAt(j);
										hash = hash & hash; // Convert to 32bit integer
									}
									const domainBasedIndex = Math.abs(hash % AGENT_INSTRUCTIONS.length);
									selectedInstruction = AGENT_INSTRUCTIONS[domainBasedIndex];
								} else {
									// Fallback to random if email not found or not a string
									const randomIndex = Math.floor(Math.random() * AGENT_INSTRUCTIONS.length);
									selectedInstruction = AGENT_INSTRUCTIONS[randomIndex];
								}
								break;

							default:
								// Default to random
								const defaultRandomIndex = Math.floor(Math.random() * AGENT_INSTRUCTIONS.length);
								selectedInstruction = AGENT_INSTRUCTIONS[defaultRandomIndex];
						}
					}

					// Add agent instructions to the output
					newItem.json[outputField] = selectedInstruction;

					// Add metadata about this operation
					newItem.json.email_verification_enhanced = true;
					newItem.json.instruction_selection_method = instructionSelectionMethod;

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
