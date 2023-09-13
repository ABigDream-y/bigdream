<template>
	<div class="course-setting-page">
		<h3 style="margin-top:0;">节次设置</h3>
		<el-form :inline="true">
			<el-form-item label="每节课程时长">
				<el-input style="width:150px;" v-model="dataForm.courseTime" placeholder="每节课程时长">
					<template #append>分钟</template>
				</el-input>
			</el-form-item>
			<el-form-item label="课间休息时长">
				<el-input style="width:150px;" v-model="dataForm.resetTime" placeholder="课间休息时长">
					<template #append>分钟</template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="insertEvent(-1)">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="danger" @click="removeEvent()">删除</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="saveHandle()">保存</el-button>
			</el-form-item>
		</el-form>
		<vxe-table border show-overflow ref="xTable" class="my_table_insert" max-height="400" :data="tableData"
			:edit-config="{ trigger: 'click', mode: 'cell', icon: 'fa fa-pencil' }">
			<vxe-column type="checkbox" width="60"></vxe-column>
			<vxe-column type="seq" width="50"></vxe-column>
			<vxe-column field="name" title="节次名称" :edit-render="{ name: 'input' }"></vxe-column>
			<vxe-column field="start" title="开始时间" :formatter="timeFormat"
				:edit-render="{ name: '$input',immediate:true,props:{type:'time'}}"></vxe-column>
			<vxe-column field="end" title="结束时间" :formatter="timeFormat"
				:edit-render="{ name: '$input',immediate:true,props:{type:'time'}}"></vxe-column>
		</vxe-table>
		<!-- <vxe-table border row-key ref="xTable" class="sortable-row-gen" size="small" :data="tableData"
			:checkbox-config="{ checkStrictly: true }" :edit-config="{ trigger: 'click', mode: 'cell' }">
			<vxe-column type="seq" width="35"></vxe-column>
		</vxe-table> -->
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, toRefs } from "vue";
	import { IObject } from "@/types/interface";
	export default defineComponent({
		components: {

		},
		setup() {
			const state = reactive({
				tableId: "",
				tableData: [] as IObject[],
				instituteList: [],
				dataForm: {
					institute: "",
					courseTime: "45",
					resetTime:"15"
				}
			});
			return { ...toRefs(state) };
		},
		beforeUnmount() {
			if (this.sortable) {
				this.sortable.destroy();
			}
		},
		activated() {
			this.init()
		},
		methods: {
			init() {
				this.tableData = [];
				this.tableData.push({
					name:"第1节次",
					start:"08:00",
					end:"08:45"
				})
				this.$nextTick(() => {
					this.rowDrop();
				});
			},
			rowDrop() {
				// this.$nextTick(() => {
				// 	const xTable = this.$refs.xTable;

				// 	//TODO:检查功能是否正常：this.sortable1
				// 	this.sortable = Sortable.create(xTable.$el.querySelector(".body--wrapper>.vxe-table--body tbody"), {
				// 		handle: ".drag-btn",
				// 		onEnd: (e : IObject) => {
				// 			const { newIndex, oldIndex } = e;
				// 			const currRow = this.tableData.splice(oldIndex, 1)[0];
				// 			this.tableData.splice(newIndex, 0, currRow);
				// 		}
				// 	});
				// });
			},
			startTimeChange(val : any) {
				console.log('startTimeChange--', val)
			},
			//时间格式
			timeFormat(row : IObject) {
				const { cellValue } = row;
				return cellValue ? cellValue.substr(0, 5) : "";
			},
			deepClone(data:any){
				return JSON.parse(JSON.stringify(data));
			},
			//新增节次
			async insertEvent(row : number) {
				let tableData = this.$refs.xTable.getTableData().tableData;
				let record = {
					name:"第" + (tableData.length + 1) + "节次",
					start:"",
					end:"",
				};
				let last = tableData[tableData.length - 1];
				if(last && last.end && this.dataForm.courseTime) {
					let endLastTime = new Date('2023-04-04 ' + last.end + ":00");
					let startTime = endLastTime;
					if(this.dataForm.resetTime) {
						startTime.setMinutes(startTime.getMinutes() + parseInt(this.dataForm.resetTime));
					}
					let startDate = this.getTime(startTime);
					
					let endTime = new Date('2023-04-04 ' + startDate + ":00");
					endTime.setMinutes(endTime.getMinutes() + parseInt(this.dataForm.courseTime));
					let endDate = this.getTime(endTime);
					// console.log('startTime--',startTime);
					// console.log('endTime---',endTime);
					
					
					// console.log('startDate---',startDate);
					// console.log('endDate----',endDate);
					// this.dataForm.courseTime
					// endLastTime.setMinutes(startTime.getMinutes() + gapTime);
					record.start = startDate || "";
					record.end = endDate || "";
				}
				// 
				// courseTime: "40",
				// resetTime:"10"
				// 		name: "第" + (i + 1) + "节次",
				// 		start: "",
				// 		end: ""
				
				let { row: newRow } = await this.$refs.xTable.insertAt(record, row);
				await this.$refs.xTable.setActiveCell(newRow, "name");
			},
			getTime(time:any){
				let hour = time.getHours();
				let minute = time.getMinutes();
				return this.add0(hour) + ':' + this.add0(minute);
			},
			add0(number : number) {
				return number >= 10 ? number : ('0' + number);
			},
			removeEvent() {
				const selectRecords = this.$refs.xTable.getCheckboxRecords();
				if (selectRecords.length) {
					this.$refs.xTable.removeCheckboxRow();
				} else {
					this.$message.error("请至少选择一条数据");
				}
			},
			saveHandle() {
				let tableData = this.$refs.xTable.getTableData().tableData;
				console.log('tableData---', tableData);
				let nameIndex = null;
				let startTimeIdx = null;
				let endTimeIdx = null;
				for (let i = 0; i < tableData.length; i++) {
					if (!tableData[i].name) {
						nameIndex = i;
						break;
					} else if (!tableData[i].start) {
						startTimeIdx = i;
						break;
					} else if (!tableData[i].end) {
						endTimeIdx = i;
						break;
					}
				}

				if (nameIndex != null) {
					return this.$message.error('请完善第' + (nameIndex + 1) + "行的名称");
				} else if (startTimeIdx != null) {
					return this.$message.error('请完善第' + (startTimeIdx + 1) + "行的开始时间");
				} else if (endTimeIdx != null) {
					return this.$message.error('请完善第' + (endTimeIdx + 1) + "行的结束时间");
				}

			}
		}

	});
</script>