# GenerationActivityWidget (widget extension)

Reconstruction of the shipped `GenerationActivityWidget.appex` (Live Activity UI).

**Not wired into the Xcode project in v1** — the app builds and runs without it.
To enable Live Activities, add the widget target on macOS:

1. Open `ios/App/App.xcodeproj` in Xcode.
2. File → New → Target… → **Widget Extension**, name: `GenerationActivityWidget`,
   uncheck "Include Configuration App Intent", check "Include Live Activity".
3. Replace the generated Swift files with `GenerationActivityWidgetBundle.swift`
   and `GenerationActivityWidget.swift` from this folder; set `Info.plist` to the
   one here (or paste its keys).
4. Add `../App/GenerationActivityAttributes.swift` to **both** targets
   (App target: File Inspector → Target Membership).
5. Target settings:
   - Bundle Identifier: `com.nextrainers.app.GenerationActivityWidget`
   - iOS Deployment Target: **16.2**
   - Info → NSSupportsLiveActivities = YES
   - App target: embed the extension (the default "Embed Foundation Extensions"
     phase is created automatically).

The JS side (`GenerationProgress` plugin, `start`/`end`) and the APNs
`liveActivityToken` push registration already exist in the app; the server pushes
Live Activity updates to that token.
