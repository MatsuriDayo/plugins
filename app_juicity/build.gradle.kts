plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.juicity"
        versionCode = 1
        versionName = "test-3"
        splits.abi {
            reset()
            include("arm64-v8a", "x86_64")
        }
    }
}
