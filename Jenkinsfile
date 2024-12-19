pipeline {
  agent none
  environment {
    DOCKER_REGISTRY = 'nhphuc414/trello-app'
    TRELLO_CLIENT_IMAGE = "${DOCKER_REGISTRY}:trello-client-latest"
    TRELLO_SERVER_IMAGE = "${DOCKER_REGISTRY}:trello-server-latest"
    appUser = "trello"
    folderDeploy = "/deploy/${appUser}"
    copyScript = "sudo cp ./docker-compose.yml ${folderDeploy}"
    permsScript = "sudo chown -R ${appUser}. ${folderDeploy}"
    killScript = 'sudo bash -c "cd ${folderDeploy} && sudo docker-compose down"'
    runScript = ''
  }
  stages {
    stage('deploy') {
      agent { label 'aws-server' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh(script: """ ${copyScript} """, label: "copy run script to deploy folder")
          sh(script: """ sudo docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD """, label: "login to dockerhub")
          sh(script: """ sudo docker pull ${TRELLO_CLIENT_IMAGE} """, label: "pull client image to server")
          sh(script: """ sudo docker pull ${TRELLO_SERVER_IMAGE} """, label: "pull server image to server")
          sh(script: """ ${killScript} """, label: "terminate the running project container")
          sh(script: ' sudo -u ${appUser} -i bash -c "cd ${folderDeploy} && sudo docker-compose up -d"', label: "run project container")
        }
      }
    }
  }
  post {
        success {
            echo "Deployment succeeded!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
