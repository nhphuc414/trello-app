pipeline {
  agent none
  environment {
    DOCKER_REGISTRY = 'nhphuc414/trello-app'
    TRELLO_CLIENT_IMAGE = "${DOCKER_REGISTRY}/trello-client:latest"
    TRELLO_SERVER_IMAGE = "${DOCKER_REGISTRY}/trello-server:latest"
    appUser = "trello"
    folderDeploy = "/deploy/${appUser}"
    copyScript = "sudo cp ./docker-compose.yml ${folderDeploy}"
    permsScript = "sudo chown -R ${appUser}. ${folderDeploy}"
    killScript = 'sudo -c "cd ${folderDeploy};docker-compose down || true"'
    runScript = 'sudo su ${appUser} -c "cd ${folderDeploy};docker-compose up -d"'
  }
  stages {
    stage('build') {
      agent { label 'my-lap'}
      steps {
        dir('./server') {
          withCredentials([file(credentialsId: 'trello-server-env', variable: 'TRELLO_SERVER_ENV')]) {
            sh(script: "cp ${TRELLO_SERVER_ENV} ./server/.env", label: "file .env")
          }
          sh(script: """ sudo docker build -t ${TRELLO_SERVER_IMAGE} . """, label: "build server image")
        }
        dir('./client') {
          sh(script: """ sudo docker build -t ${TRELLO_CLIENT_IMAGE} . """, label: "build client image")
        }
      }
    }
    stage('push') {
      agent { label 'my-lap' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh(script: """ sudo docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD """, label: "login to dockerhub")
          sh(script: """ sudo docker push ${TRELLO_CLIENT_IMAGE} """, label: "push client image to hub")
          sh(script: """ sudo docker push ${TRELLO_SERVER_IMAGE} """, label: "push server image to hub")
        }
      }
    }
    stage('deploy') {
      agent { label 'aws-server' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh(script: """ sudo docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD """, label: "login to dockerhub")
          sh(script: """ ${killScript} """, label: "terminate the running project container")
          sh(script: """ ${copyScript} """, label: "copy run script to deploy folder")
          sh(script: """ ${runScript} """, label: "run project container")
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