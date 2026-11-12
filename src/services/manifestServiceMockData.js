/*
	Mock manifest entries for About screen / DataTable UI checks in development.
	Registered from ManifestService when NODE_ENV is development (ids prefixed with mock_).
*/
const MOCK_MANIFEST_ENTRIES = [
	{ id: 'mock_lmio_webui', displayName: 'LogMan.io WebUI', version: 'v26.12-alpha1', created_at: '2026-03-10T08:15:00.000Z' },
	{ id: 'mock_seacat_admin_webui', displayName: 'SeaCat Admin', version: 'v25.48-alpha77', created_at: '2026-03-09T14:22:11.000Z' },
	{ id: 'mock_seacat_auth_webui', displayName: 'SeaCat Auth', version: 'v25.46-alpha12', created_at: '2026-03-09T12:01:33.000Z' },
	{ id: 'mock_observability_webui', displayName: 'Observability', version: 'v24.40-alpha3', created_at: '2026-03-08T18:45:00.000Z' },
	{ id: 'mock_alert_management_webui', displayName: 'Alert Management', version: 'v24.38-beta2', created_at: '2026-03-08T09:30:00.000Z' },
	{ id: 'mock_logsources_webui', displayName: 'Log Sources', version: 'v24.35-alpha9', created_at: '2026-03-07T16:12:00.000Z' },
	{ id: 'mock_parser_builder_webui', displayName: 'Parser Builder', version: 'v24.33-alpha1', created_at: '2026-03-07T11:00:00.000Z' },
	{ id: 'mock_asab_config_webui', displayName: 'ASAB Config', version: 'v24.30-alpha4', created_at: '2026-03-06T20:18:00.000Z' },
	{ id: 'mock_asab_maestro_webui', displayName: 'ASAB Maestro', version: 'v24.28-alpha26', created_at: '2026-03-06T15:44:00.000Z' },
	{ id: 'mock_asab_library_webui', displayName: 'ASAB Library', version: 'v24.25-alpha8', created_at: '2026-03-05T13:27:00.000Z' },
	{ id: 'mock_lmio_analysis_webui', displayName: 'LogMan.io Analysis', version: 'v24.22-alpha2', created_at: '2026-03-05T10:05:00.000Z' },
	{ id: 'mock_lmio_detection_webui', displayName: 'Detection', version: 'v24.20-alpha15', created_at: '2026-03-04T22:11:00.000Z' },
	{ id: 'mock_lmio_lookup_webui', displayName: 'Lookup', version: 'v24.18-alpha6', created_at: '2026-03-04T17:33:00.000Z' },
	{ id: 'mock_bs_query_webui', displayName: 'BS Query', version: 'v24.15-alpha1', created_at: '2026-03-03T19:48:00.000Z' },
	{ id: 'mock_asab_tools_webui', displayName: 'ASAB Tools', version: 'v24.12-alpha3', created_at: '2026-03-03T08:22:00.000Z' },
	{ id: 'mock_asab_demo_webui', displayName: 'ASAB Demo', version: 'v24.10-alpha7', created_at: '2026-03-02T16:55:00.000Z' },
	{ id: 'mock_seacat_account_webui', displayName: 'SeaCat Account', version: 'v24.08-alpha2', created_at: '2026-03-02T12:40:00.000Z' },
	{ id: 'mock_seacat_pki_webui', displayName: 'SeaCat PKI', version: 'v24.05-alpha11', created_at: '2026-03-01T21:15:00.000Z' },
	{ id: 'mock_lmio_trex_webui', displayName: 'T-Rex', version: 'v24.03-alpha5', created_at: '2026-03-01T14:08:00.000Z' },
	{ id: 'mock_asab_webui_shell', displayName: 'ASAB WebUI Shell', version: 'v28.1.0', created_at: '2026-02-28T11:00:00.000Z' },
	{ id: 'mock_asab_webui_components', displayName: 'ASAB WebUI Components', version: 'v28.0.0', created_at: '2026-02-28T10:30:00.000Z' },
	{ id: 'mock_lmio_webui_components', displayName: 'LMIO WebUI Components', version: 'v27.2-alpha1', created_at: '2026-02-27T18:20:00.000Z' },
	{ id: 'mock_microlink_webui', displayName: 'Microlink WebUI', version: 'v1.4.0-alpha2', created_at: '2026-02-27T09:12:00.000Z' },
	{ id: 'mock_config_editor', displayName: 'Config Editor (mock)', version: 'v0.9.0-dev', created_at: '2026-02-26T16:00:00.000Z' },
	{ id: 'mock_legacy_portal', displayName: 'Legacy Portal (mock)', version: 'v0.1.0-mock', created_at: '2026-02-25T12:00:00.000Z' },
];

export default MOCK_MANIFEST_ENTRIES;
