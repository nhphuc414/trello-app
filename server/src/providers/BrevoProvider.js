const brevo = require('@getbrevo/brevo')
const { env } = require('~/config/environment')

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  let sendSmtpMail = new brevo.SendSmtpEmail()
  sendSmtpMail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  sendSmtpMail.to = [{ email: recipientEmail }]
  sendSmtpMail.subject = customSubject
  sendSmtpMail.htmlContent = htmlContent

  return apiInstance.sendTransacEmail(sendSmtpMail)
}

export const BrevoProvider = {
  sendEmail
}
