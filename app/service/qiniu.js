'use strict'
/**
 * qiniu storage picture service.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */

const Service = require('egg').Service
const qiniu = require('qiniu')
const request = require('request')

class QiniuService extends Service {
	constructor(ctx) {
		super(ctx)
		this.mac = new qiniu.auth.digest.Mac(...this.config.qiniu.auth)
		this.putPolicy = new qiniu.rs.PutPolicy(this.config.qiniu.options)

		// set formUploader
		let config = new qiniu.conf.Config()
		config.zone = this.config.qiniu.zone
		this.formUploader = new qiniu.form_up.FormUploader(config)
		this.putExtra = new qiniu.form_up.PutExtra()

		// upload token
		this.uploadToken = ''
	}

	// 获取上传的token
	getToken() {
		return this.putPolicy.uploadToken(this.mac)
	}

	async upload(page) {
		const images = page.images.split(',')

		images.forEach(item => {
			let options = {
				url: item,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
				}
			};
			request(options)
				.on('response', response => {
					if (response.statusCode !== 200) return
					let tempData = item.split('/')
					let key = tempData[tempData.length - 1].split('.')[0]
					console.log('key',item)
					console.log(response.statusCode) // 200
					console.log('content-type',response.headers['content-type']) // 'image/png'
					// try {
					// 	this.formUploader.putStream(this.uploadToken, key, response, this.putExtra,
					// 		(respErr, respBody, respInfo) => {
					// 			if (respErr) {
					// 				console.log('item', item)
					// 				console.log('respErr', respErr)
					// 			}
					// 			if (respInfo.statusCode == 200) {
					// 				console.log(respBody)
					// 			} else {
					// 				console.log(respInfo.statusCode)
					// 				console.log(respBody)
					// 			}
					// 		})
					// } catch (e) {
					// 	console.log('e', e)
					// }
				})
			// let readableStream = request.get(item)
			// 	.on('error', err => console.log(err))
			// let tempData = item.split('/')
			// let key = tempData[tempData.length - 1].split('.')[0]
			// try {
			// 	this.formUploader.putStream(this.uploadToken, key, readableStream, this.putExtra,
			// 		(respErr, respBody, respInfo) => {
			// 			if (respErr) {
			// 				console.log('item', item)
			// 				console.log('respErr', respErr)
			// 			}
			// 			if (respInfo.statusCode == 200) {
			// 				console.log(respBody)
			// 			} else {
			// 				console.log(respInfo.statusCode)
			// 				console.log(respBody)
			// 			}
			// 		})
			// } catch (e) {
			// 	console.log('e', e)
			// }
		})

	}
}

module.exports = QiniuService
