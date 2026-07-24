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

const { formatHeader, formatBody, getDateString } = require("./format")
const smtp = require("../connectors/smtp")
const logLevel = require("../log/log-level")

/**
 * Sends the given message as information.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.info = (message) => exports.send(message, logLevel.INFO)

/**
 * Sends the given message as error.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.error = (message) => exports.send(message, logLevel.ERROR)

/**
 * Sends the given message as warning.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.warn = (message) => exports.send(message, logLevel.WARN)

/**
 * Sends the given message as success.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.success = (message) => exports.send(message, logLevel.SUCCCESS)

/**
 * Sends the given message
 *
 * @param {string} message Message text.
 * @param {string} level Message level.
 * @param {string} senderName Message sender name.
 * @param {string} senderVersion Message sender version.
 * @returns {string} Message text.
 */
exports.send = (
  message,
  level = logLevel.INFO,
  senderName = process?.env?.npm_package_name,
  senderVersion = process?.env?.npm_package_version
) => {
  const date = getDateString()

  smtp
    .send(level, message, date, senderName, senderVersion)
    .catch(({ data: { error } }) =>
      console.error(
        formatHeader(logLevel.ERROR, date, senderName, senderVersion),
        formatBody(["SMTP", error])
      )
    )

  return message
}
