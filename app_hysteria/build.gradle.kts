plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.exe.hysteria"
        versionCode = 3
        versionName = "1.2.2-1"
    }
}
