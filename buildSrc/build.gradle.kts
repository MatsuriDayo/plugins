plugins {
    `java-gradle-plugin`
    `kotlin-dsl`
}

repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
    maven(url = "https://jitpack.io")
}

dependencies {
    implementation(kotlin("gradle-plugin", "1.6.10"))

    implementation("com.android.tools.build:gradle:7.3.1")
    implementation("com.android.tools.build:gradle-api:7.3.1")
}
