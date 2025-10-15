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

const winston = require("winston")
const { LoggingWinston } = require("@google-cloud/logging-winston")
require("dotenv").config()

/**
 * Writes a message to Google Cloud Platform logging services.
 *
 * @param {string} header Header text.
 * @param {Array|string} message Message or messages.
 * @param {string} date Formatted date.
 * @param {string} senderName Message sender name.
 * @param {string|null} senderVersion Message sender version.
 * @returns {object} Response object.
 * @since 1.0.0
 */
exports.send = async (
  header,
  message,
  date = null,
  senderName = process?.env?.npm_package_name,
  senderVersion = null
) => {
  const level = header.toUpperCase()

  if (
    !process.env.GCP_LOG_DISABLE &&
    (level !== "INFO" || process.env.GCP_LOG_INFO == 1)
  ) {
    const loggingWinston = new LoggingWinston({
      logName: senderName.replace(/^@([^/]+)\//, "$1."),
      labels: {
        name: senderName,
        version: senderVersion,
      },
    })

    const logger = winston.createLogger({
      transports: [loggingWinston],
    })
    const meta = { message, sender: senderName }

    switch (level) {
      case "ERROR":
        logger.error(message, meta)
      case "WARN":
        logger.warn(message, meta)
      default:
        logger.info(message, meta)
    }

    return { message, date }
  }

  return null
}
