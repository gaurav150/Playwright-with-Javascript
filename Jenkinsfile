// Jenkins declarative pipeline for Playwright.
// Requires: Pipeline, Docker (for agent below), JUnit, and optionally HTML Publisher plugins.
//
// Without Docker: change `agent` to `any`, add tools { nodejs 'Node20' } (configure in Jenkins).

pipeline {
  agent {
    docker {
      // Match your @playwright/test version: https://playwright.dev/docs/docker
      image 'mcr.microsoft.com/playwright:v1.59.1-jammy'
    }
  }

  environment {
    CI = 'true'
  }

  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps chromium'
      }
    }

    stage('Run Playwright tests') {
      steps {
        sh 'npm run test:ci'
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
      archiveArtifacts allowEmptyArchive: true, artifacts: 'playwright-report/**/*'
    }
  }
}
