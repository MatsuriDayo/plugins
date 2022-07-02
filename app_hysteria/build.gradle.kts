plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "io.nekohasekai.sagernet.plugin.hysteria"
        versionCode = 1
        versionName = "v1.0.5-1"
    }
}
