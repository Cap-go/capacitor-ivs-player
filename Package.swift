// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoIvsPlayer",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapgoIvsPlayer",
            targets: ["CapacitorIvsPlayerPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "CapacitorIvsPlayerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                "AmazonIVSPlayer"
            ],
            path: "ios/Sources/CapacitorIvsPlayerPlugin"),
        .binaryTarget(
            name: "AmazonIVSPlayer",
            url: "https://player.live-video.net/1.46.0/AmazonIVSPlayer.xcframework.zip",
            checksum: "3d7819ce7e04ca37dc6720807e2dd091c411a61b620b6bcc72b2263c929c0165"
        ),
        .testTarget(
            name: "CapacitorIvsPlayerPluginTests",
            dependencies: ["CapacitorIvsPlayerPlugin"],
            path: "ios/Tests/CapacitorIvsPlayerPluginTests")
    ]
)
