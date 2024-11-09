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

const { formatHeader, formatBody } = require("./format")
const slack = require("../connectors/slack")

/**
 * Sends the given message as information.
 *
 * @param {string} message Message text.
 *
 * @returns {string} Message text.
 */
exports.info = (message) => this.send(message, "Info", console.info)

/**
 * Sends the given message as error.
 *
 * @param {string} message Message text.
 *
 * @returns {string} Message text.
 */
exports.error = (message) => this.send(message, "Error", console.error)

/**
 * Sends the given message as success.
 *
 * @param {string} message Message text.
 *
 * @returns {string} Message text.
 */
exports.success = (message) => this.send(message, "Success")

/**
 * Sends the given message
 *
 * @param {string} message Message text.
 * @param {string} header Header text.
 * @param {function} func Log function.
 *
 * @returns {string} Message text.
 */
exports.send = (message, header = "Info", func = console.log) => {
  func(formatHeader(header), formatBody(message))

  slack.send(header, message)

  return message
}
