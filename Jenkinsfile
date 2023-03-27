pipeline {

    agent {
        kubernetes {
            yamlFile 'kubernetesPod.yaml'
            defaultContainer 'builder'
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
                    env.REPO = "openanalytics/${env.ARTIFACT_ID}"
                }
            }
        }

        stage('Build Docker image') {
            steps {
                container('builder') {
                    sh "docker build -f Dockerfile . -t ${env.REPO}"
                }
            }
        }
    }
}
