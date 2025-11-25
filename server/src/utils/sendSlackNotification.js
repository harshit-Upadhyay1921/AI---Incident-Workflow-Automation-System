import axios from "axios";

export const sendSlackNotification = async (message) => {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("⚠️ Slack webhook URL not configured in .env");
      return;
    }

    await axios.post(webhookUrl, {
      text: message,
    });
  } catch (error) {
    console.error("Failed to send Slack notification:", error.message);
  }
};

//date of writin this comment is 8th nov,2025
// gpt told that we have placed placeholder for multi user notification but i removed that when gpt gave me sendSlackNotification i replaced that placeholder with this one. so if in future i will be implementing this then remember that gpt thinks that i have that placeholder placed at this place but now you know what is the case so harshit act accordingly.


//note: this current method sendSlackNotification sends all the notification to one channel only