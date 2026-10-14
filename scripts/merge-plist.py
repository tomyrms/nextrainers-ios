# Merge: template Info.plist + original app keys recovered from the shipped IPA.
import plistlib

template = r'C:/Users/jtoma/nextrainers-re/nextrainers-ios/ios/App/App/Info.plist'
original = r'C:/Users/jtoma/nextrainers-re/extracted/Payload/App.app/Info.plist'

with open(template, 'rb') as f:
    t = plistlib.load(f)
with open(original, 'rb') as f:
    o = plistlib.load(f)

# Keys recovered from the original binary
for key in [
    'NSUserTrackingUsageDescription',
    'NSPhotoLibraryUsageDescription',
    'NSCameraUsageDescription',
    'CFBundleURLTypes',
    'FacebookAppID',
    'FacebookDisplayName',
    'FacebookAutoLogAppEventsEnabled',
    'FacebookAdvertiserIDCollectionEnabled',
    'FacebookClientToken',
    'GIDClientID',
    'UIBackgroundModes',
    'NSSupportsLiveActivities',
    'NSSupportsLiveActivitiesFrequentUpdates',
    'com.apple.developer.associated-domains',
]:
    if key in o:
        t[key] = o[key]

t['UIRequiredDeviceCapabilities'] = ['arm64']
t['CFBundleDisplayName'] = 'Nextrainers'

with open(template, 'wb') as f:
    plistlib.dump(t, f, sort_keys=False)

print('merged Info.plist keys:')
for k in sorted(t.keys()):
    print(' -', k)
