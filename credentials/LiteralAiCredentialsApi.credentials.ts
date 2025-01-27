import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LiteralAiCredentialsApi implements ICredentialType {
	name = 'literalAiCredentialsApi';
	displayName = 'Literal Ai Credentials API';
	documentationUrl = 'https://docs.literal.ai/';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://cloud.getliteral.ai',
			placeholder: 'https://docs.literalai.com',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{ $credentials.apiKey }}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			url: '={{ $credentials.apiUrl }}',
			headers: {
				'Authorization': '=Bearer {{ $credentials.apiKey }}',
			},
		},
	};
}
