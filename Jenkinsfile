pipeline {

    agent {
        kubernetes {
            yamlFile 'kubernetesPod.yaml'
            defaultContainer 'kaniko'
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }

    stages {
        stage('Prepare environment') {
            steps {
                script {
                    def packageJson = readJSON(text: readFile("./package.json").trim())
                    env.ARTIFACT_ID = packageJson.name
                    env.VERSION = packageJson.version
                    env.REGISTRY = "registry.openanalytics.eu"
                    env.REPO = "openanalytics/${env.ARTIFACT_ID}"
                    def versionMatch = (env.VERSION =~ /\d+\.\d+\.\d+(.*)/)
                    env.REPO_SUFFIX = (versionMatch.matches() ? versionMatch.group(1) : "").toLowerCase()
                    env.TAG = "${env.VERSION}"
                }
            }
        }

        stage('Build Docker image') {
            steps {
                container('kaniko'){
                    sh """
                    /kaniko/executor \
                            -v info \
                            --context ${env.WORKSPACE} \
                            --cache=true \
                            --cache-repo ${env.REGISTRY}/${env.REPO} \
                            --destination ${env.REGISTRY}/${env.REPO}${env.REPO_SUFFIX}:${env.TAG}
                    """
                }
            }
        }
    }
}
