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

const { format } = require("date-and-time")

/**
 * Gets the current date as string.
 *
 * @returns {string} The current date as string.
 */
exports.getDateString = () => format(new Date(), "YYYY-MM-DD HH:mm:ss")

/**
 * Formats the message header.
 * @param {string} type Message type.
 * @returns {string} The formatted message header.
 */
exports.formatHeader = (type) => `[${type} ${this.getDateString()}]`

/**
 * Formats the message body.
 * @param {*} message Message or an array of messages.
 * @returns {string} The formatted message body.
 */
exports.formatBody = (message) =>
  Array.isArray(message) ? message.join(" | ") : message
