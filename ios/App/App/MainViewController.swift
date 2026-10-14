import UIKit
import Capacitor

// Subclass of CAPBridgeViewController that registers app-local plugins.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(GenerationProgressPlugin())
    }
}
