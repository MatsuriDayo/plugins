plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.singbox"
        versionCode = 5
        versionName = "v1.2-beta10"
        splits.abi {
            reset()
            include("arm64-v8a", "x86_64")
        }
    }
}
