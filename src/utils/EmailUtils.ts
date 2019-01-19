import { Linking } from "expo"

export const openFeedbackEmail = () => {
  const receiver = "ivanschuetz@gmail.com"
  const subject = "Feedback"
  const body = ""
  openEmail(receiver, subject, body)
}

export const openEmail = (receiver: string, subject: string, body: string) => {
  const link = `mailto:${receiver}?subject=${subject}&body=${body}`

  Linking.canOpenURL(link)
    .then(supported => {
      if (supported) {
        Linking.openURL(link)
      } else {
        console.log("Can't open email");
      }
    })
    .catch(err => console.error("Error opening email: ", err))
}
