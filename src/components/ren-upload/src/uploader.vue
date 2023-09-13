<style scoped>
	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	:deep(.upload-image .el-tabs__nav) {
		width: 100%;
		text-align: center;
	}

	:deep(.upload-image .el-tabs__nav>div) {
		width: 33.3% !important;
	}

	.upload-component .classification-boxs {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
		padding-top: 20px;
	}

	.upload-temp {
		padding: 0 20px;
	}

	.upload-label {
		font-size: 14px;
		line-height: 35px;
	}

	.user-img {
		margin-top: 15px;
	}

	.user-img-temp {
		display: flex;
		flex-wrap: wrap;
		padding: 10px 0;
	}

	.img-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 10px;
	}

	.img-temp {
		position: relative;
		width: 100px;
		height: 100px;
		margin: 0 10px;
		cursor: pointer;
		box-sizing: border-box;
		border: 2px solid #fff;
	}

	.img-temp>.img-info {
		width: 100%;
		position: absolute;
		bottom: 0;
		text-align: center;
		color: #fff;
		font-weight: 400;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.pickNum {
		position: absolute;
		text-align: center;
		color: #fff;
		font-weight: 500;
		top: 2px;
		right: 0px;
		z-index: 10;
	}

	.img-temp>img {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.picked {
		border: 2px solid #17b3a3;
	}

	.picked::after {
		position: absolute;
		top: 0;
		right: 0;
		display: block;
		content: ' ';
		border-top: 30px solid #17b3a3;
		border-left: 30px solid transparent;
		z-index: 9;
	}

	.deleteItem {
		border: 2px solid red;
	}

	.deleteItem::after {
		position: absolute;
		top: 0;
		right: 0;
		display: block;
		content: ' ';
		border-top: 30px solid red;
		border-left: 30px solid transparent;
		z-index: 9;
	}

	.img-name-temp {
		width: 100px;
		overflow: hidden;
		display: flex;
		flex-wrap: nowrap;
	}

	.img-name {
		max-width: 70px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	:deep(.upload-image .el-dialog__body) {
		padding: 20px !important;
	}

	.upload-image .el-dialog__body {
		padding: 20px !important;
	}

	:deep(.upload-image .el-dialog__header) {
		padding: 0;
	}

	:deep(.upload-image .el-dialog__headerbtn) {
		top: 10px !important;
		right: 10px !important;
	}

	:deep(.upload-image .el-tabs__header) {
		margin: 0;
	}


	/* 20210125 */
	.user-img .vue-waterfall-easy-container {
		height: 300px;
	}

	:deep(.user-img .vue-waterfall-easy-container .vue-waterfall-easy) {
		margin-left: -470px !important;
	}

	:deep(.user-img .vue-waterfall-easy-container .vue-waterfall-easy a.img-wraper>img) {
		cursor: pointer;
	}

	:deep(.user-img .vue-waterfall-easy-scroll::-webkit-scrollbar) {
		width: 0 !important
	}

	:deep(.user-img .vue-waterfall-easy-scroll) {
		-ms-overflow-style: none;
	}

	:deep(.user-img .vue-waterfall-easy-scroll) {
		overflow: -moz-scrollbars-none;
	}

	:deep(.user-img .vue-waterfall-easy-scroll .img-box) {
		position: relative;
	}

	.user-img .vue-waterfall-easy-container .img-info {
		position: absolute;
		top: 10px;
		width: 222px;
		height: 100px;
		cursor: pointer;
		box-sizing: border-box;
	}

	:deep(.user-img .vue-waterfall-easy-container .vue-waterfall-easy .img-info .pickNum) {
		position: absolute;
		text-align: center;
		color: #fff;
		font-weight: 500;
		top: -2px;
		right: 2px;
		z-index: 10;
	}

	:deep(.user-img .vue-waterfall-easy-container .vue-waterfall-easy .picked) {
		border: 2px solid #17b3a3;
	}

	:deep(.user-img .vue-waterfall-easy-container .vue-waterfall-easy .picked::after) {
		position: absolute;
		top: 0;
		right: 0;
		display: block;
		content: ' ';
		border-top: 30px solid #17b3a3;
		border-left: 30px solid transparent;
		z-index: 9;
	}

	/* 20210125 */

	/* 20210205 */
	.waterfall-loading {
		position: absolute;
		width: 100%;
		height: 300px;
		z-index: 100000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.waterfall-loading .loading-img {
		margin: 0 auto;
	}

	/* 20210205 */

	/* 20210224 */
	.vue-waterfall-container {
		height: 300px;
		width: 100%;
		position: relative;
	}

	.vue-waterfall-container .vue-waterfall {
		width: 100%;
		overflow-y: auto;
		position: relative;
		height: 300px;
	}

	.vue-waterfall-container .vue-waterfall .vue-waterfall-column {
		width: 25%;
		float: left;
	}

	.vue-waterfall-container .pbImgBox {
		width: 100%;
		padding: 10px;
		position: relative;
		cursor: pointer;
	}

	.vue-waterfall-container .pbImgBox .pickNum {
		position: absolute;
		text-align: center;
		color: #fff;
		font-weight: 500;
		top: 9px;
		right: 13px;
		z-index: 10;
	}

	.vue-waterfall-container .pbImgBox .picked {
		border: 2px solid #17b3a3;
	}

	.vue-waterfall-container .pbImgBox .picked::after {
		position: absolute;
		top: 10px;
		right: 10px;
		display: block;
		content: ' ';
		border-top: 30px solid #17b3a3;
		border-left: 30px solid transparent;
		z-index: 9;
	}
</style>

<template>
	<el-dialog custom-class="upload-image" append-to-body destroy-on-close :close-on-click-modal="false" lock-scroll
		v-model="visible" width="1000px" top="2vh">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="我的图片" name="first">
				<div class="user-img">
					<div style="margin-bottom: 10px;margin-top: 20px;">
						<el-button @click="activeName = 'second'" size="mini" type="primary">上传图片</el-button>
						<el-button @click="handleDelete" size="mini" type="danger"
							v-if="!deleteFlag && imgList.length > 0">批量删除</el-button>
						<el-button @click="cancelDelete" size="mini" type="danger"
							v-if="deleteFlag && imgList.length > 0">取消</el-button>
					</div>
					<div class="user-img-temp">
						<div class="img-container" v-for="(item, index) in imgList" :key="index">
							<div class="img-temp"
								:class="[{ picked: item.isPick && deleteFlag == false }, { deleteItem: deleteFlag && item.isPick }]"
								@click="pickImg(item, index,0)">
								<img :src="item.url" mode="aspectFill" />
								<!-- <div class="img-info">{{ resolveSize(item.fileSize) }}</div> -->
								<div class="pickNum" v-if="item.isPick && uploadType == 1 && deleteFlag == false">
									{{ item.pickIndex }}
								</div>
								<div class="pickNum" v-if="item.isPick && uploadType == 0 && deleteFlag == false">
									<el-icon>
										<Check />
									</el-icon>
								</div>

								<div class="pickNum" v-if="item.isPick && deleteFlag">
									<el-icon>
										<Check />
									</el-icon>
								</div>
							</div>
							<div class="img-name-temp" :title="item.fileName">
								<!-- <span class="img-name">{{ resolveName(item.fileName) }}</span> -->
								<!-- <span class="img-suffix">{{ resolveSuffix(item.fileName) }}</span> -->
							</div>
						</div>
					</div>
					<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
						:current-page="pageIndex" :page-sizes="[16]" :page-size="pageSize" :total="totalPage"
						layout="total, sizes, prev, pager, next, jumper"></el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="上传图片" name="second">
				<div class="upload-temp" style="padding-top: 20px;">
					<!-- <label class="upload-label">本地图片上传（一次最多5张）</label> -->
					<el-upload :action="''" :auto-upload="false" :multiple="false" :limit="1" list-type="picture-card"
						:file-list="uploadImgList" :on-remove="handleRemoveDetails"
						:on-exceed="handleExceed" :on-change="handleCheck" ref="upload">
						<el-icon v-if="uploadImgList.length < 5">
							<Plus />
						</el-icon>
					</el-upload>
					<el-dialog :visible.sync="dialogDetailsVisible"><img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
				</div>
			</el-tab-pane>
			<el-tab-pane label="图库中心" name="third">
				<div class="user-img" style="position: relative;" v-loading="waterfallLoading">
					<div class="waterfall-loading" v-if="waterfallLoading">
						<!-- <img class="loading-img" src="@/assets/img/keluyun-loading.png" /> -->
					</div>
					<div class="vue-waterfall-container">
						<div class="vue-waterfall">
							<div class="vue-waterfall-column" ref="imgBox1">
								<div class="pbImgBox" v-for="(item,index) in dataList1" :key="index"
									@click="pickImg(item, index,1)">
									<div :class="[{ picked: item.isPick}]">
										<!-- <el-image style="width: 100%;" :src="item.url" lazy></el-image> -->
										<img style="width: 100%;" :lazy-src="item.url" :src="item.url" />
										<div class="pickNum" v-if="item.isPick && uploadType == 1">
											{{ item.pickIndex }}
										</div>
										<div class="pickNum" v-if="item.isPick && uploadType == 0">
											<el-icon>
												<Check />
											</el-icon>
										</div>
									</div>
								</div>
							</div>
							<div class="vue-waterfall-column" ref="imgBox2">
								<div class="pbImgBox" v-for="(item,index) in dataList2" :key="index"
									@click="pickImg(item, index,2)">
									<div :class="[{ picked: item.isPick}]">
										<!-- <el-image style="width: 100%;" :src="item.url" lazy></el-image> -->
										<img style="width: 100%;" :lazy-src="item.url" :src="item.url" />
										<div class="pickNum" v-if="item.isPick && uploadType == 1">
											{{ item.pickIndex }}
										</div>
										<div class="pickNum" v-if="item.isPick && uploadType == 0">
											<el-icon>
												<Check />
											</el-icon>
										</div>
									</div>
								</div>
							</div>
							<div class="vue-waterfall-column" ref="imgBox3">
								<div class="pbImgBox" v-for="(item,index) in dataList3" :key="index"
									@click="pickImg(item, index,3)">
									<div :class="[{ picked: item.isPick}]">
										<!-- <el-image style="width: 100%;" :src="item.url" lazy></el-image> -->
										<img style="width: 100%;" :lazy-src="item.url" :src="item.url" />
										<div class="pickNum" v-if="item.isPick && uploadType == 1">
											{{ item.pickIndex }}
										</div>
										<div class="pickNum" v-if="item.isPick && uploadType == 0">
											<el-icon>
												<Check />
											</el-icon>
										</div>
									</div>
								</div>
							</div>
							<div class="vue-waterfall-column" ref="imgBox4">
								<div class="pbImgBox" v-for="(item,index) in dataList4" :key="index"
									@click="pickImg(item, index,4)">
									<div :class="[{ picked: item.isPick}]">
										<!-- <el-image style="width: 100%;" :src="item.url" lazy></el-image> -->
										<img style="width: 100%;" :lazy-src="item.url" :src="item.url" />
										<div class="pickNum" v-if="item.isPick && uploadType == 1">
											{{ item.pickIndex }}
										</div>
										<div class="pickNum" v-if="item.isPick && uploadType == 0">
											<el-icon>
												<Check />
											</el-icon>
										</div>
									</div>
								</div>
							</div>

							<div style="text-align: center;display: flex;align-items: center;justify-content: center;height: 300px;"
								v-if="dataList1.length == 0 && dataList2.length == 0 && dataList3.length == 0 && dataList4.length == 0">
								<el-empty description="暂无数据" :image-size="100"></el-empty>
							</div>
						</div>
					</div>
					<div>
						<!-- <el-empty description="暂无数据"></el-empty> -->
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>

		<div class="dialog-footer">
			<div v-if="activeName == 'third'"
				style="flex-grow: 1;text-align: center;display: flex;justify-content: center;">
				<el-pagination @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[16]"
					:page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper"></el-pagination>
			</div>
			<el-button type="primary" @click="submit()" :loading="loadingBtn" v-if="deleteFlag == false">确定</el-button>
		</div>
		<div class="dialog-footer">
			<el-button type="danger" @click="deleteResource" :loading="loadingBtn" v-if="deleteFlag">删除资源</el-button>
		</div>
	</el-dialog>
</template>

<script lang="ts">
	import {
		getToken
	} from "@/utils/cache";
	import app from "@/constants/app";
	import baseService from "@/service/baseService";
	import {
		IObject
	} from '@/types/interface';
	import {
		reactive,
		defineComponent
	} from "vue";
	import {
		useStore
	} from "vuex";
	export default defineComponent({
		name: "Uploader",
		setup(props) {
			const store = useStore();
			return reactive({
				uploadUrl: `${app.api}/sys/oss/upload?token=${getToken()}`,
				dataList1: [],
				dataList2: [],
				dataList3: [],
				dataList4: [],
				visible: false,
				loadingBtn: false,
				imgList: [],
				selectUrl: '',
				selectList: [],
				dialogDetailsVisible: false,
				dialogImageUrl: '',
				uploadType: 0, //0单选 1 多选
				activeName: 'first',
				pageIndex: 1,
				pageSize: 16,
				totalPage: 0,
				url: '',
				uploadImgList: [],
				uploadImgUrl: [], //上传后获得的cos地址
				multipleSelect: [],
				multipleSelectIds: [],
				// 单选
				imgPickUrl: null,
				curImgPickIndex: -1,
				oldImgPickType: null,
				deleteFlag: false,
				deleteIds: [],
				// 图库中心
				loadingStatus: 0,
				imageLoading: false,
				imageList: [],
				labelList: [],
				labelName: '',
				labelId: null,
				isOpen: true,
				waterfallLoading: true,
				loadingDotCount: 0,
				isFinished: false,
				dividingLineId: ''
			});
		},
		methods: {
			init(type: any, activeName: string) {
				this.uploadUrl = `${app.api}/sys/oss/upload?token=${getToken()}`
				this.imgList = []
				this.imageList = []
				this.visible = true;
				this.uploadType = type;
				this.activeName = activeName || 'first';

				this.$nextTick(() => {
					console.log('activeName', activeName)
					if (activeName && activeName != undefined && activeName != 'undefined' && activeName != null && activeName != '') {
						this.activeName = activeName;
						if (this.activeName == 'third') {
							this.pageIndex = 1
							this.pageSize = 50
							this.waterfallLoading = true
							this.imageList = []

							this.getGalleryCenter()
						} else {
							this.pageIndex = 1
							this.getDataList();
						}
					} else {
						this.activeName = 'first';
						this.pageIndex = 1
						this.pageSize = 16
						this.getDataList();
					}
					// if (this.$refs.upload != undefined) {
					// 	this.$refs.upload.clearFiles();
					// }
				})


			},
			getDataList() {
				this.multipleSelect = [];
				this.multipleSelectIds = [];
				this.imgPickUrl = null;
				this.curImgPickIndex = -1;

				baseService.get("/sys/oss/page", {
					page: this.pageIndex,
					limit: this.pageSize,
					fileType: 1,
				}).then((res) => {
					// if (res.code !== 0) {
					// 	return this.$message.error(res.msg);
					// }
					let data = res;
					console.log(data, '初始化列表---我的');
					if (data && data.code === 0) {
						this.imgList = data.data.list;
						this.imgList.forEach((item: IObject) => {
							item.isPick = false;
						});
						this.totalPage = data.data.total;

						if (this.selectUrl !== '' && this.selectUrl !== null) {
							this.imgList.forEach((iItem: IObject, iIndex: number) => {
								if (iItem.url == this.selectUrl) {
									iItem.isPick = true;
									this.curImgPickIndex = iIndex;
								}
							});
						}
					} else {
						this.imgList = [];
						this.totalPage = 0;
					}

				});


			},
			getGalleryCenter() {
				console.log('labelid', this.labelId)

				this.loadingStatus = 0
				this.dataList1 = []
				this.dataList2 = []
				this.dataList3 = []
				this.dataList4 = []
				this.multipleSelect = [];
				this.multipleSelectIds = [];
				this.imgPickUrl = null;
				this.curImgPickIndex = -1;
				this.oldImgPickType = null;
				this.imageLoading = true
				this.isFinished = false
				if (this.labelId == this.dividingLineId) {
					this.pageSize = 60
				}

				baseService.get("/common/repository/page", {
					page: this.pageIndex,
					limit: this.pageSize
				}).then((res) => {
					console.log(res, '初始化列表---公共');
					if (res.code !== 0) {
						// return this.$message.error(res.msg);
					}
					// this.dataForm = res.data;
					let data = res;

					this.waterfallLoading = false
					if (data && data.code === 0) {
						this.imageLoading = false
						// this.imageList = this.imageList.concat(data.page.list)
						this.imageList = data.data.list
						console.log('imageList', this.imageList)
						this.imageList.forEach((item: IObject) => {
							item.isPick = false;
						});
						this.totalPage = data.data.total;
						this.mountMenu(0);

					} else {
						this.imageLoading = false
						this.imageList = [];
						this.totalPage = 0;
					}

				});
			},
			mountMenu(arg: any) {
				var temp = this.imageList;
				var index = arg || 0;
				var refName = this.selectCol();
				if (temp.length > index) {
					this[refName].push(this.imageList[index])
					this.$nextTick(() => {
						this.mountMenu(index + 1)
					})
				}
			},
			getHeight(ref: any) {
				return this.$refs[ref] ? this.$refs[ref].offsetHeight : 0;
			},
			selectCol() {
				// var getHeight = (ref: any) => {
				// 	return this.$refs[ref] ? this.$refs[ref].offsetHeight:0;
				// }
				var height1 = this.getHeight('imgBox1');
				var height2 = this.getHeight('imgBox2');
				var height3 = this.getHeight('imgBox3');
				var height4 = this.getHeight('imgBox4');
				switch (Math.min(height1, height2, height3, height4)) {
					case height1:
						return 'dataList1';
					case height2:
						return 'dataList2';
					case height3:
						return 'dataList3';
					case height4:
						return 'dataList4';
				}
			},
			getDataByLabel(labelId: any) {
				this.labelId = labelId
				this.imageList = []
				this.pageIndex = 1
				this.totalPage = 0
				this.waterfallLoading = true
				this.getGalleryCenter()
			},
			handleClick(tab: any, event: any) {
				console.log(tab.index);
				if (tab.index == 0) {
					this.pageIndex = 1;
					this.pageSize = 16;
					this.getDataList()
				}
				if (tab.index == 2) {
					this.pageIndex = 1;
					this.pageSize = 50;
					this.waterfallLoading = true;
					this.imageList = []
					this.getGalleryCenter()
				}

			},
			// 每页数
			sizeChangeHandle(val: number) {
				this.pageSize = val;
				this.pageIndex = 1;
				this.getDataList();
			},
			// 当前页
			currentChangeHandle(val: number) {
				this.pageIndex = val;
				if (this.activeName == 'third') {
					this.getGalleryCenter()
				} else {
					this.getDataList();
				}
			},
			// 上传之前
			beforeUploadHandle(file: IObject) {
				// if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !==
				// 	'image/gif') {
				// 	this.$message.error('只支持jpg、png、gif格式的图片！');
				// 	return false;
				// }
			},
			handleExceed(files: IObject, fileList: any) {
				this.$message.error('已超出最大上传限制');
			},
			handleRemoveDetails(file: IObject, fileList: any) {
				console.log(file, fileList, '删除');
				this.uploadImgList = fileList;
			},
			handleDetailsPictureCardPreview(file: IObject) {
				this.dialogImageUrl = file.url;
				this.dialogDetailsVisible = true;
			},
			// 上传成功
			successHandle(response: IObject, file: IObject, fileList: any) {
				if (response && response.code === 0) {
					file.url = response.url;
					this.uploadImgList = fileList;
				} else {
					this.$message.error(response.msg);
				}
			},
			handleCheck(file: IObject, fileList: any) {
				console.log('file',file);
				let that = this;
				if(file.raw) {
					if (file.raw.type !== 'image/jpg' && file.raw.type !== 'image/jpeg' && file.raw.type !==
						'image/png' &&
						file.raw.type !==
						'image/gif') {
						that.$message.error('图片只能是jpg/png格式!');
						return;
					}
					
					that.uploadImgList = fileList;
				}
				
				// if (file.raw.size > 1024 * 1024 * 2) {
				// 	that.$message.error('上传文件大小不能超过 2MB!');
				// 	return;
				// }
				
			},
			handleDelete() {
				this.deleteFlag = true;
				this.imgList.forEach((item: IObject) => {
					item.isPick = false
				})
			},
			cancelDelete() {
				this.deleteFlag = false;
				this.deleteIds = [];
				this.imgList.forEach((item: IObject) => {
					item.isPick = false
				})
				this.getDataList();
			},
			pickImg(item: IObject, idx: number, type: any) {
				let oldImgPickIndex = this.curImgPickIndex
				let oldType = null
				if (this.oldImgPickType != null) {
					oldType = this.oldImgPickType
					this.oldImgPickType = type
				} else {
					oldType = null
					this.oldImgPickType = type
				}
				// console.log('pickIndex',item,idx)
				var that = this;
				if (!this.deleteFlag) {
					if (this.uploadType == 1) {
						// 多选
						if (this.multipleSelect.length == 5 && item.isPick == false) {
							return;
						}
						item.isPick = !item.isPick;
						if (item.isPick) {
							// 增加图片
							if (this.activeName == 'first') {
								this.multipleSelect.push(item.url);
							}

							if (this.activeName == 'third') {
								this.multipleSelect.push(item.url);
							}

							this.multipleSelectIds.push(item.id);
							item.pickIndex = this.multipleSelect.length;
							// console.log(this.multipleSelect, '选择的');
						} else {
							// 删除图片
							let curindex = item.pickIndex - 1;
							this.multipleSelect.splice(curindex, 1);
							this.multipleSelectIds.splice(curindex, 1);
							// 重新排序
							this.imgList.forEach((item: IObject, index: number) => {
								if (item.pickIndex != undefined && item.pickIndex != null) {
									let newIndex = that.multipleSelectIds.indexOf(item.id) + 1;
									item.pickIndex = newIndex;
								}
							});
						}
						this.$forceUpdate();
					} else {
						//单选
						if (!item.isPick) {
							item.isPick = !item.isPick;
							if (this.activeName == 'first') {
								this.imgPickUrl = item.url;
							}

							if (this.activeName == 'third') {
								this.imgPickUrl = item.url;
							}
							// console.log('curImgPickIndex',this.curImgPickIndex)
							// this.imgPickUrl = item.url;
							// 删除原来的
							if (this.curImgPickIndex != -1) {
								if (this.activeName == 'third') {
									if (oldType == 1) {
										this.dataList1[oldImgPickIndex].isPick = false
									} else if (oldType == 2) {
										this.dataList2[oldImgPickIndex].isPick = false
									} else if (oldType == 3) {
										this.dataList3[oldImgPickIndex].isPick = false
									} else if (oldType == 4) {
										this.dataList4[oldImgPickIndex].isPick = false
									}
									// this.imageList[this.curImgPickIndex].isPick = false;
								} else {
									this.imgList[this.curImgPickIndex].isPick = false;
								}
							}
							// 赋值新的index
							this.curImgPickIndex = idx;
							// console.log( this.imgPickUrl, this.curImgPickIndex)
							this.$forceUpdate();
						} else {
							item.isPick = !item.isPick;
							this.imgPickUrl = null;
							this.curImgPickIndex = -1;
							this.$forceUpdate();
						}
					}
				} else {
					// 多选--删除
					item.isPick = !item.isPick;
					if (item.isPick) {
						this.deleteIds.push(item.id);
						item.pickIndex = this.deleteIds.length;
						console.log(this.deleteIds, '选择的');
					} else {
						// 取消选择
						let curindex = item.pickIndex - 1;
						this.deleteIds.splice(curindex, 1);
						// 重新排序
						this.imgList.forEach((item: IObject, index: number) => {
							if (item.pickIndex != undefined && item.pickIndex != null) {
								let newIndex = that.deleteIds.indexOf(item.id) + 1;
								item.pickIndex = newIndex;
							}
						});
					}
					this.$forceUpdate();
				}
			},
			submit() {
				var that = this;
				// 上传图片
				if (this.activeName == 'second') {
					let params = new FormData();

					this.uploadImgList.forEach((item: IObject) => {
						params.append('file', item.raw);
					});
					this.loadingBtn = true;

					baseService.post(this.uploadUrl, params, {
						'Content-Type': 'multipart/form-data'
					}).then((res) => {
						console.log('图片上传', res)
						if (res.data.code == 0) {
							that.$nextTick(() => {
								that.visible = false;
								that.loadingBtn = false;
								that.$emit('getImgUrl', [res.data.data.src]);
							});
						} else {
							that.loadingBtn = false;
						}
					}).catch(()=>{
						that.loadingBtn = false;
						that.$message.error('网络请求异常!');
					});
				} else {
					// 选择已有的图片
					if (this.uploadType == 0) {
						// 单张
						that.$nextTick(() => {
							let img = [];
							img.push(that.imgPickUrl);
							that.$emit('getImgUrl', img);
							
							that.visible = false;
						});
					} else if (this.uploadType == 1) {
						// 多张
						that.$nextTick(() => {
							
							that.$emit('getImgUrl', that.multipleSelect);
							
							that.visible = false;
						});
					}
				}
			},
			resolveSize(limit: number) {
				var size = '';
				if (limit < 0.1 * 1024) {
					//小于0.1KB，则转化成B
					size = limit.toFixed(2) + 'B';
				} else if (limit < 0.1 * 1024 * 1024) {
					//小于0.1MB，则转化成KB
					size = (limit / 1024).toFixed(2) + 'KB';
				} else if (limit < 0.1 * 1024 * 1024 * 1024) {
					//小于0.1GB，则转化成MB
					size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
				} else {
					//其他转化成GB
					size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
				}

				var sizeStr = size + ''; //转成字符串
				var index = sizeStr.indexOf('.'); //获取小数点处的索引
				var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
				if (dou == '00') {
					//判断后两位是否为00，如果是则删除00
					return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
				}
				return size;
			},
			resolveName(name: string) {
				return name.substring(0, name.lastIndexOf('.'));
			},
			resolveSuffix(name: string) {
				var suffix = name.substring(name.lastIndexOf('.') + 1);
				suffix = suffix.toLowerCase(); //都改成小写
				return '.' + suffix;
			},
			closeHandle() {
				this.visible = false;
				this.$emit('close');
			},
			deleteResource() {
				console.log(this.deleteIds);
				if (this.deleteIds.length > 0) {
					this.$confirm(`确定删除这些资源，删除后不可恢复?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {

						baseService.delete('/sys/oss', this.deleteIds)
							.then((res) => {
								if (res && res.code === 0) {
									this.$message({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.deleteIds = [];
											this.deleteFlag = false;
											this.getDataList();
										}
									});
								} else {
									this.$message.error(res.msg);
								}

							});
					});
				} else {
					this.$message.error('请选择要删除的资源！');
				}
			},
		}
	});
</script>
