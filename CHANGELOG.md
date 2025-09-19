# CHANGELOG for ASAB WebUI Shell

## 26.3.4

- Use updated version of ResultCard in `InvitationScreen` (#30)

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
