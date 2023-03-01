plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.singbox"
        versionCode = 4
        versionName = "v1.2-beta5-2"
        splits.abi {
            reset()
            include("arm64-v8a", "x86_64")
        }
    }
}
