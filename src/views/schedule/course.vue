<template>
	<div class="schedule-page">
		<el-row :gutter="10">
			<el-col :span="5">
				<div class="main-card card-box scroll">
					<el-form label-width="80px" ref="searchForm" :model="dataForm">
						<el-form-item prop="teaching" label="教学任务">
							<el-select v-model="dataForm.task" placeholder="教学任务">
								<el-option v-for="(item,index) in taskList" :key="index" :label="item.name"
									:value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="teaching" label="教学班">
							<el-select v-model="dataForm.teaching" placeholder="教学班">
								<el-option v-for="(item,index) in teachingList" :key="index" :label="item.name"
									:value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="adminclass" label="行政班">
							<el-select v-model="dataForm.adminclass" placeholder="行政班">
								<el-option v-for="(item,index) in administrationList" :key="index" :label="item.name"
									:value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<div style="width:100%;display: flex;justify-content: flex-end;"><el-button>{{ $t("query") }}</el-button></div>
						</el-form-item>
						<!-- <el-form-item>
							<el-button @click="queryResetHandle()">重置</el-button>
						</el-form-item> -->
					</el-form>
					<el-table :data="courseList">
						<el-table-column prop="name" label="课程名">
							<template v-slot="scope">
								<div class="table-item " draggable @dragstart="courseDragStart($event, scope.row)"
									@dragover="courseDragOver($event)" @drop="courseDrop($event, scope.row)">
									{{scope.row.name}}
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="排课状态"></el-table-column>
					</el-table>
				</div>
			</el-col>
			<el-col :span="14">
				<div class="main-card caontainer scroll">


					<!-- <el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="date" label="Date" width="180" />
					<el-table-column prop="name" label="Name" width="180" />
					<el-table-column prop="address" label="Address" />
				</el-table> -->

					<el-table :data="tableData" border style="width: 100%" row-key="key">
						<el-table-column prop="count" label="节次">
							<template v-slot="scope">
								<div class="table-item">{{ scope.row.count }}</div>
							</template>
						</el-table-column>
						<el-table-column v-for="(item,index) in headList" :key="index" :prop="item.name"
							:label="item.name">
							<template v-slot="scope">
								<div @click="handleClick(scope.row,index)" class="table-item"
									:style="getTableItemStyle(scope.row,index)" draggable
									@dragstart="handleDragStart($event, scope.row,index)"
									@dragover="handleDragOver($event)" @drop="handleDrop($event, scope.row,index)">
									{{ scope.row[item.prop] }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="card-box">
					<div class="tab-list">
						<div @click="rightTabClick(0)" class="tab-item" :class="rightTabIndex == 0?'active':''">课程属性
						</div>
						<div @click="rightTabClick(1)" class="tab-item" :class="rightTabIndex == 1?'active':''">课程安排
						</div>
					</div>
					<div class="tab-content">
						<div v-if="selectRowColIndex != ''">
							<!-- 课程属性 -->
							<div class="tab-setting" v-if="rightTabIndex == 0">
								<!-- <p class="tab-p">课程：<span class="tab-span">{{currentCourse.name}}</span></p> -->
								<!-- <p>任课教师：<span class="tab-span">{{currentCourse.teacher}}</span></p> -->
								<el-form label-width="100px">
									<el-form-item label="课程：">
										{{currentCourse.name}}
									</el-form-item>
									<el-form-item label="任课教师：">
										{{currentCourse.teacher}}
									</el-form-item>
									<el-form-item label="班级人数：">0人</el-form-item>
									<el-form-item label="班级人数：">周次</el-form-item>
									<el-form-item label="排课状态："></el-form-item>
									<el-form-item label="地点要求："></el-form-item>
									<el-form-item label="时间要求："></el-form-item>
									<el-form-item label="备注："></el-form-item>
								</el-form>
							</div>
							<!-- 课程安排 -->
							<div v-else-if="rightTabIndex == 1">
								<h4>时间安排</h4>
								<el-form label-width="50px">
									<el-form-item label="周几:">
										<el-select v-model="courseSetting.week">
											<el-option v-for="(item,index) in headList" :key="index" :value="item.prop"
												:label="item.name"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="节次:">
										<el-select v-model="courseSetting.count">
											<el-option v-for="(item,index) in 11" :key="index" :value="index"
												:label="`第${index + 1}节`"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<el-form-item>
											<el-button type="primary" size="small" @click="updateCourseTime()">更新时间</el-button>
										</el-form-item>
									</el-form-item>
								</el-form>
								<h4>地点安排</h4>
								<div class="tab-setting" v-if="courseSetting.areaId">
									<el-form label-width="80px">
										<el-form-item label="教室名:">
											{{courseSetting.areaInfo.name}}
										</el-form-item>
										<el-form-item label="校区:">
											{{courseSetting.areaInfo.campus}}
										</el-form-item>
										<el-form-item label="教学楼:">
											{{courseSetting.areaInfo.building}}
										</el-form-item>
										<el-form-item label="楼层:">
											{{courseSetting.areaInfo.floor}}
										</el-form-item>
										<el-form-item label="门牌号:">
											{{courseSetting.areaInfo.house}}
										</el-form-item>
										<el-form-item label="容量:">
											{{courseSetting.areaInfo.seats}}
										</el-form-item>
										<el-form-item>
											<el-button type="primary" size="small" @click="selectArea()">更换上课场地</el-button>
										</el-form-item>
									</el-form>
								</div>
								<div v-else style="text-align:center;">
									<el-button type="primary" @click="selectArea()">请选择上课场地</el-button>
								</div>
							</div>
						</div>
						<div v-else class="tab-empty">
							<el-icon class="tab-empty-icon">
								<Warning />
							</el-icon>
							<div>请点击选中左侧课表中的某个课程</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>

		<!-- 教学场地选择 -->
		<teaching-area v-if="areaVisible" ref="teachingArea" @confirm="confirmAra"></teaching-area>
	</div>
</template>

<script lang="ts">
	import draggable from 'vuedraggable'
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	import TeachingArea from "../dialog/teachingarea.vue";
	export default defineComponent({
		components: {
			draggable,
			TeachingArea
		},
		setup() {
			const state = reactive({
				areaVisible: false,
				taskList: [] as IObject[],  //教学任务
				teachingList: [] as IObject[],  //教学班
				administrationList: [] as IObject[],  //行政班
				courseList: [] as IObject[],  //课程列表
				dataList: [],
				//课程搜索
				dataForm: {
					task: "",
					teaching: "",
					adminclass: ""
				} as IObject,
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
				tableData: [] as IObject[],  //排课数据
				dragginType: "",
				draggingRowIndex: 0,
				draggingColIndex: 0,
				selectRowColIndex: '',
				currentCourse: {} as IObject,
				rightTabIndex: 0,
				// 课程安排
				courseSetting: {
					week: "",//周几
					count: "",//节次
					areaId: "",
					// 场地信息
					areaInfo: {
						name: ""
					}
				} as IObject
			});
			return { ...toRefs(state) };
		},
		activated() {
			this.init();
		},
		methods: {
			init() {

				this.courseList = [];

				for (let i = 0; i < 11; i++) {
					let obj = {} as IObject;
					obj['count'] = `第${i + 1}节`;
					obj['key'] = i + 1;
					// console.log('color', this.randomColor())
					for (let j = 0; j < this.headList.length; j++) {
						let prop = this.headList[j].prop;
						if ((i + j) % 3 == 0) {
							// 星期几(1-7) ：课程名称
							obj[prop] = "课程名称" + (i + '' + j);
							obj['course' + i + prop] = {
								week:prop,
								count:i,
								courseNo: (i + '' + j),
								name: "课程名称" + (i + '' + j),
								teacher: "李老师" + (i + '' + j),
								// 场地
								areaInfo: null
							}
							obj['color' + i + prop] = this.randomColor();
						}

						let courseObj = {
							courseNo: (i + '' + j),
							name: "课程名称" + (i + '' + j),
							teacher: "李老师" + (i + '' + j),
							classessNumber: 170,
							weekCount: '1-12周',
							requirement: true,  //场地需求
							campus: "校区",
							classroom: "",
							classroomType: "",
							building: ""
						}

						this.courseList.push(courseObj);
					}
					this.tableData.push(obj);
				}
				console.log('tableData----', this.tableData);



			},
			// 获取教学班
			getTeachingClasess() {

			},
			// 获取行政班
			getAdminClasess() {
				// administrationList
			},
			// type 返回数组格式 1 string ， 2 object
			// 根据 key,subKey 获取所有数据
			getAllList(type : number, keyName : string, subKey ?: string) {
				let list = [] as string[];
				let objList = [] as IObject[];
				this.tableData.forEach((item : IObject) => {
					for (let key in item) {
						if (subKey) {
							if (typeof item[key] == 'object') {
								for (let j in item[key]) {
									if (j.indexOf(subKey) != -1) {
										list.push(item[key][subKey])
										objList.push({
											value: item[key][subKey],
											obj: item,
										})
									}
								}
							}
						} else {
							if (key.indexOf(keyName) != -1) {
								list.push(item[key])
								objList.push({
									value: item[key],
									obj: item,
								})
							}
						}
					}
				})
				return type == 1 ? list : objList;
			},
			// 随机生成色
			randomColor() {
				let color = "";
				let red = Math.floor(Math.random() * 255);
				let green = Math.floor(Math.random() * 255);
				let blue = Math.floor(Math.random() * 255);
				color = red + ',' + green + ',' + blue;
				let list = this.getAllList(1, 'color') as string[];

				if (list.indexOf(color) != -1) {
					color = this.randomColor();
				} else if (red == 62 && green == 142 && blue == 247) {
					color = this.randomColor();
				}
				// console.log('list',list)
				return color;
			},
			// 左侧开始课程拖拽
			courseDragStart(event : any, row : IObject) {
				// console.log('开始拖拽---course', event)
				// console.log('开始拖拽---course-row', row)
				this.draggingRowIndex = this.courseList.indexOf(row);
				this.draggingColIndex = -1;
				this.dragginType = "out";
				// console.log('开始拖拽---course-index', this.draggingRowIndex)
			},
			courseDragOver(event : any) {
				event.preventDefault()
			},
			courseDrop(event : any, row : IObject) {
				// console.log('拖拽结束--course-event', event)
				// console.log('拖拽结束--course-row', row)
			},
			// 左侧课程end
			// 开始拖拽
			handleDragStart(event : any, row : IObject, index : number) {
				// console.log('开始拖拽---event', event)
				// console.log('开始拖拽---row', row)
				// console.log('开始拖拽---index', index)
				// 第几行0开始
				this.draggingRowIndex = this.tableData.indexOf(row);
				// index 第几列 0 星期几 index+1
				this.draggingColIndex = index;
				this.dragginType = "inside";
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
				console.log('拖拽结束---row', row)
				console.log('拖拽结束---index', index);
				// 拖拽到星期几 index + 1;
				let newProp = (index + 1).toString();
				// 拖拽到第几行
				const droppingRowIndex = this.tableData.indexOf(row);
				if (this.dragginType == "inside") {
					// console.log('droppingRowIndex',droppingRowIndex)
					let oldProp = (this.draggingColIndex + 1).toString();

					let draggingRow = this.deepClone(this.tableData[this.draggingRowIndex]);
					this.tableData[this.draggingRowIndex][oldProp] = row[newProp];
					if(row[newProp]) {
						this.tableData[this.draggingRowIndex]['course' + this.draggingRowIndex + oldProp] = {
							...row['course' + droppingRowIndex + newProp],
							week:oldProp,
							count:this.draggingRowIndex
						};
						this.tableData[this.draggingRowIndex]['color' + this.draggingRowIndex + oldProp] = row['color' + droppingRowIndex + newProp];
					}else {
						this.tableData[this.draggingRowIndex]['course' + this.draggingRowIndex + oldProp] = null;
						this.tableData[this.draggingRowIndex]['color' + this.draggingRowIndex + oldProp] = "";
					}
					
					this.tableData[droppingRowIndex][newProp] = draggingRow[oldProp];
					this.tableData[droppingRowIndex]['course' + droppingRowIndex + newProp] = {
						...draggingRow['course' + this.draggingRowIndex + oldProp],
						week:newProp,
						count:droppingRowIndex
					}
					this.tableData[droppingRowIndex]['color' + droppingRowIndex + newProp] = draggingRow['color' + this.draggingRowIndex + oldProp];
					
					if(this.selectRowColIndex) {
						this.selectRowColIndex = droppingRowIndex + '-' + index;
						
						//更新右侧课程信息
						if(this.currentCourse) {
							this.handleClick(this.tableData[droppingRowIndex],index)
						}
					}
					// console.log('selectRowColIndex---',this.selectRowColIndex)
					
				} else {
					console.log('0---', row[newProp])
					if (row[newProp]) {
						this.$message.error("该节次已有课程占用了！")
					} else {
						// 被安排的课程
						let draggingRow = this.deepClone(this.courseList[this.draggingRowIndex]);
						// console.log('draggingRow', draggingRow)

						//已排课的所有课程数据
						let hasAddCourse = this.getAllList(2, 'course', 'courseNo') as IObject[]
						// console.log('hasAddCourse', hasAddCourse);

						let cIndex = hasAddCourse.findIndex(val => val.value == draggingRow.courseNo);
						let color = "";
						if (cIndex != -1) {
							let obj : IObject = hasAddCourse[cIndex].obj;
							for (let key in obj) {
								if (key.indexOf('course') != -1 && obj[key]['courseNo'] == draggingRow.courseNo) {
									let indexStr = key.substr(6, 2);
									color = obj['color' + indexStr];
								}
							}
						} else {
							color = this.randomColor();
						}

						this.tableData[droppingRowIndex][newProp] = draggingRow.name;
						this.tableData[droppingRowIndex]['course' + droppingRowIndex + newProp] = {
							...draggingRow,
							week:newProp,
							count:droppingRowIndex
						};
						this.tableData[droppingRowIndex]['color' + droppingRowIndex + newProp] = color;

						this.selectRowColIndex = droppingRowIndex + '-' + index;
						
						console.log('selectRowColIndex---',this.selectRowColIndex)
					}
				}
				console.log('拖拽已结束', this.tableData[droppingRowIndex]);
			},
			//  @mousedown="handleMousedown"
			// handleMousedown(event:any){
			// 	event.preventDefault()
			// },
			// 点击
			handleClick(row : IObject, index : number) {
				console.log('row=====', row)
				// console.log('row=====', row, index)
				if (row[(index + 1).toString()]) {
					const clickRowIndex = this.tableData.indexOf(row);
					this.selectRowColIndex = clickRowIndex + '-' + index;
					this.currentCourse = row['course' + clickRowIndex + (index + 1)];
					console.log('currentCourse', this.currentCourse);
					//
					this.courseSetting.week = (index + 1).toString();
					this.courseSetting.count = clickRowIndex;
					
					if (this.currentCourse.areaInfo) {
						this.courseSetting.areaId = this.currentCourse.areaInfo.areaId;
						this.courseSetting.areaInfo = this.currentCourse.areaInfo;
					} else {
						this.courseSetting.areaId = "";
						this.courseSetting.areaInfo = {};
					}

				} else {
					this.selectRowColIndex = "";
				}
				this.rightTabIndex = 1;
			},
			// 单元格样式
			getTableItemStyle(row : IObject, index : number) {
				let style = {} as IObject;
				const rowIndex = this.tableData.indexOf(row);
				if (this.selectRowColIndex && this.selectRowColIndex == (rowIndex + '-' + index)) {
					console.log('row', row)
					style['background-color'] = 'rgba(62, 142, 247, 0.2)';
					style['color'] = '#3E8EF7';
					style['border'] = '1px solid #3E8EF7';
				} else if (row['color' + rowIndex + (index + 1)]) {
					style['background-color'] = `rgba(${row['color' + rowIndex + (index + 1)]},0.2)`;
					style['color'] = `rgb(${row['color' + rowIndex + (index + 1)]})`;
					// style['border'] = `1px solid rgb(${row['color' + rowIndex + (index + 1)]})`;
				}

				return style;
			},
			// 右侧属性、安排
			rightTabClick(index : number) {
				console.log('index', index)
				this.rightTabIndex = index;
				if (this.rightTabIndex == 1) {
					// this.getAreaList()
				}
			},
			// 更新上课时间
			updateCourseTime(){
				let colIndex = this.courseSetting.week;
				let rowIndex = parseInt(this.courseSetting.count);
				console.log('colIndex---',colIndex);
				console.log('rowIndex---',rowIndex);
				console.log('current====',this.currentCourse)
				let row = this.tableData[rowIndex]['course' + rowIndex + this.courseSetting.week];
				if(row) {
					if(this.currentCourse.courseNo != row.courseNo) {
						return this.$message.error('当前时间已被占用!')
					}
				}else {
					let oldCourse = this.deepClone(this.currentCourse);
					let oldProp = oldCourse.week;
					let oldRowIndex = oldCourse.count;
					let oldRow = this.deepClone(this.tableData[oldRowIndex]);
					let color = oldRow['color' + oldRowIndex + oldProp];
					console.log('oldRow--',oldRow);
					console.log('color--',color);
					// this.tableData[rowIndex]['course' + rowIndex + this.courseSetting.week];
					//更新新位置
					this.tableData[rowIndex][colIndex] = oldCourse.name;
					this.tableData[rowIndex]['course' + rowIndex + colIndex] = {
						...oldCourse,
						week:colIndex,
						count:rowIndex
					};
					this.tableData[rowIndex]['color' + rowIndex + colIndex] = color;
					this.selectRowColIndex = rowIndex + '-' + (parseInt(colIndex) - 1);
					//清除旧位置
					this.currentCourse.week = colIndex;
					this.currentCourse.count = oldRowIndex;
					this.tableData[oldRowIndex][oldProp] = null;
					this.tableData[oldRowIndex]['course' + oldRowIndex + oldProp] = null;
					this.tableData[oldRowIndex]['color' + oldRowIndex + oldProp] = "";
					
					
				}
			},
			// 教学场地选择
			selectArea() {
				this.areaVisible = true;
				this.$nextTick(() => {
					this.$refs.teachingArea.init();
				})
			},
			confirmAra(data : IObject) {
				console.log('data---', data);
				//判断当前时间点的场地占用情况
				
				
				this.courseSetting.areaId = data.id;
				this.courseSetting.areaInfo = this.deepClone(data);
				delete this.courseSetting.areaInfo.id;

				//更新当前课程信息
				this.currentCourse.areaInfo = {
					areaId: data.id,
					...this.courseSetting.areaInfo
				}
				console.log('currentCourse---', this.currentCourse)
				//更新课程表数据
				// this.tableData
				let rowIndex = this.courseSetting.count;
				let week = this.courseSetting.week;
				console.log('rowIndex',rowIndex)
				console.log('colIndex',week)
				
				// console.log('tableData---',this.tableData[rowIndex])
				this.tableData[rowIndex]['course' + rowIndex + week]['areaInfo'] = this.currentCourse.areaInfo;
				this.$forceUpdate();
				console.log('tableData---row---', this.tableData[rowIndex])

				this.areaVisible = false;
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
			position: relative;
		}

		.scroll {
			overflow: hidden;
			overflow-y: auto;
		}

		.caontainer {
			height: calc(100vh - 50px - 40px - 30px - 40px);
		}

		.tab-list {
			display: flex;
			align-items: center;
			width: 100%;
			border-bottom: 1px solid #ebeef5;

			.tab-item {
				width: 50%;
				padding: 10px 0;
				// min-height: 50px;
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

		.tab-content {
			position: absolute;
			width: 100%;
			height: calc(100% - 41px - 10px);
			padding: 10px;
			left: 0;
			overflow: hidden;
			overflow-y: auto;
			
			.tab-setting {
				.el-form-item {
					margin-bottom:0;
				}
			}

			.tab-empty {
				padding: 40px 0;
				text-align: center;

				.tab-empty-icon {
					font-size: 50px;
					color: gray;
					margin-top: 6px;
				}
			}
		}

		.table-item {
			padding: 8px 12px;
			cursor: pointer;
			// position: absolute;
			// width:100%;
			// height:100%;
			// left:0;
			// top:0;
			// -webkit-touch-callout: none;
			// -webkit-user-select: none;
			// -moz-user-select: none;
			// -ms-user-select: none;
			// user-select: none;
			-webkit-user-drag: element;

			.table-item-icon {
				cursor: pointer;
				position: absolute;
				bottom: 3px;
				right: -10px;
			}
		}

		.course-item {
			padding: 0;
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

	:deep(.main-card .el-table .el-table__body-wrapper .el-table__cell) {
		position: relative;
	}

	:deep(.main-card .el-table .el-table__body-wrapper .el-table__cell .cell) {
		/* position: absolute; */
		/* width:100%; */
		/* height:100%; */
		/* left:0; */
		/* top:0; */
	}
</style>