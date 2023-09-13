<template>
	<div class="edit-card--file">
		<div class="aui-tab-header" style="z-index:999;">
			<el-button @click="goBack()"><el-icon>
					<ArrowLeft />
				</el-icon>返回</el-button>
			<el-button type="primary" v-if="dataForm.status == 0" :loading="loading"
				@click="dataFormSubmitHandle(2)">提交审核</el-button>
			<!-- <el-button type="primary" v-if="dataForm.status == 2" :loading="loading" @click="dataFormSubmitHandle(1)">审核通过</el-button> -->
			<!-- <el-button type="primary" v-if="dataForm.status == 2" :loading="loading" @click="verifyHandle(3)">审核不通过</el-button> -->
		</div>
		<div class="edit-card__body aui-tab-body">
			<el-tabs v-model="activeName" tab-position="top" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="基本信息设置" name="setting">
					<div class="demo-tabs-item">
						<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="140px">
							<!-- 基本信息 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>基本信息</span>
								</div>
								<!-- <h3 class="info-h3">基本信息</h3> -->
								<el-form-item label="教学班号" prop="">
									<div>{{ dataForm.className }}</div>
								</el-form-item>
								<el-row :gutter="20">
									<el-col :span="6">
										<el-form-item label="课程号" prop="courseNo">
											<div>{{ dataForm.courseNo }}</div>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="课程名称" prop="courseName">
											<div>{{ dataForm.courseName }}</div>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="课序号" prop="">
											<div>{{ dataForm.className }}</div>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="开课单位" prop="courseUnit">
											<div>{{ dataForm.courseUnit }}</div>
										</el-form-item>
									</el-col>
								</el-row>
								<!-- 学时........ -->
								<div style="display: flex; flex-wrap: wrap">
									<el-form-item label="学分" prop="">
										<div>{{ dataForm.score }}</div>
									</el-form-item>
									<el-form-item label="总学时" prop="">
										<div>{{ dataForm.totalHours }}</div>
									</el-form-item>
									<el-form-item label="周学时" prop="">
										<div>{{ dataForm.weekHours }}</div>
									</el-form-item>
									<el-form-item label="授课学时" prop="">
										<div>{{ dataForm.teachingHours }}</div>
									</el-form-item>
									<el-form-item label="实践学时" prop="">
										<div>{{ dataForm.practicalHours }}</div>
									</el-form-item>
									<el-form-item label="上机学时" prop="">
										<div>{{ dataForm.weekHours }}</div>
									</el-form-item>
									<el-form-item label="其他学时" prop="">
										<div>{{ dataForm.otherHours }}</div>
									</el-form-item>
								</div>
								<div>
									<el-form-item label="预计重修人数" prop="expectedRefurbishment">
										<el-input-number v-model="dataForm.expectedRefurbishment"
											:min="0"></el-input-number>
									</el-form-item>
								</div>

							</div>
							<!-- 任务信息 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>任务信息</span>
								</div>
								<!-- <h3 class="info-h3">任务信息</h3> -->
								<el-row :gutter="20">
									<el-col :span="8">
										<el-form-item label="上课校区" prop="campus">
											<ren-select size="large" v-model="dataForm.campus" dict-type="campus"
												placeholder="上课校区"></ren-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="教学方式" prop="mode">
											<ren-select v-model="dataForm.teachingMethods" size="large"
												dict-type="course_mode" placeholder="教学方式"></ren-select>
										</el-form-item>
									</el-col>
								</el-row>
							</div>

							<!-- 场地要求 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>场地需求</span>
								</div>
								<!-- <h3 class="info-h3">场地需求</h3> -->
								<el-form-item label="需求" prop="requirement">
									<div style="display: flex; align-items: center">
										<el-radio-group v-model="dataForm.areaStatus" class="ml-4"
											style="margin-right: 20px">
											<el-radio :label="1" size="large">需要</el-radio>
											<el-radio :label="0" size="large">不需要</el-radio>
										</el-radio-group>
										<el-tooltip class="box-item" effect="dark" content="对教学场地是否有需求"
											placement="right-end">
											<el-icon>
												<QuestionFilled />
											</el-icon>
										</el-tooltip>
									</div>
								</el-form-item>

								<el-form-item label="需求说明" prop="requirement" v-if="dataForm.areaStatus">
									<el-input v-model="dataForm.requirement" :rows="3" type="textarea"
										placeholder="请输入需求"></el-input>
								</el-form-item>
							</div>

							<!-- 限制 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>限制</span>
								</div>
								<!-- <h3 class="info-h3">限制</h3> -->
								<el-form-item label="课容量" prop="mode">
									<el-input-number size="large" v-model="dataForm.courseNumber"
										:min="0"></el-input-number>
								</el-form-item>
								<el-form-item label="是否有性别限制" prop="genderStatus">
									<el-radio-group v-model="dataForm.genderStatus" class="ml-4"
										style="margin-right: 20px">
										<el-radio :label="1" size="large">是</el-radio>
										<el-radio :label="0" size="large">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="" prop="mode" v-if="dataForm.genderStatus">
									<div style="display: flex; width: 35%">
										<div style="margin-right: 20px; line-height: 40px">男生</div>
										<el-input-number size="large" v-model="dataForm.maleNum"
											:min="0"></el-input-number>
									</div>
									<div style="display: flex; width: 35%">
										<div style="margin-right: 20px; line-height: 40px">女生</div>
										<el-input-number size="large" v-model="dataForm.femaleNum"
											:min="0"></el-input-number>
									</div>
								</el-form-item>
								<el-form-item label="备注" prop="">
									<el-input v-model="dataForm.remark" :rows="3" type="textarea"
										placeholder="请输入需求"></el-input>
								</el-form-item>
								<el-form-item label="选课说明" prop="">
									<el-input v-model="dataForm.description" :rows="3" type="textarea"
										placeholder="请输入需求"></el-input>
								</el-form-item>
							</div>

							<!-- 上课班级 -->
							<div>
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>上课班级</span>
								</div>
								<teaching-classes ref="teachingClasses"></teaching-classes>
							</div>

							<!-- 上课教师 -->
							<div>
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>上课教师</span>
								</div>
								<teaching-teacher ref="teachingTeacher"></teaching-teacher>
							</div>

							<!-- 教学班社媒 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>教学班社媒</span>
								</div>
								<!-- <h3 class="info-h3">场地需求</h3> -->
								<el-row :gutter="20">
									<el-col :span="8">
										<el-form-item label="班级群号" prop="desc">
											<el-input size="large" v-model="dataForm.desc"
												placeholder="班级群号"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="班级邮箱" prop="desc">
											<el-input size="large" v-model="dataForm.desc"
												placeholder="班级邮箱"></el-input>
										</el-form-item>
									</el-col>
								</el-row>

								<el-form-item label="慕课网址" prop="desc">
									<el-input size="large" v-model="dataForm.desc" placeholder="慕课网址"></el-input>
								</el-form-item>
							</div>

							<!-- 上课周次学时设置 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>上课周次学时设置</span>
								</div>
								<!-- <h3 class="info-h3">上课周次学时设置</h3> -->
								<el-form-item size="large" label="周学时" prop="mode">
									<el-input-number style="margin-right: 20px" v-model="dataForm.courseTimeRequire"
										:step="1" :min="0"></el-input-number>

									<el-tooltip class="box-item" effect="dark" content="周学时默认使用课程周学时"
										placement="right-end">
										<el-icon>
											<QuestionFilled />
										</el-icon>
									</el-tooltip>
								</el-form-item>
								<el-form-item label="上课周次" prop="mode">
									<el-radio-group style="margin-right: 100px" v-model="dataForm.courseCount"
										class="ml-4" @change="weekSelectChange">
										<el-radio :label="0" size="large">全部</el-radio>
										<el-radio :label="1" size="large">单周</el-radio>
										<el-radio :label="2" size="large">双周</el-radio>
									</el-radio-group>
									<!-- <span> 已选学时 (2/14) </span> -->
								</el-form-item>
								<el-form-item label="">
									<el-checkbox-group v-model="checkList" @change="weekChange">
										<!-- 单周 -->
										<div style="display: flex">
											<div v-for="num in 18" :key="num">
												<el-checkbox size="large" :label="num" v-if="num % 2 != 0" />
											</div>
										</div>
										<!-- 双周 -->
										<div style="display: flex">
											<div v-for="num in 18" :key="num">
												<el-checkbox size="large" :label="num" v-if="num % 2 == 0" />
											</div>
										</div>
									</el-checkbox-group>
								</el-form-item>
							</div>
							<!-- 选课范围设置 -->
							<div class="edit-card-page">
								<div class="muodule-header">
									<div class="module-header-block"></div>
									<span>选课范围设置</span>
								</div>
								<!-- <h3 class="info-h3">选课范围设置</h3> -->
								<el-form-item label="是否限制选课范围" prop="">
									<el-radio-group v-model="dataForm.className" class="ml-4">
										<el-radio :label="1" size="large">是</el-radio>
										<el-radio :label="0" size="large">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<div>
									<el-form-item label="学院" prop="instituteNo">
										<ren-institute-tree v-model="dataForm.instituteNo" size="large"
											:deptName="dataForm.institute" @change="instituteChange" placeholder="学院"
											nodekey="number" showType="select"></ren-institute-tree>
									</el-form-item>
									<el-form-item label="专业" prop="major">
										<el-select v-model="dataForm.major" size="large" placeholder="专业">
											<el-option v-for="(item, index) in majorList" :key="index"
												:value="item.name" :label="item.name"
												@click="majorChange(item)"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="年级" prop="grade">
										<el-select v-model="dataForm.grade" size="large" placeholder="年级">
											<el-option v-for="(item, index) in gradeList" :key="index"
												:value="item.name" :label="item.name"
												@click="gradeChange(item)"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="班级" prop="className">
										<el-select v-model="dataForm.className" size="large" placeholder="班级">
											<el-option v-for="(item, index) in classList" :key="index"
												:value="item.name" :label="item.name"
												@click="classChange(item)"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</div>
						</el-form>

					</div>
				</el-tab-pane>
				<!-- 花名册 -->
				<!-- <el-tab-pane label="" name="roster"></el-tab-pane> -->
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive, toRefs } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import TeachingClasses from "./teachingclasess.vue";
	import TeachingTeacher from "./teachingteacher.vue";
	export default defineComponent({
		components: {
			TeachingClasses, TeachingTeacher
		},
		setup() {
			const store = useStore();
			const state = reactive({
				store,
				loading: false,
				visible: false,
				isAllowEdit: false,
				majorList: [] as IObject[],
				gradeList: [] as IObject[],
				classList: [] as IObject[],
				weekType: [[], [], []] as IObject[],
				checkList: [] as string[],
				activeName: "setting",
				dataForm: {
					id: "",
					courseNo: "",
					courseName: "",
					courseUnit: "",
					status: "",
					teachingMethods: "",
					courseHead: "",
					score: "",
					desc: "",
					totalHours: "",
					teachingHours: "",
					weekHours: "",
					practicalHours: "",
					computerHours: "",
					otherHours: "",
					campus: "",
					courseNumber: 0,
					expectedRefurbishment: "",
					requirement: 0,
					classroomType: "",
					areaId: "",
					building: "",
					classroom: "",
					genderStatus: 0,
					maleNum: 0,
					femaleNum: 0,
					remark: "",
					description: "",
					courseCount: "",
					courseTimeRequire: 0
				} as IObject,
				courseRangeList: [
					{
						range: ""
					}
				]
			});
			return { ...toRefs(state) };
		},
		computed: {
			dataRule() {
				return {
					teachingId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					className: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		activated() {
			this.init();
		},
		methods: {
			init() {
				this.isAllowEdit = false;
				for (let num = 1; num <= 18; num++) {
					this.weekType[0].push(num);
					if (num % 2 != 0) {
						// 单
						this.weekType[1].push(num);
					} else {
						this.weekType[2].push(num);
					}
				}
				console.log(this.weekType);
				this.loading = false;
				let id = this.$route.query.id || "";
				if (id && id != "0") {
					this.dataForm.id = id;
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					this.dataForm.teachingId = this.$route.query.tid;
					if (this.dataForm.id) {
						this.getInfo();
					} else {
						this.isAllowEdit = true;
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/task/teaching/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					console.log("详情--", res);
					this.dataForm = res.data;

					if (this.dataForm.status == 0 || this.dataForm.status == 3) {
						this.isAllowEdit = true;
					}

					this.dataForm.campus = res.data.campus || "";

					this.$nextTick(() => {
						this.$refs.teachingClasses.init(this.dataForm.id, this.dataForm.courseId);
						this.$refs.teachingTeacher.init(this.dataForm.id);
					})
				});
			},

			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.instituteNo = data.number;
					this.dataForm.institute = data.name;
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.dataForm.grade = "";
					this.dataForm.className = "";
					this.dataForm.classNo = "";
					this.majorList = data.children;
				} else {
					this.dataForm.instituteNo = "";
					this.dataForm.institute = "";
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.dataForm.grade = "";
					this.dataForm.className = "";
					this.dataForm.classNo = "";
					this.majorList = [];
				}
			},
			// 专业变更
			majorChange(data : IObject) {
				this.dataForm.grade = "";
				this.dataForm.className = "";
				this.dataForm.classNo = "";
				this.gradeList = data.children;
			},
			// 年级变更
			gradeChange(data : IObject) {
				this.dataForm.className = "";
				this.dataForm.classNo = "";
				this.classList = data.children;
			},
			// 班级变更
			classChange(data : IObject) {
				console.log(data);
				this.dataForm.classNo = data.number;
			},
			// 选择周变更
			weekSelectChange(value : number) {
				this.checkList = [];

				console.log("weekchange--", value);
				this.checkList = this.weekType[value];
			},
			// 周变更
			weekChange(data : any) {
				console.log("data", data);
				console.log("chexked", this.checkList);
				let weekTypeOdd = [];
				let weekTypeEven = [];

				if (this.checkList.length == this.weekType[0].length) {
					// 全选回显
					this.dataForm.courseCount = 0;
				} else {
					this.checkList.forEach((item) => {
						if (item % 2 != 0) {
							// 单
							weekTypeOdd.push(item);
						} else {
							weekTypeEven.push(item);
						}
					});
					// 单双周选择取消
					if (weekTypeOdd.length < this.weekType[1].length || weekTypeEven.length < this.weekType[1].length) {
						this.dataForm.courseCount = null;
					}
					if (weekTypeOdd.length == this.weekType[1].length) {
						// 单周回显
						this.dataForm.courseCount = 1;
					}
					if (weekTypeEven.length == this.weekType[2].length) {
						// 双周回显
						this.dataForm.courseCount = 2;
					}
				}
			},
			//审核不通过
			verifyHandle() {
				let that = this;
				this.$prompt("确认审核不通过？", '填写审核未通过理由', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					inputType: "textarea",
					inputValidator: (value : string) => {
						if (!value) {
							return '理由不能为空！';
						}
					}
				}).then(({ value }) => {
					console.log('value---', value)
					that.dataFormSubmitHandle(3);

				}).catch(() => {

				});
			},
			// 表单提交
			dataFormSubmitHandle(status : number) {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					if (this.dataForm.genderStatus == 0) {
						this.dataForm.femaleNum = 0;
						this.dataForm.maleNum = 0;
					}
					if (this.dataForm.requirement == 0) {
						// 需求说明清空
						// this.dataForm.femaleNum = 0;
					}
					// 选课范围设置
					// if (this.dataForm.requirement == 0) {
					//   this.dataForm.femaleNum = 0;
					// }
					let postData = JSON.parse(JSON.stringify(this.dataForm));
					postData['status'] = status;
					console.log('提交的数据', postData);



					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/task/teaching", postData).then((res) => {
						if (res.code !== 0) {
							this.loading = false;
							return this.$message.error(res.msg);
						}
						this.$message({
							message: this.$t("prompt.success"),
							type: "success",
							duration: 500,
							onClose: () => {
								this.loading = false;
								this.goBack();
							}
						});
					});
				});
			},
			goBack() {
				const activeTabName = this.store.state.activeTabName;
				const tabs = this.store.state.tabs;
				let index = findIndex(tabs, (x) => x.value === activeTabName);
				this.store.state.tabs.splice(index, 1);
				this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
				this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
				this.$router.push(this.store.state.activeTabName);
			},
			updateClosedTabs(closedTabs : any[], isTransform = true) {
				if (isTransform) {
					closedTabs = closedTabs.map((x) => x.value);
				}
				this.store.dispatch({
					type: "updateState",
					payload: {
						closedTabs
					}
				});
			}
		}
	});
</script>
<style lang="scss" scoped>
	.muodule-header {
		margin: 10px 0 20px 0;
		font-size: 15px;
		font-weight: 700;
		display: flex;
		align-items: center;
	}

	.module-header-block {
		width: 5px;
		height: 20px;
		margin-right: 20px;
		// 主题色
		background: var(--color-primary);
	}

	.el-checkbox {
		width: 60px;
	}
</style>