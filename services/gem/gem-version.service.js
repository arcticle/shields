'use strict'

const Joi = require('joi')

const { BaseJsonService } = require('../base')
const { addv: versionText } = require('../../lib/text-formatters')
const { version: versionColor } = require('../../lib/color-formatters')

// Response should contain a string key 'version'
// In most cases this will be a SemVer
// but the registry doesn't actually enforce this
const versionSchema = Joi.object({
  version: Joi.string().required(),
}).required()

module.exports = class GemVersion extends BaseJsonService {
  async handle({ repo }) {
    const url = `https://rubygems.org/api/v1/gems/${repo}.json`
    const { version } = await this._requestJson({
      url,
      schema: versionSchema,
    })
    return {
      message: versionText(version),
      color: versionColor(version),
    }
  }

  // Metadata
  static get defaultBadgeData() {
    return { label: 'gem' }
  }

  static get category() {
    return 'version'
  }

  static get url() {
    return {
      base: 'gem/v',
      format: '(.+)',
      capture: ['repo'],
    }
  }

  static get examples() {
    return [
      {
        title: 'Gem',
        previewUrl: 'formatador',
        keywords: ['ruby'],
      },
    ]
  }
}
