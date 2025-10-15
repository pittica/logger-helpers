// Copyright 2024-2025 Pittica S.r.l.
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
const slack = require("../connectors/slack")
const googleCloudLogging = require("../connectors/google-cloud-logging")

/**
 * Sends the given message as information.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.info = (message) => this.send(message, "Info", console.info)

/**
 * Sends the given message as error.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.error = (message) => this.send(message, "Error", console.error)

/**
 * Sends the given message as warning.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.warn = (message) => this.send(message, "Warn", console.warn)

/**
 * Sends the given message as success.
 *
 * @param {string} message Message text.
 * @returns {string} Message text.
 */
exports.success = (message) => this.send(message, "Success")

/**
 * Sends the given message
 *
 * @param {string} message Message text.
 * @param {string} level Message level.
 * @param {function} func Log function.
 * @param {string} senderName Message sender name.
 * @param {string} senderVersion Message sender version.
 * @returns {string} Message text.
 */
exports.send = (
  message,
  level = "Info",
  func = console.log,
  senderName = process?.env?.npm_package_name,
  senderVersion = process?.env?.npm_package_version
) => {
  const date = getDateString()

  func(
    formatHeader(level, date, senderName, senderVersion),
    formatBody(message)
  )

  slack.send(level, message, date, senderName, senderVersion)
  googleCloudLogging.send(level, message, date, senderName, senderVersion)

  return message
}
