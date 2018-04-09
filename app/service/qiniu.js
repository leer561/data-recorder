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
		try{
			images.forEach(item => {
				let readableStream = request(item)
				let tempData = item.split('/')
				let key = tempData[tempData.length - 1].split('.')[0]
				// this.formUploader.putStream(this.uploadToken, key, readableStream, this.putExtra,
				// 	(respErr, respBody, respInfo) => {
				// 		if (respErr) {
				// 			console.log('item',item)
				// 			console.log('respErr',respErr)
				// 		}
				// 		if (respInfo.statusCode == 200) {
				// 			console.log(respBody)
				// 		} else {
				// 			console.log(respInfo.statusCode)
				// 			console.log(respBody)
				// 		}
				// 	})
			})
		}catch (err){
			// console.log('page',images)
			// console.log('err',err)
		}

	}
}

module.exports = QiniuService
