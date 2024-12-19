pipeline {
  agent none
  environment {
    appUser = "trello"
    folderDeploy = "/deploys/${appUser}"
  }
  stages {
    stage('build-and-push') {
      agent { label 'my-lap'}
      steps {
        dir('./server') {
          withCredentials([file(credentialsId: 'trello-server-env', variable: 'TRELLO_SERVER_ENV')]) {
            bat(script: """copy ${TRELLO_SERVER_ENV} .env""", label: "copy .env file")
          }
        }
        bat(script: """docker-compose build""", label: "build images")
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          bat(script: """ docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD """, label: "login to dockerhub")
          bat(script: """ docker-compose push """, label: "push images to hub")
         }
      }
    }
    stage('deploy') {
      agent { label 'aws-server' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh(script: """ sudo cp ./docker-compose.yml ${folderDeploy} """, label: "copy run script to deploy folder")
          withCredentials([file(credentialsId: 'trello-server-env', variable: 'TRELLO_SERVER_ENV')]) {
             sh(script: """sudo cp ${TRELLO_SERVER_ENV} ${folderDeploy}/server""", label: "copy .env file")
          }
          sh(script: """ sudo chown -R ${appUser}. ${folderDeploy} """, label: "grant owner")
          sh(script: 'sudo su ${appUser} bash -c "cd ${folderDeploy} && docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD && sudo docker-compose pull && sudo docker-compose down && sudo docker-compose up -d"', label: "run project container")
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