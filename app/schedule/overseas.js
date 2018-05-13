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

		// // 循环任务
		// list.forEach(async (item,index) => {
		// 	// 分解获取图片
		// 	let tempData = await ctx.service.aws.upload(item)
		//
		// 	// 判断aws s3是否存储成功
		// 	if(tempData.length) {
		// 		list.images = tempData
		// 	}
		// 	ctx.app.mysql.insert('grils', list)
		// })

		async function f() {
			console.log('list[0]',list[0])
			let page = list[0]
			let tempData = await ctx.service.aws.upload(page)
			page.images = tempData.toString()
			page.original_id = page.id
			delete page.id
			console.log('tempData',tempData)
			ctx.app.mysql.insert('grils', page)
		}
		f()
	}
}
