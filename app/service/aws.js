'use strict'
/**
 * aws s3 storage picture service.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */

const Service = require('egg').Service
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const request = require('request-promise-native')
const uuidv1 = require('uuid/v1')
const Q = require('q')

class AwsService extends Service {

	async upload(page) {
		const images = page.images.split(',')
		if (!images.length) return

		// get ContentType
		let typeArray = images[0].split('.')
		let ContentType = `image/${typeArray[typeArray.length - 1]}`

		// set promise arrary
		let awsImages = []
		let promiseAll = []
		let requestAll = []
		images.forEach(item => {
			if(!item) return
			let options = {
				url: item,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
				},
				encoding: null
			}
			requestAll.push(request(options))
		})

		// get all request data
		let reqAllData = await Q.allSettled(requestAll)
		reqAllData.forEach((result, index) => {
			if (result.state === 'fulfilled') {
				const params = {Bucket: 'grils', Key: uuidv1(), Body: result.value, ContentType}
				let uploadS3 = s3.upload(params).promise()
				uploadS3.then(data => awsImages.push(data.Location))
					.then(null, () => awsImages.push(images[index]))
				promiseAll.push(uploadS3)
			} else {
				awsImages.push(images[index])
			}
		})

		return Q.allSettled(promiseAll).then(() => awsImages)
	}
}

module.exports = AwsService
