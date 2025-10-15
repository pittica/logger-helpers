// Copyright 2024 Pittica S.r.l.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { WebClient } = require("@slack/web-api")
const { formatHeader } = require("../helpers/format")
require("dotenv").config()

/**
 * Writes a message to Slack.
 *
 * @param {string} header Header text.
 * @param {Array|string} message Message or messages.
 * @param {string} date Formatted date.
 * @param {string} senderName Message sender name.
 * @param {string|null} senderVersion Message sender version.
 * @returns {object} Response object.
 */
exports.send = async (
  header,
  message,
  date = null,
  senderName = process?.env?.npm_package_name,
  senderVersion = null
) => {
  if (
    process.env.SLACK_TOKEN &&
    (header.toUpperCase() !== "INFO" || process.env.SLACK_LOG_INFO == 1)
  ) {
    const client = new WebClient(process.env.SLACK_TOKEN)
    const fields = []
    const messages = Array.isArray(message) ? message : [message]

    messages.forEach((text) =>
      fields.push({
        type: "plain_text",
        emoji: true,
        text: text ? text.toString() : senderName,
      })
    )

    return await client.chat.postMessage({
      text: message,
      channel: process.env.SLACK_CHANNEL_ID,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: senderName
              ? senderVersion
                ? `${senderName} ${senderVersion}`
                : senderName
              : header,
          },
        },
        {
          type: "section",
          text: {
            text: formatHeader(header, date),
            type: "plain_text",
          },
          fields,
        },
      ],
    })
  }

  return null
}
