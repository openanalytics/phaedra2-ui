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

        stage('Build') {
            steps {
                container('builder') {
                    sh "npm run build"
                }
            }
        }

        stage('Build Docker image') {
            steps {
                dir('server') {
                    container('builder') {
                        sh "docker build -f Dockerfile . -t ${env.REPO}"
                    }
                }
            }
        }
    }
}
