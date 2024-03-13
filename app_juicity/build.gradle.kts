plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.juicity"
        versionCode = 2
        versionName = "v0.4.0"
        splits.abi {
            reset()
            include("arm64-v8a")
        }
    }
}
