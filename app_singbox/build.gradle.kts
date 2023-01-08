plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.singbox"
        versionCode = 2
        versionName = "v1.1.2"
        splits.abi {
            reset()
            include("arm64-v8a", "x86_64")
        }
    }
}
