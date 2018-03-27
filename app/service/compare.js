'use strict'
/**
 * compare sites, If the site is updated, get updated content，then return.
 * @constructor
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 */
const Service = require('egg').Service

class CompareService extends Service {
	async find(uid) {
		const user = await this.ctx.db.query('select * from user where uid = ?', uid)
		return user
	}
}

module.exports = CompareService
