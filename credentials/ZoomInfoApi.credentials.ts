import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZoomInfoApi implements ICredentialType {
	name = 'zoomInfoApi';
	displayName = 'ZoomInfo API';
	documentationUrl = 'https://api.zoominfo.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Access token for ZoomInfo API authentication',
			required: true,
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.accessToken}}'
			}
		},
	};
}
