<template>
	<div class="schedule-page">
		<el-row :gutter="10">
			<el-col :span="5">
				<div class="card-box">
					<el-table :data="courseList">
						<el-table-column prop="name" label="课程名"></el-table-column>
						<el-table-column prop="status" label="排课状态"></el-table-column>
					</el-table>
				</div>
			</el-col>
			<el-col :span="14">
				<div class="main-card">


					<!-- <el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="date" label="Date" width="180" />
					<el-table-column prop="name" label="Name" width="180" />
					<el-table-column prop="address" label="Address" />
				</el-table> -->

					<el-table :data="tableData" border style="width: 100%" row-key="key" @rowDrop="rowDrop">
						<el-table-column prop="count" label="节次">
							<template v-slot="scope">
								<div class="table-item">{{ scope.row.count }}</div>
							</template>
						</el-table-column>
						<el-table-column v-for="(item,index) in headList" :key="index" :prop="item.name"
							:label="item.name">
							<template v-slot="scope">
								<!-- <div @click="handleClick(scope.row,index)" class="table-item" :class="getTableItemClass(scope.row,index)" draggable @dragstart="handleDragStart($event, scope.row,index)"
									@dragover="handleDragOver($event)" @drop="handleDrop($event, scope.row,index)">
									{{ scope.row[item.prop] }}
								</div> -->
								<div class="table-item" :class="getTableItemClass(scope.row,index)">
									{{ scope.row[item.prop] }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!-- <el-table :data="dataList">
					<el-table-column prop="name" label="课程名"></el-table-column>
					<el-table-column prop="status" label="排课状态"></el-table-column>
				</el-table> -->
			</el-col>
			<el-col :span="5">
				<div class="card-box">
					<div class="tab-list">
						<div class="tab-item active">课程属性</div>
						<div class="tab-item">课程安排</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
	import Sortable from "sortablejs";
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	export default defineComponent({
		setup() {
			const state = reactive({
				courseList: [{
					name:"课程名称100"
				}],
				dataList: [],
				headList: [{
					name: "星期一",
					prop: "1"
				}, {
					name: "星期二",
					prop: "2"
				}, {
					name: "星期三",
					prop: "3"
				}, {
					name: "星期四",
					prop: "4"
				}, {
					name: "星期五",
					prop: "5"
				}, {
					name: "星期六",
					prop: "6"
				}, {
					name: "星期日",
					prop: "7"
				}] as IObject[],
				tableData: [] as IObject[],
				draggingRowIndex: 0,
				draggingColIndex: 0,
				selectRowColIndex: ''

			});
			return { ...toRefs(state) };
		},
		activated() {
			this.init();
		},
		methods: {
			init() {
				for (let i = 0; i < 11; i++) {
					let obj = {} as IObject;
					obj['count'] = `第${i + 1}节`;
					obj['key'] = i + 1;
					for (let j = 0; j < this.headList.length; j++) {
						let prop = this.headList[j].prop;
						obj[prop] = "课程名称" + (i + '' + j);
					}
					this.tableData.push(obj);
				}
			},
			// 开始拖拽
			handleDragStart(event : any, row : IObject, index : number) {
				console.log('开始拖拽---event', event)
				console.log('开始拖拽---row', row)
				console.log('开始拖拽---index', index)
				// 第几行0开始
				this.draggingRowIndex = this.tableData.indexOf(row);
				// index 第几列 0 星期几 index+1
				this.draggingColIndex = index;
				console.log('draggingRowIndex', this.draggingRowIndex);
			},
			// 拖拽中
			handleDragOver(event : any) {
				// console.log('拖拽中---event', event)
				event.preventDefault()
			},
			// 拖拽结束
			handleDrop(event : any, row : IObject, index : number) {
				// console.log('拖拽结束---event', event)
				// console.log('拖拽结束---row', row)
				// console.log('拖拽结束---index', index)
				// 拖拽到第几行
				const droppingRowIndex = this.tableData.indexOf(row);
				// 拖拽到星期几 index + 1;
				// console.log('droppingRowIndex',droppingRowIndex)
				let oldProp = (this.draggingColIndex + 1).toString();
				let newProp = (index + 1).toString();
				let draggingRow = this.deepClone(this.tableData[this.draggingRowIndex]);

				this.tableData[this.draggingRowIndex][oldProp] = row[newProp];
				this.tableData[droppingRowIndex][newProp] = draggingRow[oldProp];
			},
			//  @mousedown="handleMousedown"
			// handleMousedown(event:any){
			// 	event.preventDefault()
			// },
			// 点击
			handleClick(row : IObject, index : number) {
				const clickRowIndex = this.tableData.indexOf(row);
				this.selectRowColIndex = clickRowIndex + '-' + index;
			},
			// 单元格样式
			getTableItemClass(row : IObject, index : number) {
				let className = "";
				const rowIndex = this.tableData.indexOf(row);
				if (this.selectRowColIndex && this.selectRowColIndex == (rowIndex + '-' + index)) {
					className = "active";
				}

				return className;
			},
			// 表格行拖拽
			rowDrop() {
				let tbody = document.querySelector(".el-table__body-wrapper tbody");
				console.log('tbody',tbody);
				console.log('Sortable',Sortable);
				Sortable.create(tbody, {
					group: { // 相同的组之间可以相互拖拽
						name: "table",
						pull: true,
						put: true,
					},
					animation: 150, // ms, number 单位：ms，定义排序动画的时间
					onAdd: function (e : any) {
						// 拖拽时候添加有新的节点的时候发生该事件
						console.log("onAdd.foo:", e);
					},
					onUpdate: function (e : any) {
						// 拖拽更新节点位置发生该事件
						console.log("onUpdate.foo:", e);
					},
					onRemove: function (e : any) {
						// 删除拖拽节点的时候促发该事件
						console.log("onRemove.foo:", e);
					},
					onStart: function (e : any) {
						// 开始拖拽出发该函数
						console.log("onStart.foo:", e);
					},
					onSort: function (e : any) {
						// 发生排序发生该事件
						console.log("onUpdate.foo:", e);
					},
					onEnd(e : any) {
						// 结束拖拽
						console.log("结束表格拖拽", e);
						// 如果拖拽结束后顺序发生了变化，则对数据进行修改
						if (e.oldIndex !== e.newIndex) {
							moveTable(e.oldIndex, e.newIndex) // 排序后和后端的交互函数
						}
					},
				});
			},
			deepClone(data : IObject) {
				return JSON.parse(JSON.stringify(data));
			}
		}

	});
</script>

<style scoped lang="scss">
	.schedule-page {

		.card-box {
			width: 100%;
			height: calc(100vh - 50px - 40px - 30px - 40px);
			border: 1px solid #ebeef5;
			border-radius: 5px;
			box-sizing: border-box;
			padding: 10px;
		}

		.tab-list {
			display: flex;
			align-items: center;
			width: 100%;
			border-bottom: 1px solid #ebeef5;

			.tab-item {
				width: 50%;
				padding: 10px 0;
				text-align: center;
				cursor: pointer;
				box-sizing: border-box;
			}

			.active {
				background-color: rgba(62, 142, 247, 0.2);
				color: #3E8EF7;
				border-bottom: 1px solid #3E8EF7;
			}
		}



		.table-item {
			padding: 8px 12px;
			cursor: pointer;
			position: relative;
			// -webkit-touch-callout: none;
			// -webkit-user-select: none;
			// -moz-user-select: none;
			// -ms-user-select: none;
			// user-select: none;

			.table-item-icon {
				cursor: pointer;
				position: absolute;
				bottom: 3px;
				right: -10px;
			}
		}

		.active {
			background-color: rgba(62, 142, 247, 0.2);
			color: #3E8EF7;
			border: 1px solid #3E8EF7;
		}
	}
</style>

<style scoped>
	:deep(.main-card .el-table .el-table__body-wrapper .cell),
	:deep(.main-card .el-table .el-table__body-wrapper .el-table__cell) {
		padding: 0;
	}
</style>