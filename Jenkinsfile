pipeline {
  agent any
  stages {
    stage('info') {
          steps {
            sh(script: """ whoami;pwd;ls -la """, label: "first stage  #2")
          }
    }
  }
}
