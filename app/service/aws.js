'use strict'
/**
 * aws s3 storage picture service.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */

const Service = require('egg').Service
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const request = require('request')
const uuidv1 = require('uuid/v1')

class AwsService extends Service {

	async upload(page) {
		const images = page.images.split(',')
		if (!images.length) return
		images.forEach(item => {
			let options = {
				url: item,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
				},
				encoding: null
			}

			request(options, (error, response, body) => {
				if (response.statusCode !== 200) return

				// check if it is image
				let type = response.headers['content-type']
				if (!type.includes('image')) return
				// let imageType = type.split('/')[1]
				// let name = `${uuidv1()}.${imageType}`

				// upload
				const params = {Bucket: 'grils', Key: uuidv1(), Body: body, ContentType: type}
				s3.upload(params, (err, data) => console.log('data', data))
			})
		})

	}
}

module.exports = AwsService
