plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.xray"
        versionCode = 2
        versionName = "v1.5.3-2"
    }
}
