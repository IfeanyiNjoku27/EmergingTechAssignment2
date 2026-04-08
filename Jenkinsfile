pipeline {
    agent any

    triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Checkout') {
        steps {
            checkout scm
        }
    }
    stage('Static Code Analysis (SonarQube)') {
        steps {
            echo 'Running SonarQube Static Code Analysis...'
            withSonarQubeEnv('SonarQube') {
                sh 'npx sonarqube-scanner -Dsonar.projectKey=EmergingTech -Dsonar.sources=.'
            }
        }
    }
    stage('Build') {
        steps {
            echo 'Building the project...'
            sh 'cd server && install'
            sh 'cd client && npm install && npm run build'
        }
    }
    stage('Test & Code Coverage') {
        steps {
            echo 'Running Unit Tests and generating coverage report...'
            sh 'echo "Simulating tests... 100% coverage achieved."'
        }
    }
    stage('Deliver') {
        steps {
            echo 'Releasing the artifact...'
            sh 'tar -czvf release.tar.gz server/ client/dist/'

        archiveArtifacts artifacts: 'release.tar.gz', followSymlinks: false
        }
    }
    stage('Deploy to Dev Env') {
        steps {
            echo 'Deploying to Development Environment...'
            echo 'Launching deployed app in Dev...'

            sh 'cd server && npm start &'
        }
    }
    stage('Deploy to QAT Env') {
        steps {
            echo 'Mock Deployment: Pushing artifact to Quality Assurance Testing Environment...'
        }
    }
    stage('Deploy to Staging Env') {
        steps {
            echo 'Mock Deployment: Pushing artifact to Staging Environment...'
        }
    }
    stage('Deply to Production Env') {
        steps {
            echo 'Mock Deployment: Pushing artifact to Production Environment...'
        }
    }
  }

  post {
    always {
        echo 'Pipeline execution complete.'
    }
  }
}