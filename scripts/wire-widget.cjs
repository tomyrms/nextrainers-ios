// Wires the Live Activity widget extension and Firebase Messaging into
// ios/App/App.xcodeproj. Idempotent: every object uses a fixed id, so running
// it twice leaves the project unchanged. Run: node scripts/wire-widget.cjs
//
// - GenerationActivityWidget: app-extension target (iOS 16.2) built from
//   ios/App/GenerationActivityWidget/, sharing App/GenerationActivityAttributes.swift
//   with the App target, embedded in App.app/PlugIns via "Embed Foundation Extensions".
// - FirebaseMessaging: remote SPM package on the App target (not in the
//   regenerated CapApp-SPM package).
const path = require('path');
const fs = require('fs');
const xcode = require('xcode');

const PBX = path.join(__dirname, '..', 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');
const APP_TARGET = '504EC3031FED79650016851F';
const PROJECT = '504EC2FC1FED79650016851F';
const MAIN_GROUP = '504EC2FB1FED79650016851F';
const PRODUCTS_GROUP = '504EC3051FED79650016851F';
const APP_FRAMEWORKS_PHASE = '504EC3011FED79650016851F';
const ATTRIBUTES_REF = '346D679A3E644E8C97EE5DF5'; // App/GenerationActivityAttributes.swift

const WIDGET = 'GenerationActivityWidget';
const BUNDLE_ID = 'com.nextrainers.app.GenerationActivityWidget';
const MARKETING_VERSION = '1.1.3';

// Fixed ids (24 hex chars, "AB..." prefix keeps them apart from Xcode's).
const ID = {
  target: 'AB0000000000000000000001',
  product: 'AB0000000000000000000002',
  group: 'AB0000000000000000000003',
  bundleRef: 'AB0000000000000000000004',
  widgetRef: 'AB0000000000000000000005',
  plistRef: 'AB0000000000000000000006',
  bundleBuild: 'AB0000000000000000000007',
  widgetBuild: 'AB0000000000000000000008',
  attributesBuild: 'AB0000000000000000000009',
  sources: 'AB000000000000000000000A',
  frameworks: 'AB000000000000000000000B',
  resources: 'AB000000000000000000000C',
  configList: 'AB000000000000000000000D',
  debug: 'AB000000000000000000000E',
  release: 'AB000000000000000000000F',
  embedPhase: 'AB0000000000000000000010',
  embedBuild: 'AB0000000000000000000011',
  proxy: 'AB0000000000000000000012',
  dependency: 'AB0000000000000000000013',
  firebasePkg: 'AB0000000000000000000020',
  messagingProduct: 'AB0000000000000000000021',
  messagingBuild: 'AB0000000000000000000022',
};

const proj = xcode.project(PBX);
proj.parseSync();
const objects = proj.hash.project.objects;

function section(isa) {
  if (!objects[isa]) objects[isa] = {};
  return objects[isa];
}

function put(isa, id, value, comment) {
  section(isa)[id] = value;
  section(isa)[`${id}_comment`] = comment;
}

function pushOnce(list, value, comment) {
  if (!list.some((item) => item.value === value)) list.push({ value, comment });
}

// ---------------------------------------------------------------- files

put('PBXFileReference', ID.product, {
  isa: 'PBXFileReference', explicitFileType: '"wrapper.app-extension"', includeInIndex: 0,
  path: `${WIDGET}.appex`, sourceTree: 'BUILT_PRODUCTS_DIR',
}, `${WIDGET}.appex`);
put('PBXFileReference', ID.bundleRef, {
  isa: 'PBXFileReference', lastKnownFileType: 'sourcecode.swift', path: `${WIDGET}Bundle.swift`, sourceTree: '"<group>"',
}, `${WIDGET}Bundle.swift`);
put('PBXFileReference', ID.widgetRef, {
  isa: 'PBXFileReference', lastKnownFileType: 'sourcecode.swift', path: `${WIDGET}.swift`, sourceTree: '"<group>"',
}, `${WIDGET}.swift`);
put('PBXFileReference', ID.plistRef, {
  isa: 'PBXFileReference', lastKnownFileType: 'text.plist.xml', path: 'Info.plist', sourceTree: '"<group>"',
}, 'Info.plist');

put('PBXGroup', ID.group, {
  isa: 'PBXGroup',
  children: [
    { value: ID.bundleRef, comment: `${WIDGET}Bundle.swift` },
    { value: ID.widgetRef, comment: `${WIDGET}.swift` },
    { value: ID.plistRef, comment: 'Info.plist' },
  ],
  path: WIDGET,
  sourceTree: '"<group>"',
}, WIDGET);
pushOnce(objects.PBXGroup[MAIN_GROUP].children, ID.group, WIDGET);
pushOnce(objects.PBXGroup[PRODUCTS_GROUP].children, ID.product, `${WIDGET}.appex`);

// ---------------------------------------------------------------- widget phases

put('PBXBuildFile', ID.bundleBuild, { isa: 'PBXBuildFile', fileRef: ID.bundleRef, fileRef_comment: `${WIDGET}Bundle.swift` }, `${WIDGET}Bundle.swift in Sources`);
put('PBXBuildFile', ID.widgetBuild, { isa: 'PBXBuildFile', fileRef: ID.widgetRef, fileRef_comment: `${WIDGET}.swift` }, `${WIDGET}.swift in Sources`);
put('PBXBuildFile', ID.attributesBuild, { isa: 'PBXBuildFile', fileRef: ATTRIBUTES_REF, fileRef_comment: 'GenerationActivityAttributes.swift' }, 'GenerationActivityAttributes.swift in Sources');

put('PBXSourcesBuildPhase', ID.sources, {
  isa: 'PBXSourcesBuildPhase', buildActionMask: 2147483647,
  files: [
    { value: ID.bundleBuild, comment: `${WIDGET}Bundle.swift in Sources` },
    { value: ID.widgetBuild, comment: `${WIDGET}.swift in Sources` },
    { value: ID.attributesBuild, comment: 'GenerationActivityAttributes.swift in Sources' },
  ],
  runOnlyForDeploymentPostprocessing: 0,
}, 'Sources');
put('PBXFrameworksBuildPhase', ID.frameworks, { isa: 'PBXFrameworksBuildPhase', buildActionMask: 2147483647, files: [], runOnlyForDeploymentPostprocessing: 0 }, 'Frameworks');
put('PBXResourcesBuildPhase', ID.resources, { isa: 'PBXResourcesBuildPhase', buildActionMask: 2147483647, files: [], runOnlyForDeploymentPostprocessing: 0 }, 'Resources');

// ---------------------------------------------------------------- widget configs

function widgetSettings(debug) {
  return {
    APPLICATION_EXTENSION_API_ONLY: 'YES',
    ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: 'AccentColor',
    CODE_SIGN_STYLE: 'Automatic',
    CURRENT_PROJECT_VERSION: 1,
    GENERATE_INFOPLIST_FILE: 'NO',
    INFOPLIST_FILE: `${WIDGET}/Info.plist`,
    IPHONEOS_DEPLOYMENT_TARGET: '16.2',
    LD_RUNPATH_SEARCH_PATHS: ['"$(inherited)"', '"@executable_path/Frameworks"', '"@executable_path/../../Frameworks"'],
    MARKETING_VERSION,
    PRODUCT_BUNDLE_IDENTIFIER: BUNDLE_ID,
    PRODUCT_NAME: '"$(TARGET_NAME)"',
    SKIP_INSTALL: 'YES',
    SWIFT_ACTIVE_COMPILATION_CONDITIONS: debug ? 'DEBUG' : '""',
    SWIFT_EMIT_LOC_STRINGS: 'YES',
    SWIFT_VERSION: '5.0',
    TARGETED_DEVICE_FAMILY: '"1,2"',
  };
}
put('XCBuildConfiguration', ID.debug, { isa: 'XCBuildConfiguration', buildSettings: widgetSettings(true), name: 'Debug' }, 'Debug');
put('XCBuildConfiguration', ID.release, { isa: 'XCBuildConfiguration', buildSettings: widgetSettings(false), name: 'Release' }, 'Release');
put('XCConfigurationList', ID.configList, {
  isa: 'XCConfigurationList',
  buildConfigurations: [{ value: ID.debug, comment: 'Debug' }, { value: ID.release, comment: 'Release' }],
  defaultConfigurationIsVisible: 0,
  defaultConfigurationName: 'Release',
}, `Build configuration list for PBXNativeTarget "${WIDGET}"`);

// ---------------------------------------------------------------- widget target

put('PBXNativeTarget', ID.target, {
  isa: 'PBXNativeTarget',
  buildConfigurationList: ID.configList,
  buildConfigurationList_comment: `Build configuration list for PBXNativeTarget "${WIDGET}"`,
  buildPhases: [
    { value: ID.sources, comment: 'Sources' },
    { value: ID.frameworks, comment: 'Frameworks' },
    { value: ID.resources, comment: 'Resources' },
  ],
  buildRules: [],
  dependencies: [],
  name: WIDGET,
  productName: WIDGET,
  productReference: ID.product,
  productReference_comment: `${WIDGET}.appex`,
  productType: '"com.apple.product-type.app-extension"',
}, WIDGET);

const project = objects.PBXProject[PROJECT];
pushOnce(project.targets, ID.target, WIDGET);
project.attributes.TargetAttributes[ID.target] = { CreatedOnToolsVersion: '16.0' };

// ---------------------------------------------------------------- embed in App

put('PBXContainerItemProxy', ID.proxy, {
  isa: 'PBXContainerItemProxy', containerPortal: PROJECT, containerPortal_comment: 'Project object',
  proxyType: 1, remoteGlobalIDString: ID.target, remoteInfo: WIDGET,
}, 'PBXContainerItemProxy');
put('PBXTargetDependency', ID.dependency, {
  isa: 'PBXTargetDependency', target: ID.target, target_comment: WIDGET,
  targetProxy: ID.proxy, targetProxy_comment: 'PBXContainerItemProxy',
}, 'PBXTargetDependency');
put('PBXBuildFile', ID.embedBuild, {
  isa: 'PBXBuildFile', fileRef: ID.product, fileRef_comment: `${WIDGET}.appex`,
  settings: { ATTRIBUTES: ['RemoveHeadersOnCopy'] },
}, `${WIDGET}.appex in Embed Foundation Extensions`);
put('PBXCopyFilesBuildPhase', ID.embedPhase, {
  isa: 'PBXCopyFilesBuildPhase', buildActionMask: 2147483647, dstPath: '""', dstSubfolderSpec: 13,
  files: [{ value: ID.embedBuild, comment: `${WIDGET}.appex in Embed Foundation Extensions` }],
  name: '"Embed Foundation Extensions"', runOnlyForDeploymentPostprocessing: 0,
}, 'Embed Foundation Extensions');

const app = objects.PBXNativeTarget[APP_TARGET];
pushOnce(app.buildPhases, ID.embedPhase, 'Embed Foundation Extensions');
pushOnce(app.dependencies, ID.dependency, 'PBXTargetDependency');

// ---------------------------------------------------------------- firebase

put('XCRemoteSwiftPackageReference', ID.firebasePkg, {
  isa: 'XCRemoteSwiftPackageReference',
  repositoryURL: '"https://github.com/firebase/firebase-ios-sdk"',
  requirement: { kind: 'upToNextMajorVersion', minimumVersion: '12.0.0' },
}, 'XCRemoteSwiftPackageReference "firebase-ios-sdk"');
put('XCSwiftPackageProductDependency', ID.messagingProduct, {
  isa: 'XCSwiftPackageProductDependency',
  package: ID.firebasePkg, package_comment: 'XCRemoteSwiftPackageReference "firebase-ios-sdk"',
  productName: 'FirebaseMessaging',
}, 'FirebaseMessaging');
put('PBXBuildFile', ID.messagingBuild, {
  isa: 'PBXBuildFile', productRef: ID.messagingProduct, productRef_comment: 'FirebaseMessaging',
}, 'FirebaseMessaging in Frameworks');

pushOnce(project.packageReferences, ID.firebasePkg, 'XCRemoteSwiftPackageReference "firebase-ios-sdk"');
pushOnce(app.packageProductDependencies, ID.messagingProduct, 'FirebaseMessaging');
pushOnce(objects.PBXFrameworksBuildPhase[APP_FRAMEWORKS_PHASE].files, ID.messagingBuild, 'FirebaseMessaging in Frameworks');

fs.writeFileSync(PBX, proj.writeSync());
console.log('wired', WIDGET, '+ FirebaseMessaging into', PBX);
