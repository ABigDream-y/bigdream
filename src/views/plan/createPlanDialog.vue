<template>
	<el-dialog v-model="visible" title="生成教学计划目录">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef">
			<el-form-item label="生成范围">
				<el-radio-group v-model="radio" class="ml-4" @change="handleOptionChange">
					<el-radio :label="1">全部</el-radio>
					<el-radio :label="2">指定</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="指定范围" v-if="showRange">
				<el-col :span="6" style="margin-right: 10px;">
					<el-form-item prop="instituteNo">
						<ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute"
							@change="instituteChange" placeholder="学院" nodekey="number"
							showType="select"></ren-institute-tree>
					</el-form-item>
				</el-col>

				<el-col :span="5" style="margin-right: 10px;">
					<el-form-item prop="major">
						<el-select v-model="dataForm.major" placeholder="专业">
							<el-option @click="majorChange(item)" v-for="(item,index) in majorList" :key="index"
								:value="item.name" :label="item.name"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="5">
					<el-form-item prop="grade">
						<el-select v-model="dataForm.grade" placeholder="年级">
							<el-option v-for="(item, index) in gradeList" :key="index" :value="item.name"
								:label="item.name"></el-option>
						</el-select>
						<!-- <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select> -->
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="开课学年" prop="startGrade">
				<ren-select v-model="dataForm.startGrade" dict-type="school_year" placeholder="开始学年"></ren-select>
			</el-form-item>
			<el-form-item label="开课学期" prop="startTerm">
				<ren-select v-model="dataForm.startTerm" dict-type="term" placeholder="开始学期"></ren-select>
			</el-form-item>
			<!-- <div>注意：已生成过的教学计划目录再次生成不会覆盖原目录。</div> -->
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hideDialog()">取消</el-button>
				<el-button type="primary" @click="dataFormSubmitHandle()">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import { ElNotification } from 'element-plus';
	import { h } from 'vue';
	export default defineComponent({
		setup() {
			return reactive({
				visible: false,
				radio: 1, // 1 全部， 2 指定
				showRange: false,
				createGenerateDirectoryURL: "/plan/planrecord/generateDirectory",
				majorList: [] as IObject[],
				gradeList: [] as IObject[],
				dataForm: {
					id: "",
					startTerm: "",
					startGrade: "",
					institute: "",
					instituteNo: "",
					grade: "",
					major: "",
					planId: ""
				}
			});
		},
		computed: {
			dataRule() {
				return {
					instituteNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					major: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					grade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					startGrade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					startTerm: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		props: {

		},
		methods: {
			showDialog() {
				this.visible = true;
			},
			hideDialog() {
				this.visible = false;
				this.clear();
			},
			handleOptionChange(val) {
				if (this.radio == 1) {
					this.showRange = false;
					this.clear();
				} else {
					this.showRange = true;
				}
			},
			clear() {
				this.dataForm.instituteNo = "";
				this.dataForm.institute = "";
				this.dataForm.grade = "";
				this.dataForm.major = "";
				this.majorList = [];
				this.gradeList = [];
			},
			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.instituteNo = data.number;
					this.dataForm.institute = data.name;
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.majorList = data.children;
				} else {
					this.dataForm.instituteNo = "";
					this.dataForm.institute = "";
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.majorList = [];
				}
			},
			// 专业变更
			majorChange(data : IObject) {
				this.dataForm.grade = "";
				this.gradeList = data.children;
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/caselist/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
				});
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					console.log(JSON.stringify(this.dataForm));
					// 请求后台接口传递数据
					if (this.radio == 1) { // 全部
						baseService.get(
							this.createGenerateDirectoryURL,
							{ startTerm: this.dataForm.startTerm, startGrade: this.dataForm.startGrade }
						).then((res) => {
							console.log(res);
							if (res.code !== 0) {
								// 关闭dialog
								this.hideDialog();
								return this.$message.error(res.msg);
							}
							console.log(res.data.importResult.length);
							if (res.data.importResult.length <= 0) {
								this.$message({
									message: "生成教学计划目录完成",
									type: "success",
									duration: 500,
									onClose: () => {
										// 关闭dialog
										this.hideDialog();
										// 页面刷新
										this.$emit("refreshDataList");
									}
								});
							} else {
								for (var i = 0; i < res.data.importResult.length; i++) {
									var offset = i * 100;
									console.log(offset);
									this.tips('提示', 'warning', res.data.importResult[i].msg, offset, offset);
								}
							}
						});
					} else { // 指定
						baseService.get(
							this.createGenerateDirectoryURL,
							{
								startTerm: this.dataForm.startTerm,
								startGrade: this.dataForm.startGrade,
								instituteNo: this.dataForm.instituteNo,
								grade: this.dataForm.grade,
								major: this.dataForm.major
							}
						).then((res) => {
							console.log(res);
							if (res.code !== 0) {
								// 关闭dialog
								this.hideDialog();
								return this.$message.error(res.msg);
							}
							console.log(res.data.importResult.length);
							if (res.data.importResult.length <= 0) {
								this.$message({
									message: "生成教学计划目录完成",
									type: "success",
									duration: 500,
									onClose: () => {
										// 关闭dialog
										this.hideDialog();
										// 页面刷新
										this.$emit("refreshDataList");
									}
								});
							} else {
								for (var i = 0; i < res.data.importResult.length; i++) {
									var offset = i * 100;
									console.log(offset);
									this.tips('提示', 'warning', res.data.importResult[i].msg, offset, offset);
								}
							}
						});
					}
				});
			},
			// 提示
			tips(title, type, msg, offset, delay) {
				setTimeout(()=>{
					ElNotification({
						title: title,
						message: h('i', { style: 'color: teal' }, msg),
						offset: offset + 10,
						type: type
					});
				}, delay);
			}
		},
		watch: {

		}
	});
</script>
<style scoped>
	.el-button--text {
		margin-right: 15px;
	}

	.el-select {
		width: 300px;
	}

	.el-input {
		width: 300px;
	}

	.dialog-footer button:first-child {
		margin-right: 10px;
	}
</style>