# Nextrainers iOS — reconstructed shell

Rebuilt iOS application shell for **Nextrainers** (`com.nextrainers.app` v1.1.3),
reconstructed from the shipped IPA for interoperability and study. This is a
Capacitor 8 container that loads the remote web app from
`https://app.nextrainers.com` — exactly like the original.

Built and packaged as an **unsigned IPA** by GitHub Actions (see
`.github/workflows/build-ios.yml`). Sideload it with AltStore / Sideloadly /
Feather and your own Apple ID.

## What is reconstructed

| Piece | Source of truth | Status |
|---|---|---|
| Capacitor config | `capacitor.config.json` from the IPA | exact copy |
| Plugin set | `packageClassList` in the config | mapped to public npm packages (Capacitor 8.x) |
| Web assets (`public/`) | IPA `public/` folder (offline fallback) | exact copy |
| Info.plist keys | IPA `Info.plist` (URL schemes, FB, Google, usage strings, background modes, Live Activities) | merged into template |
| `GenerationProgressPlugin.swift` | JS contract in the web bundle + binary symbols | re-implemented (ActivityKit, push token events) |
| `MainViewController` / storyboard wiring | binary symbols | re-implemented |
| Widget extension | binary strings/symbols (`GenerationActivityAttributes`, `GenerationLockScreenView`, `GenerationTimerText`) | sources included, target wiring manual (see `ios/App/GenerationActivityWidget/README.md`) |
| App icon | IPA PNGs | upscaled 120→1024 for the single-size asset catalog |
| Firebase Messaging (AppDelegate) | IPA `AppDelegate` + `FIRMessaging` symbols | not yet wired (v2) |

## Build

**CI (recommended):** push to `main` or run the *Build unsigned IPA* workflow
manually; download the `Nextrainers-unsigned-ipa` artifact.

**Local (macOS + Xcode 16+):**

```bash
npm install
npx cap sync ios
open ios/App/App.xcodeproj
# or:
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -sdk iphoneos -destination 'generic/platform=iOS' \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build
```

## Notes

- The IPA is **unsigned**: it installs via sideloading tools only, which re-sign
  it with your personal certificate.
- Capabilities that need entitlements (push, associated domains, App Groups)
  depend on the signing profile used at re-sign time.
- All branding, artwork and content belong to their respective owners; this
  repository exists for personal interoperability/testing of software the user
  possesses.
