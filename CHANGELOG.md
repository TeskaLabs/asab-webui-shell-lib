# CHANGELOG for ASAB WebUI Shell

## 27.2.9

- Patch on 27.2.8 release increasing the timeout for `print-ready=true` from 500ms to 1500ms (#50)

## 27.2.8

- Fix on websocket interceptor (#45)

## 27.2.7

- Implement print-ready attribute state for whole application (#44)

## 27.2.6

- Extend I18nService module to also support loading localization from the Library (#39)

## 27.2.5

- Refactor print style for Reports due to issues with blank pages at the beginning of the print report (#43)

## 27.2.4

- Saving a theme in localstorage with manual modification (#40)

## 27.2.3

- Improve connection stability and recovery for the Beacon websocket service and connection, ensuring more reliable reconnection handling when network disruptions occur (#42)

## 27.2.2

- Use trusted publishing to NPM repo using OIDC (#41)

## 27.2.1

- Refactor beacons dispatching - it does not trigger unwanted re-renders of the application when beacons are not present. (#32)
- Implement offline indication tightly connected to beacons websocket tunnel. (#32)

## 27.1.5

- Add `cursor-pointer` className with the same style (#38)

## 27.1.4

- Conditionally remove networking indicator by setting request header to `'X-Networking-Indicator': 'off'`. The header is only internal and is not included in the request header of the API call (#37)

## 27.1.3

- Use updated version of ResultCard in `InvitationScreen` (#30)

## 27.1.2

- Fix on incorrect peerDependency version of ASAB WebUI Components (#36)

## 27.1.1

- Upgrade to react router v7, upgrade other "out of date" dependencies (#33)

## 26.3.3

- Implement overlay option to a Sidepanel (#34)

## 26.3.2

- Fix for informational screens with illustrations where layout was broken on screens with small height (#35)

## 26.3.1

- Implemented `hasSidebar` configuration option, implemented `hasHeaderTitle` configuration option, removed support for meta tags of header images in dynamic configuration (#8)

## 26.2.1

- Make AttentionRequired service a reusable module. Then it is initialized only in desired application where it is imported. (#29)

## 26.1.3

- Refactor Application store with createStore() from asab_webui_components to make global variables dynamic and fix issues with not updating the AppStore state dynamically. (#31)

## 26.1.2

- Import FlowbiteIllustration from `asab_webui_components` into informational screens (#27)

## 26.1.1

- Upgrade to react v19, remove redux dependency and replace it with custom redux-like context and AppStore, remove unused flag header (#17)

## 25.2.8

- Update page orientation in the theme-print styles (#21)

## 25.2.7

- Implement refresh token session validation to the Auth module (#22)

## 25.2.6

- Updated InvitationScreen. Update text and add margin for input (#18)

## 25.2.5

- Fix on global monaco hover styling, which was compromised by change in order of styles loading due to moving the styles from ASAB Components to ASAB Shell here #16 (#19)

## 25.2.4

- Updated import for isAuthorized from `asab_webui_components` to `asab_webui_components/seacat-auth` (#13)

## 25.2.3

- Added onLoad event on iframe with help content. Spinner shown while the frame is loading (#15)

## 25.2.2

- Reimplement styles from asab_webui_components_lib (#16)

## 25.1.13

- Update babel.config to allow handling recent features like BigInt on compilation (#14)

## 25.1.12

- Added parsing for `error.response.data` in `axios.interceptors` if `content-type: application/json` (#11)

## 25.1.11

- Upgrade axios peer dependency to `^1.8.4` (!9)

## 25.1.10

- Saving BigInt number in `axios.interceptors` if the type is `application/json` (!6)

## 25.1.9

- Display invitation URL if available (!10)

## 25.1.8

- Make auth header username displayal more defensive (!7)

## 25.1.7

- Upgrade the version

## 25.1.5

- Replace yarn with pnpm in github workflow (!2)

## 25.1.3

### Refactor

- Allow publish to npm only on tag build (!1)
