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
			<div class="ren-upload" style="display: flex;align-items: center;">
				<div>
					<el-upload :disabled="disabled" class="avatar-uploader" :class="square ? 'square-uploader':''" :action="uploadUrl" :show-file-list="false" :on-success="successHandle"
						:before-upload="beforeUploadHandle" @change="changeHandler">
						<img id="avatar" v-if="value" :src="src || modelValue" class="avatar">
						<el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
					</el-upload>
				</div>
				<div style="margin-left: 15px;" v-if="proportion">
					图片宽高比例为{{proportion}}左右即可
				</div>
			</div>
		</template>
		
		
		
	</div>
	
</template>
<script lang="ts">
	import {
		getToken
	} from "@/utils/cache";
	import app from "@/constants/app";
	import {
		IObject
	} from "@/types/interface";
	import uploader from './uploader.vue';
	import {
		computed,
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
			isFocus: {
				type: Boolean,
				default: false
			},
			cover: String,
			modelValue: String,
			dictType: String,
			placeholder: String,
			// 图片比例
			proportion: String,
			// uploadUrl: {
			// 	type: String,
			// 	default: `${app.api}/sys/oss/upload?token=${getToken()}`
			// },
			square:{
				type:Boolean,
				default:false
			},
			// 文件类型
			fileType:{
				type:String,
				default:"image"
			},
			// 单选0 多选1
			uploaderType:{
				type:[Number,String],
				default:0
			},
			disabled:{
				type:Boolean,
				default:false
			}
		},
		components:{
			uploader
			// UploaderVideo
		},
		setup(props) {
			const store = useStore();
			return {
				num:0,
				uploaderVisible:false,
				uploadUrl: `${app.api}/sys/oss/upload?token=${getToken()}`,
				value: computed(() => `${props.modelValue}`),
				dataList: getDictDataList(store.state.dicts, props.dictType),
				src: null
			};
		},
		watch: {
			cover(newValue, oldValue) {
				if(this.isFocus) {
					this.src = newValue;
				}
			}
		},
		methods: {
			// 上传之前
			beforeUploadHandle(file: IObject) {
				if (file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/png" && file
					.type !== "image/gif") {
					this.$message.error(this.$t("upload.tip", {
						format: "jpg、png、gif"
					}));
					return false;
				}
				this.num++;
			},
			successHandle(res: IObject, file: IObject, fileList: IObject[]) {
				if (res.code !== 0) {
					return this.$message.error(res.msg);
				}
				this.$emit('update:modelValue', res.data.src);
			},
			// 文件变更
			changeHandler(file, fileList) {
				if(file != null && file.raw != undefined) {
					let objURL = "";
					if(window.URL != undefined) {
						objURL = window.URL.createObjectURL(file.raw);
						this.src = objURL;
						//window.URL.revokeObjectURL(objURL);
					} else if(window.webkitURL != undefined) {
						objURL = window.webkitURL.createObjectURL(file.raw);
						this.src = objURL;
						//window.webkitURL.revokeObjectURL(objURL);
					}
				}
			}
		}
	});
</script>
