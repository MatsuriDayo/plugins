import com.android.build.gradle.BaseExtension
import com.android.build.gradle.internal.api.BaseVariantOutputImpl
import org.gradle.api.JavaVersion
import org.gradle.api.Project
import org.gradle.api.plugins.ExtensionAware
import org.gradle.kotlin.dsl.getByName
import org.gradle.util.GUtil.loadProperties
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmOptions
import com.android.build.gradle.AbstractAppExtension
import java.io.File
import java.security.MessageDigest

private val Project.android get() = extensions.getByName<BaseExtension>("android")
private lateinit var flavor: String

private val javaVersion = JavaVersion.VERSION_1_8

fun sha256(bytes: ByteArray): String {
    val md = MessageDigest.getInstance("SHA-256")
    val digest = md.digest(bytes)
    return digest.fold("") { str, it -> str + "%02x".format(it) }
}

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

        (this as? AbstractAppExtension)?.apply {
            applicationVariants.all {
                outputs.all {
                    this as BaseVariantOutputImpl
                    outputFileName =
                        outputFileName.replace(project.name, "${project.name}-plugin-$versionName")
                            .replace("-release", "")
                            .replace("-oss", "")
                            .replace("app_", "")
                }
            }

            val calculateTaskName = "calculate${requireFlavor()}APKsSHA256"
            tasks.register(calculateTaskName) {
                val githubEnv = File(System.getenv("GITHUB_ENV") ?: "this-file-does-not-exist")

                doLast {
                    applicationVariants.all {
                        if (name.equals(requireFlavor(), ignoreCase = true)) outputs.all {
                            if (outputFile.isFile) {
                                val sha256 = sha256(outputFile.readBytes())
                                val sum = File(
                                    outputFile.parentFile,
                                    outputFile.nameWithoutExtension + ".sha256sum.txt"
                                )
                                sum.writeText(sha256)
                                if (githubEnv.isFile) when {
                                    outputFile.name.contains("-arm64") -> {
                                        githubEnv.appendText("SUM_ARM64=${sum.absolutePath}\n")
                                        githubEnv.appendText("SHA256_ARM64=$sha256\n")
                                    }
                                    outputFile.name.contains("-armeabi") -> {
                                        githubEnv.appendText("SUM_ARM=${sum.absolutePath}\n")
                                        githubEnv.appendText("SHA256_ARM=$sha256\n")
                                    }
                                    outputFile.name.contains("-x86_64") -> {
                                        githubEnv.appendText("SUM_X64=${sum.absolutePath}\n")
                                        githubEnv.appendText("SHA256_X64=$sha256\n")
                                    }
                                    outputFile.name.contains("-x86") -> {
                                        githubEnv.appendText("SUM_X86=${sum.absolutePath}\n")
                                        githubEnv.appendText("SHA256_X86=$sha256\n")
                                    }
                                }
                            }
                        }
                    }
                }
                dependsOn("package${requireFlavor()}")
            }
            val assemble = "assemble${requireFlavor()}"
            tasks.whenTaskAdded {
                if (name == assemble) dependsOn(calculateTaskName)
            }
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