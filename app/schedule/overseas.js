'use strict'
/**
 * check the sites,then update data
 **/
module.exports = {
	schedule: {
		interval: '1d', // 分钟间隔
		type: 'all', // 指定所有的 worker 都需要执行
		immediate: true //立即启动
	},
	async task(ctx) {
		const list = await ctx.service.abroad.find()

		// 判断是否有任务
		if (!list || !list.length) return

		// 获取token
		ctx.service.qiniu.uploadToken = ctx.service.qiniu.getToken()

		// 循环任务
		list.forEach(item => {
			// 分解获取图片
			ctx.service.qiniu.upload(item)

		})
	}
}
