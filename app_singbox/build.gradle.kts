plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.singbox"
        versionCode = 1
        versionName = "v1.1-rc1"
        splits.abi {
            reset()
            include("arm64-v8a", "x86_64")
        }
    }
}
