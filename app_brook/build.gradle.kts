plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.brook"
        versionCode = 1
        versionName = "v20220406-1"
    }
}
