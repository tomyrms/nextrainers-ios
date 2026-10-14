# GenerationActivityWidget (widget extension)

Reconstruction of the shipped `GenerationActivityWidget.appex` (Live Activity UI:
lock screen view + Dynamic Island).

**Wired into `ios/App/App.xcodeproj`** by `scripts/wire-widget.cjs` (idempotent,
fixed object ids — rerun it after regenerating the project):

- target `GenerationActivityWidget` (app extension, iOS 16.2,
  `com.nextrainers.app.GenerationActivityWidget`, `Info.plist` from this folder);
- `App/GenerationActivityAttributes.swift` compiled into **both** targets;
- embedded in `App.app/PlugIns` via the App target's "Embed Foundation Extensions"
  phase (CI checks it after the build);
- the App target also links `FirebaseMessaging` (remote SPM package
  `firebase-ios-sdk`). `GoogleService-Info.plist` is not committed: drop it into
  `ios/App/App/` (and add it to the App target) to enable Firebase.

The JS side (`GenerationProgress` plugin, `start`/`end`) and the APNs
`liveActivityToken` push registration already exist in the app; the server pushes
Live Activity updates to that token.
