/*
	Mock manifest entries for About screen / DataTable UI checks in development.
	Ids use the mock_ prefix so real app.registerManifest calls are not overwritten.
	displayName values match each app’s webpack.build.js createManifest().
*/
const MOCK_MANIFEST_ENTRIES = [
	{ id: 'mock_lmio_webui', displayName: 'LogMan.io WebUI', version: 'v26.12-alpha1', created_at: '2026-03-10T08:15:00.000Z' },
	{ id: 'mock_seacat_pki_webui', displayName: 'SeaCat PKI WebUI', version: 'v25.48-alpha77', created_at: '2026-03-09T14:22:11.000Z' },
	{ id: 'mock_seacat_auth_webui', displayName: 'SeaCat Auth WebUI', version: 'v25.46-alpha12', created_at: '2026-03-09T12:01:33.000Z' },
	{ id: 'mock_seacat_admin_webui', displayName: 'SeaCat Admin WebUI', version: 'v25.45-alpha3', created_at: '2026-03-09T10:30:00.000Z' },
	{ id: 'mock_seacat_account_webui', displayName: 'SeaCat Account WebUI', version: 'v24.08-alpha2', created_at: '2026-03-02T12:40:00.000Z' },
	{ id: 'mock_lmio_observability_webui', displayName: 'LogMan.io Observability WebUI', version: 'v24.40-alpha3', created_at: '2026-03-08T18:45:00.000Z' },
	{ id: 'mock_lmio_parser_builder_webui', displayName: 'LogMan.io Parser Builder WebUI', version: 'v24.33-alpha1', created_at: '2026-03-07T11:00:00.000Z' },
	{ id: 'mock_lmio_trex_webui', displayName: 'LogMan.io Tenants WebUI', version: 'v24.03-alpha5', created_at: '2026-03-01T14:08:00.000Z' },
	{ id: 'mock_asab_tools_webui', displayName: 'ASAB Tools WebUI', version: 'v24.12-alpha3', created_at: '2026-03-03T08:22:00.000Z' },
	{ id: 'mock_bs_query_webui', displayName: 'BitSwan Query WebUI', version: 'v24.15-alpha1', created_at: '2026-03-03T19:48:00.000Z' },
	{ id: 'mock_lmio_alert_management_webui', displayName: 'LogMan.io Alerts WebUI', version: 'v24.38-beta2', created_at: '2026-03-08T09:30:00.000Z' },
	{ id: 'mock_lmio_analysis_webui', displayName: 'LogMan.io Analysis WebUI', version: 'v24.22-alpha2', created_at: '2026-03-05T10:05:00.000Z' },
	{ id: 'mock_lmio_detection_webui', displayName: 'LogMan.io Detection WebUI', version: 'v24.20-alpha15', created_at: '2026-03-04T22:11:00.000Z' },
	{ id: 'mock_lmio_logsources_webui', displayName: 'LogMan.io Log Sources WebUI', version: 'v24.35-alpha9', created_at: '2026-03-07T16:12:00.000Z' },
	{ id: 'mock_lmio_lookup_webui', displayName: 'LogMan.io Lookup WebUI', version: 'v24.18-alpha6', created_at: '2026-03-04T17:33:00.000Z' },
	{ id: 'mock_asab_config_webui', displayName: 'ASAB Config WebUI', version: 'v24.30-alpha4', created_at: '2026-03-06T20:18:00.000Z' },
	{ id: 'mock_asab_library_webui', displayName: 'ASAB Library WebUI', version: 'v24.25-alpha8', created_at: '2026-03-05T13:27:00.000Z' },
	{ id: 'mock_asab_maestro_webui', displayName: 'ASAB Maestro WebUI', version: 'v24.28-alpha26', created_at: '2026-03-06T15:44:00.000Z' },
];

export default MOCK_MANIFEST_ENTRIES;