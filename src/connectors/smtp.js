// Copyright 2024-2026 Pittica S.r.l.
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

const nodemailer = require("nodemailer")
const { formatHeader } = require("../helpers/format")
require("dotenv").config()

/**
 * Tests the SMTP client and settings
 *
 * @param {Transport} transporter A Transport object.
 * @returns {boolean} A value indicating whether the clients and settings are correct.
 */
exports.test = async (transporter) => {
  try {
    await transporter.verify()

    return true
  } catch {
    return false
  }
}

/**
 * Gets a Transport object.
 *
 * @returns {Transport} A Transport object.
 * @since 1.1.0
 */
exports.getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE == 1,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  })

/**
 * Sends a message using SMTP.
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
    process.env.SMTP_LOG_ENABLE == 1 &&
    (header.toUpperCase() !== "INFO" || process.env.SMTP_LOG_INFO == 1)
  ) {
    const transporter = exports.getTransporter()

    if (exports.test(transporter)) {
      const fields = []
      const messages = Array.isArray(message) ? message : [message]

      messages.forEach((text) =>
        fields.push(text ? text.toString() : senderName)
      )

      try {
        return await transporter.sendMail({
          from: `"${senderName}" <${process.env.SMTP_SENDER}>`,
          to: process.env.SMTP_RECIPIENTS.split(/[,;\s]/)
            .map((element) => element.trim())
            .join(", "),
          subject: formatHeader(header, date),
          text: fields.join("\n"),
          html:
            fields.length > 1
              ? `<ul>${fields.map((field) => `<li>${field}</li>`)}</ul>`
              : `<p>${fields.join("\n<br/>")}</p>`,
        })
      } catch (err) {
        console.error(err)

        return null
      }
    }
  }

  return null
}
