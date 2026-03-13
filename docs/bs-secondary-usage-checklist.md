# `--bs-secondary` usage checklist (dark theme: now deep-ocean-blue)

Use this list to verify the dark-theme change (`--bs-secondary` = deep-ocean-blue) does not break visuals.

---

## Direct `var(--bs-secondary)` or `--bs-secondary-rgb` usage

| Location | Usage | Risk | What to check (dark theme) |
|----------|--------|------|----------------------------|
| **asab-webui-shell-lib** | | | |
| `components/alert.scss` | `background-color: rgba(var(--bs-secondary-rgb))` | None (intended) | Alert secondary: dark blue background, readable text. |
| `components/button.scss` | `background-color: rgba(var(--bs-secondary-rgb), 0.75)` on hover | Low | Secondary button hover: slightly transparent dark blue. |
| `components/card.scss` | `border-bottom: 2px solid var(--bs-secondary)` (card tabs) | Low | Tab underline: dark blue border. |
| **lmio_observability_webui** | | | |
| `discover2/.../DiscoverUncollapsedRow.scss` | `border-bottom: 2px solid var(--bs-secondary)` | Low | Row border: dark blue. |
| `discover2/.../DiscoverTableCard.scss` | `/* color: var(--bs-secondary) */` | None | Commented out. |
| `dashboard/widgets/WidgetContainer.scss` | `border: 1px solid var(--bs-secondary)` | Low | Widget border: dark blue. |
| **lmio_analysis_webui** | | | |
| `components/BaselineChart.js` | `color: 'var(--bs-secondary)'` (chart legend/lines) | **Medium** | Chart lines/legend were lavender; now deep-ocean-blue. On dark background, lines may be hard to see. **Test contrast.** |
| **lmio_logsources_webui** | | | |
| `replay/detail/ReplayDetailScreen.scss` | `background: var(--bs-secondary)` | Low | Panel background: dark blue. |
| `collector/CollectorConfigScreen.scss` | `border-bottom: var(--bs-secondary)` | Low | Border color (missing width/style in rule). |
| **lmio_alert_management_webui** | | | |
| `alerts/utils/GenerateStatus.scss` | `background: var(--bs-secondary)` | Low | Status background. |
| `alerts/.../TicketTimeline.scss` | `border-left: 2px dotted`, `border: 0.1em solid` | Low | Timeline borders: dark blue. |
| **bs_query_webui** | | | |
| `export/utils/statusTranslations.scss` | `background: var(--bs-secondary)` | Low | Status background. |
| **asab_maestro_webui** | | | |
| `services/ServicesScreen.scss` | `background: var(--bs-secondary)` | Low | Section background. |

---

## Bootstrap semantic vars (`--bs-secondary-bg`, `--bs-secondary-color`)

These are set by Bootstrap (may be derived from `--bs-secondary`). Still worth a quick check in dark theme:

| Location | Usage |
|----------|--------|
| `lmio_observability_webui/.../PromptLarkFilter.scss` | `background-color: var(--bs-secondary-bg)` |
| `lmio_observability_webui/.../Prompt2.scss` | `background-color: var(--bs-secondary-bg)` |
| `lmio_alert_management_webui/.../CredentialsDropdown.scss` | `background-color: var(--bs-secondary-bg)`, `color: var(--bs-secondary-color)` |

---

## Suggested test order

1. **High:** lmio_analysis_webui – Analysis / BaselineChart (legend and line visibility in dark mode).
2. **Medium:** Shell lib – Cards with tabs, secondary buttons, alert-secondary (already validated).
3. **Quick pass:** Observability (Discover table row, Widget container), Logsources (Replay detail, Collector config), Alert management (Generate status, Ticket timeline), BS Query (status), Maestro (Services screen), and the three Bootstrap semantic usages above.
