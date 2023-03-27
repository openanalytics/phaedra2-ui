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
                    def packageJson = readJSON file: 'package.json'
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
