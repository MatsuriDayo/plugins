plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.exe.tuic"
        versionCode = 1
        versionName = "0.8.5-2"
        splits.abi {
            reset()
            include("arm64-v8a", "x86_64")
        }
    }
}
