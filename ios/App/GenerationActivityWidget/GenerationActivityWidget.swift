import ActivityKit
import WidgetKit
import SwiftUI

// Live Activity UI for the generation progress, reconstructed from the shipped
// GenerationActivityWidget extension (lock screen view + Dynamic Island).
struct GenerationActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: GenerationActivityAttributes.self) { context in
            GenerationLockScreenView(context: context)
                .activityBackgroundTint(Color(red: 0.07, green: 0.08, blue: 0.09))
                .activitySystemActionForegroundColor(Color.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 6) {
                        Image(systemName: "soccerball")
                        Text(context.attributes.title)
                            .font(.caption)
                            .bold()
                            .lineLimit(1)
                    }
                    .padding(.leading, 4)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    GenerationTimerText(context: context)
                        .padding(.trailing, 4)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 6) {
                        ProgressView(value: clamped(context.state.progress))
                            .tint(Color(red: 0.49, green: 0.89, blue: 0.81))
                        Text(context.state.message)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                }
            } compactLeading: {
                Image(systemName: "soccerball")
            } compactTrailing: {
                GenerationTimerText(context: context, compact: true)
            } minimal: {
                GenerationTimerText(context: context, compact: true)
            }
            .keylineTint(Color(red: 0.49, green: 0.89, blue: 0.81))
        }
    }

    private func clamped(_ progress: Double) -> Double {
        min(max(progress, 0.02), 1.0)
    }
}

struct GenerationLockScreenView: View {
    let context: ActivityViewContext<GenerationActivityAttributes>

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(context.attributes.title)
                    .font(.headline)
                    .lineLimit(1)
                Spacer()
                GenerationTimerText(context: context)
            }
            ProgressView(value: min(max(context.state.progress, 0.02), 1.0))
                .tint(Color(red: 0.49, green: 0.89, blue: 0.81))
            Text(context.state.message)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(2)
        }
        .padding()
    }
}

struct GenerationTimerText: View {
    let context: ActivityViewContext<GenerationActivityAttributes>
    var compact: Bool = false

    var body: some View {
        Text(timerInterval: Date.now...upperBound, countsDown: true)
            .font(compact ? .caption2.monospacedDigit() : .headline.monospacedDigit())
            .frame(maxWidth: compact ? 44 : 64)
    }

    private var upperBound: Date {
        let end = context.state.startedAt.addingTimeInterval(context.state.expectedDuration)
        return max(end, Date.now.addingTimeInterval(1))
    }
}
