# CHANGELOG for ASAB WebUI Shell

## v24.47

### Releases

- v24.47-alpha36
- v24.47-alpha34
- v24.47-alpha16
- v24.47-alpha6

### Breaking changes

- A tenant was added to a beacon websocket path, thus WebUI version `v24.47-alpha16` and higher must be aligned with `asab-remote-control` service `v24.48-alpha` and higher.
- `X-Tenant` was removed from Request headers and `tenant_` was removed from websocket Sec-Websocket-Protocol in `v24.47-alpha6` WebUI version.

### Bugfix

- Fix session expiration handling (fixed the issues with idle mode, refactored the strucutre) and the session expiration info alert message (!463, INDIGO Sprint 250122, v24.47-alpha36)
- Do not include dummy secret in auth token request (!498, PLUM Sprint 241213, v24.47-alpha34)

### Refactor

- Add a tenant to beacon websocket connection path, this must be aligned with `asab-remote-control` service `v24.48-alpha` and higher (!467, INDIGO Sprint 241122, v24.47-alpha16)
- Remove `X-Tenant` from request headers, remove `tenant_` from websocket subprotocols (!458, INDIGO Sprint 241108, v24.47-alpha6)

## v24.43

### Releases

- v24.43-alpha5

### Refactor

- Refactor (lowercase) `X-Request-ID` header to `X-Request-Id` (!440, INDIGO Sprint 241030, v24.43-alpha5)

## v24.38

### Releases

- v24.38-alpha16
- v24.38-alpha9
- v24.38-alpha4
- v24.38-alpha2

### Refactor

- Implement sorting for available tenants (!412, INDIGO Sprint 240913, v24.38-alpha9)

### Features

- Implement `X-App: "webui"` and `X-Request-ID: <uid>` API request headers and `app_webui` and `request_id_<uid>` subprotocols to every request call to the service (!420, INDIGO Sprint 240913, v24.38-alpha16)
- Implement attention required service with Beacons and Toasts (!390, INDIGO Sprint 240913, v24.38-alpha2)

### Bugfix

- Fix issue on user trying to log in to the application without a assigned tenant, resulting in the infinite loop. (!413, INDIGO Sprint 240913, v24.38-alpha4)

## v24.28

### Releases

- v24.28-alpha33
- v24.28-alpha30
- v24.28-alpha8

### Breaking changes

- Added special attributes to work correctly to generate `pdf/png` exports for superuser. Recommended not to be combined with the `asab-pyppeteer` service of versions **lower** than `v24.32-alpha3`.

### Features

- Implement `print-ready` and `print-unauthorized` attribute for `UnauthorizedAccessScreen` (!375, INDIGO Sprint 240802, v24.28-alpha30)
- Add interceptors for injecting tenant into the request headers for API (`X-Tenant`) and websocket (`tenant_`) calls. (!348, INDIGO Sprint 240621, v24.28-alpha8)

### Bugfix

- Fix on implementation of `print-ready` and `print-unauthorized` attribute for `UnauthorizedAccessScreen` which was causing the application crashes (!386, INDIGO Sprint 240802, v24.28-alpha33)

## v24.19

### Releases

- v24.19-alpha30
- v24.19-alpha27
- v24.19-alpha23
- v24.19-alpha19
- v24.19-alpha15
- v24.19-alpha14
- v24.19-alpha12
- v24.19-alpha11
- v24.19-alpha9
- v24.19-alpha1

### Breaking changes

- User invitation path has been updated. Requires Seacat Auth `v24.17-beta1` or later.

### Features

- Update user invitation path (!332, PLUM Sprint 240531, v24.19-alpha19)
- Implement Application sidepanel feature (!310, INDIGO Sprint 240527, v24.19-alpha14)
- Change color and icon of username if the user is logged in as a superuser (!321, INDIGO Sprint 240527, v24.19-alpha11)
- Implement FullScreen mode (!252, INDIGO Sprint 240527, v24.19-alpha9)
- Add sorting to the Navigation item children (!305, INDIGO Sprint 240510, v24.19-alpha1)

### Refactor

- Updated info alert for Fullscreen mode. (!342, INDIGO Sprint 240621, v24.19-alpha30)
- Rename ErrorHandler component to RouteErrorHandler (!339, INDIGO Sprint 240621, v24.19-alpha27)
- Change svg chevron in sidebar bottom to bootstrap icon (!329, INDIGO Sprint 240607, v24.19-alpha23)
- Refactor `addAlertFromException`. Added new condition for checking new format of errors (!299, INDIGO Sprint 240527, v24.19-alpha12)

### Bugfix

- Change color of the caret in the DropdownToggle of the username (when user is logged in as superuser) (!328, INDIGO Sprint 240527, v24.19-alpha15)

## v24.08

- v24.08-alpha51
- v24.08-alpha49
- v24.08-alpha40
- v24.08-alpha33
- v24.08-alpha28
- v24.08-alpha27
- v24.08-alpha21
- v24.08-alpha14
- v24.08-alpha13
- v24.08-alpha10

### Breaking changes

- The option to hide sidebar items via configuration has been removed from `v24.08-alpha13`. Therefore the configuration schema needs to be updated accordingly.

### Features

- Log into last authorized tenant (!301, PLUM Sprint 240503, v24.08-alpha51)
- Implement cancel button for invitations (!285, INDIGO Sprint 240430, v24.08-alpha49)
- Implement PubSub messaging (!244, INDIGO Sprint 240411, v24.08-alpha40)
- Update auth header to use Seacat Account UI (!148, INDIGO Sprint 240301, v24.08-alpha21)
- Implement `removeComponent` method for `HeaderService` (!205, INDIGO Sprint 240301, v24.08-alpha14)

### Refactor

- Display the resources in the access control screen in alphabetical order (!254, INDIGO Sprint 240402, v24.08-alpha28)
- Remove the option to hide sidebar items using configuration (!232, INDIGO Sprint 240301, v24.08-alpha13)
- Change height of ResultCard and remove top margin to prevent scrolling (!122, INDIGO Sprint 240216, v24.08-alpha10)

### Bugfix

- Redirect URI in authorization request and token request must match (!255, INDIGO Sprint 240402, v24.08-alpha27)

### Hotfix

- Fix title service causing application crash due to render issues caused by useEffect in the Title service (!260, INDIGO Sprint 240411, v24.08-alpha33)

## v24.03

### Releases

- v24.03-alpha3

### Features

- Add ResultCard, which will be displayed after un/successfully inviting other users (!163, INDIGO Sprint 240105, v24.03-alpha3)

## v23.48

### Releases

- v23.48-alpha30
- v23.48-alpha28
- v23.48-alpha23
- v23.48-alpha22
- v23.48-alpha17
- v23.48-alpha6

### Features

- Add a "asab" websocket subprotocol to enable working of websocket connection with Chrome/Safari/... browsers. These browsers requires Sec-Websocket-Accept response header which this change should allow (!170, INDIGO Sprint 240105, v23.48-alpha28)
- Add "batman" to OAuth scope to enable authorized communication with ElasticSearch (!166, INDIGO Sprint 231208, v23.48-alpha22)


### Refactor

- Refactor handling of the Help button content in the header and make it more performant (!161, INDIGO Sprint 231208, v23.48-alpha17)
- Refactor sidebar styling and collapse behaviour and fixing :active state when clicking inside screens (!105, INDIGO Sprint 231110, v23.48-alpha6)
- Refactor sidebar modal and fixing behaviour of nav items so they will stay active on the correct item in library (!154, INDIGO Sprint 231124, v23.48-alpha23)

### Bugfix

- Fix displaying sidebar in the print, replace bootstrap styles form jsx to scss file (!172, INDIGO Sprint 240105, v23.48-alpha30)

## v23.45

### Releases

- v23.45-alpha6
- v23.45-alpha1

### Breaking changes

- After migration from react-router-dom v5 to react-router-dom v6, some of the routing components are not being supported. For more info, please see https://reactrouter.com/en/main/upgrading/v5

### Features

- Implement addAlertFromException method to render additional information from exceptions in Alert message (!106, INDIGO Sprint 231110, v23.45-alpha6)
- Migrate react-router-dom from v5 to v6 (!98, INDIGO Sprint 231027, v23.45-alpha1)

## v23.44

### Releases

- v23.44-alpha3

### Refactoring

- Rename `asab_webui_state` used for capturing the application state to `oauth2_state_<state>` and made a string instead of object from it to avoid race conditions (!116, INDIGO Sprint 231027, v23.44-alpha3)
