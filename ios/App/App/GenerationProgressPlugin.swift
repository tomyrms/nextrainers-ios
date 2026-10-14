import Foundation
import Capacitor
import ActivityKit

// Custom Capacitor plugin driving the generation Live Activity.
// JS contract (from the shipped web app):
//   GenerationProgress.start(state)  -> requests the Activity (pushType: .token)
//   GenerationProgress.update(state) -> local content update
//   GenerationProgress.end({reason}) -> ends every running Activity
//   event "liveActivityToken"        -> { token } hex APNs push token for the activity
@objc(GenerationProgressPlugin)
public class GenerationProgressPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GenerationProgressPlugin"
    public let jsName = "GenerationProgress"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "end", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isSupported", returnType: CAPPluginReturnPromise)
    ]

    private var tokenTask: Task<Void, Never>?

    @objc func isSupported(_ call: CAPPluginCall) {
        if #available(iOS 16.2, *) {
            call.resolve(["supported": ActivityAuthorizationInfo().areActivitiesEnabled])
        } else {
            call.resolve(["supported": false])
        }
    }

    @objc func start(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.reject("Live Activities require iOS 16.2 or newer")
            return
        }

        let title = call.getString("title") ?? "Nextrainers"
        let message = call.getString("message") ?? ""
        let progress = call.getDouble("progress") ?? 0
        let expectedDuration = call.getDouble("expectedDuration") ?? 90
        let generationType = call.getString("generationType") ?? "generation"

        Task { @MainActor in
            await self.endAll()

            let attributes = GenerationActivityAttributes(generationType: generationType, title: title)
            let state = GenerationActivityAttributes.ContentState(
                message: message,
                progress: progress,
                expectedDuration: expectedDuration,
                startedAt: Date(),
                isMinimized: false
            )

            do {
                let activity = try Activity.request(
                    attributes: attributes,
                    content: ActivityContent(state: state, staleDate: nil),
                    pushType: .token
                )
                self.observePushToken(activity)
                call.resolve(["activityId": activity.id])
            } catch {
                call.reject("Failed to start Live Activity: \(error.localizedDescription)")
            }
        }
    }

    @available(iOS 16.2, *)
    private func observePushToken(_ activity: Activity<GenerationActivityAttributes>) {
        tokenTask?.cancel()
        tokenTask = Task { [weak self] in
            for await tokenData in activity.pushTokenUpdates {
                let token = tokenData.map { String(format: "%02x", $0) }.joined()
                self?.notifyListeners("liveActivityToken", data: ["token": token])
            }
        }
    }

    @objc func update(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve()
            return
        }

        let message = call.getString("message")
        let progress = call.getDouble("progress")
        let isMinimized = call.getBool("isMinimized")

        Task {
            for activity in Activity<GenerationActivityAttributes>.activities {
                let current = activity.content.state
                let next = GenerationActivityAttributes.ContentState(
                    message: message ?? current.message,
                    progress: progress ?? current.progress,
                    expectedDuration: current.expectedDuration,
                    startedAt: current.startedAt,
                    isMinimized: isMinimized ?? current.isMinimized
                )
                await activity.update(ActivityContent(state: next, staleDate: nil))
            }
            call.resolve()
        }
    }

    @objc func end(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve()
            return
        }
        Task {
            await self.endAll()
            call.resolve()
        }
    }

    @available(iOS 16.2, *)
    private func endAll() async {
        tokenTask?.cancel()
        tokenTask = nil
        for activity in Activity<GenerationActivityAttributes>.activities {
            await activity.end(nil, dismissalPolicy: .immediate)
        }
    }
}
