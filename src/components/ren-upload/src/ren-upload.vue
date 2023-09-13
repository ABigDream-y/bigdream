<style scoped>
	.avatar-uploader {
		width: 375px;
		height: 150px;
	}

	.square-uploader {
		width: 150px;
		height: 150px;
	}

	:deep(.avatar-uploader .el-upload) {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 375px;
		height: 150px;
	}

	:deep(.square-uploader .el-upload) {
		width: 150px;
	}

	:deep(.avatar-uploader .el-upload:hover) {
		border-color: #409EFF;
	}

	:deep(.avatar-uploader-icon) {
		font-size: 28px;
		color: #8c939d;
		width: 375px;
		height: 150px;
		line-height: 150px;
		text-align: center;
	}

	:deep(.square-uploader .avatar-uploader-icon) {
		width: 150px;
	}

	:deep(.avatar) {
		width: 375px;
		height: 150px;
		display: block;
		object-fit: contain;
	}

	:deep(.square-uploader .avatar) {
		width: 150px;
	}
</style>

<template>
	<div>
		<template v-if="fileType == 'image'">
			<el-button v-if="showType == 'button'" :size="buttonSize" :type="buttonType"
				@click="selectUploader()">{{buttonName}}</el-button>
			<div v-else class="ren-upload" style="display: flex;align-items: center;">
				<div @click="selectUploader()">
					<el-upload disabled class="avatar-uploader" :class="square ? 'square-uploader':''"
						:action="uploadUrl" :show-file-list="false">
						<img v-if="value" :src="value" class="avatar" :style="{width:imgWidth + 'px'}">
						<el-icon v-else class="avatar-uploader-icon">
							<plus />
						</el-icon>
					</el-upload>
				</div>
				<div style="margin-left: 15px;" v-if="proportion">
					图片宽高比例为{{proportion}}左右即可
				</div>
			</div>
		</template>

		<uploader v-if="uploaderVisible" ref="uploader" @getImgUrl="confirmUploader"></uploader>

	</div>

</template>
<script lang="ts">
	import {
		getToken
	} from "@/utils/cache";
	import app from "@/constants/app";
	import uploader from './uploader.vue';
	import {
		computed,
		reactive,
		defineComponent
	} from "vue";
	import {
		getDictDataList
	} from "@/utils/utils";
	import {
		useStore
	} from "vuex";
	export default defineComponent({
		name: "RenUpload",
		props: {
			modelValue: String,
			dictType: String,
			placeholder: String,
			// 图片比例
			proportion: String,
			// uploadUrl: {
			// 	type: String,
			// 	default: `${app.api}/sys/oss/upload?token=${getToken()}`
			// },
			square: {
				type: Boolean,
				default: false
			},
			// 文件类型
			fileType: {
				type: String,
				default: "image"
			},
			// 单选0 多选1
			uploaderType: {
				type: Number,
				default: 0
			},
			//图片宽度
			imgWidth: {
				type: Number,
				default: 150
			},
			//
			activeName: {
				type: String,
				default: ""
			},
			//显示类型 默认卡片 
			showType: {
				type: String,
				default: ""
			},
			//按钮显示名称
			buttonName: {
				type: String,
				default: ""
			},
			//按钮类型
			buttonType: {
				type: String,
				default: "primary"
			},
			//按钮大小
			buttonSize: {
				type: String,
				default: ""
			}
		},
		components: {
			uploader
			// UploaderVideo
		},
		setup(props) {
			const store = useStore();
			return reactive({
				newValue: "",
				uploaderVisible: false,
				uploadUrl: `${app.api}/sys/oss/upload?token=${getToken()}`,
				// value: computed(() => `${props.modelValue}`),
				value: "",
				dataList: getDictDataList(store.state.dicts, props.dictType)
			});
		},
		watch: {
			value(val) {
				this.newValue = val ? val : "";
			}
		},
		methods: {
			selectUploader() {
				this.uploaderVisible = true;
				this.$nextTick(() => {
					this.$refs.uploader.init(this.uploaderType, this.activeName)
				})
			},
			confirmUploader(data : any) {
				console.log('data=======', data)
				if (data && data[0] && this.uploaderType == 0) {
					this.value = data[0];
					let newValue = data[0];
					console.log('data=======', newValue)
					this.$emit('update:modelValue', newValue)
					// this.$emit('input',this.newValue)
				} else if (this.uploaderType == 1 && data.length > 0) {
					this.value = data;
					let newValue = data;

					console.log('data=======', newValue)
					this.$emit('update:modelValue', newValue)
					// this.$emit('input',this.newValue)
				}
			},
		}
	});
</script>