import Foundation
import ActivityKit

// Shared Live Activity attributes. Also compiled into the widget extension target
// (GenerationActivityWidget), so it must not import Capacitor or other app-only modules.
@available(iOS 16.2, *)
public struct GenerationActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var message: String
        public var progress: Double
        public var expectedDuration: Double
        public var startedAt: Date
        public var isMinimized: Bool

        public init(message: String, progress: Double, expectedDuration: Double, startedAt: Date, isMinimized: Bool) {
            self.message = message
            self.progress = progress
            self.expectedDuration = expectedDuration
            self.startedAt = startedAt
            self.isMinimized = isMinimized
        }
    }

    public var generationType: String
    public var title: String

    public init(generationType: String, title: String) {
        self.generationType = generationType
        self.title = title
    }
}
