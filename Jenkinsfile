pipeline {
  agent none
  environment {
    DOCKER_REGISTRY = 'nhphuc414/trello-app'
    TRELLO_CLIENT_IMAGE = "${DOCKER_REGISTRY}:trello-client-latest"
    TRELLO_SERVER_IMAGE = "${DOCKER_REGISTRY}:trello-server-latest"
    appUser = "trello"
    folderDeploy = "/deploys/${appUser}"
    copyScript = "sudo cp ./docker-compose.yml ${folderDeploy}"
    permsScript = "sudo chown -R ${appUser}. ${folderDeploy}"
  }
  stages {
    stage('build') {
      agent { label 'my-lap'}
      steps {
        dir('./server') {
          withCredentials([file(credentialsId: 'trello-server-env', variable: 'TRELLO_SERVER_ENV')]) {
            bat(script: """copy ${TRELLO_SERVER_ENV} .env""", label: "create .env file")
          }
          bat(script: """ docker build --env-file .env -t ${TRELLO_SERVER_IMAGE} . """, label: "build server image")
        }
        dir('./client') {
          bat(script: """ docker build -t ${TRELLO_CLIENT_IMAGE} . """, label: "build client image")
        }
      }
    }
    stage('push') {
      agent { label 'my-lap' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          bat(script: """ docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD """, label: "login to dockerhub")
          bat(script: """ docker push ${TRELLO_CLIENT_IMAGE} """, label: "push client image to hub")
          bat(script: """ docker push ${TRELLO_SERVER_IMAGE} """, label: "push server image to hub")
        }
      }
    }
    stage('deploy') {
      agent { label 'aws-server' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh(script: """ ${copyScript} """, label: "copy run script to deploy folder")
          sh(script: """ ${permsScript} """, label: "grant pemission")
          sh(script: """ sudo docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD """, label: "login to dockerhub")
          sh(script: """ sudo docker pull ${TRELLO_CLIENT_IMAGE} """, label: "pull client image to hub")
          sh(script: """ sudo docker pull ${TRELLO_SERVER_IMAGE} """, label: "pull server image to hub")
          sh(script: ' sudo su ${appUser} bash -c "cd ${folderDeploy} && sudo docker-compose down && sudo docker-compose up -d"', label: "run project container")
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
