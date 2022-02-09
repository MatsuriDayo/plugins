import com.android.build.gradle.BaseExtension
import org.gradle.api.JavaVersion
import org.gradle.api.Project
import org.gradle.api.plugins.ExtensionAware
import org.gradle.kotlin.dsl.getByName
import org.gradle.util.GUtil.loadProperties
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmOptions

private val Project.android get() = extensions.getByName<BaseExtension>("android")
private lateinit var flavor: String

private val javaVersion = JavaVersion.VERSION_1_8

fun Project.requireFlavor(): String {
    if (::flavor.isInitialized) return flavor
    if (gradle.startParameter.taskNames.isNotEmpty()) {
        val taskName = gradle.startParameter.taskNames[0]
        when {
            taskName.contains("assemble") -> {
                flavor = taskName.substringAfter("assemble")
                return flavor
            }
            taskName.contains("install") -> {
                flavor = taskName.substringAfter("install")
                return flavor
            }
            taskName.contains("publish") -> {
                flavor = taskName.substringAfter("publish").substringBefore("Bundle")
                return flavor
            }
        }
    }

    flavor = ""
    return flavor
}

fun Project.requireLocalProperties(): java.util.Properties? {
    if (project.rootProject.file("local.properties").exists()) {
        return loadProperties(rootProject.file("local.properties"))
    }
    return null
}

fun Project.setupCommon() {
    dependencies.apply {
        add("implementation", project(":common"))
    }

    android.apply {
        compileSdkVersion(31)

        sourceSets.getByName("main") {
            jniLibs.srcDir("libs")
            assets.srcDir("html")
        }

        defaultConfig.apply {
            minSdk = 21
            targetSdk = 31
        }

        splits.abi {
            if (requireFlavor().startsWith("Fdroid")) {
                isEnable = false
            } else {
                isEnable = true
                isUniversalApk = false
            }
        }

        compileOptions {
            sourceCompatibility = javaVersion
            targetCompatibility = javaVersion
        }

        (android as ExtensionAware).extensions.getByName<KotlinJvmOptions>("kotlinOptions").apply {
            jvmTarget = javaVersion.toString()
        }

    }
}

fun Project.setupRelease() {
    val lp = requireLocalProperties()!!
    val keystorePwd = lp.getProperty("KEYSTORE_PASS") ?: System.getenv("KEYSTORE_PASS")
    val alias = lp.getProperty("ALIAS_NAME") ?: System.getenv("ALIAS_NAME")
    val pwd = lp.getProperty("ALIAS_PASS") ?: System.getenv("ALIAS_PASS")

    android.apply {
        if (keystorePwd != null) {
            signingConfigs {
                create("release") {
                    storeFile = rootProject.file("release.keystore")
                    storePassword = keystorePwd
                    keyAlias = alias
                    keyPassword = pwd
                }
            }
        }

        buildTypes {
            getByName("release") {
                proguardFiles(
                    getDefaultProguardFile("proguard-android-optimize.txt"),
                    file("proguard-rules.pro")
                )
                isMinifyEnabled = true
            }

            val key = signingConfigs.findByName("release")
            if (key != null) {
                getByName("release").signingConfig = key
            }
        }
    }
}

fun Project.setupAll() {
    setupCommon()
    setupRelease()
}