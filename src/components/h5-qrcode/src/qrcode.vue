<template>
	<div class="qrcode-container">
		<!-- <el-popover placement="left" width="300" trigger="hover" @show="createQrcode()">
			
			<div slot="reference">
				<img style="width:40px;height:40px;cursor: pointer;" src="../imgs/qrcodeh5.png" />
			</div>
		</el-popover> -->
		<el-tooltip effect="light" trigger="hover" placement="left" @show="createQrcode()">
			<template #content>
				<div class="qrcode-box" v-loading="loadingimg">
					<div class="wechatQR" :ref="'wechatQR'+qrcodeId" :id="'wechatQR'+qrcodeId"></div>
					<el-button v-if="showDown" style="margin-top: 20px;width:100px;" type="primary" @click="downQrcodeHandle()" :loading="downLoading">下载</el-button>
				</div>
			</template>
			<img style="width:40px;height:40px;cursor: pointer;" src="../imgs/qrcodeh5.png" />
		</el-tooltip>
	</div>
</template>
<script lang="ts">
	import QRCode from 'qrcodejs2';
	import {
		defineComponent
	} from "vue";
	import {
		getUuid
	} from "@/utils/utils";
	import {
		useStore
	} from "vuex";
	export default defineComponent({
		name: "H5Qrcode",
		props: {
			h5Url: {
				type: String,
				default: ""
			},
			text: {
				type: String,
				default: ''
			},
			width: {
				type: Number,
				default: 150
			},
			name: {
				type: String,
				default: ''
			},
			showDown: {
				type: Boolean,
				default: true
			}
		},
		setup(props) {
			const store = useStore();
			return {
				loadingimg: false,
				downLoading: false,
				qrcodeId: getUuid()
			};
		},
		methods: {
			createQrcode() {
				// console.log('开始创建二维码')
				this.$nextTick(() => {
					// console.log('wechatQR--', this.$refs['wechatQR' + this.qrcodeId])
					if (this.$refs['wechatQR' + this.qrcodeId]) {
						this.$refs['wechatQR' + this.qrcodeId].innerHTML = ""
						let qrcode = new QRCode('wechatQR' + this.qrcodeId, {
							width: this.width,
							height: this.width,
							text: this.text ? this.text : this.h5Url,
							colorDark: "#000",
							colorLight: "#fff"
						})
						// console.log('创建成功',this.h5Url)
					} else {
						// console.log('未找到组件')
					}
				})
			},
			// 下载二维码
			downQrcodeHandle() {
				this.downLoading = true
				let qrcodeUrl: any = null;
				this.$nextTick(() => {
					let imgEle = document.querySelector('#wechatQR' + this.qrcodeId + ' img')
					if (imgEle) {
						qrcodeUrl = imgEle.getAttribute('src');
						const tag = document.createElement('a');
						tag.setAttribute('download', this.name.replace(/\./g, '。'));
						const image = new Image();
						image.src = qrcodeUrl
						image.setAttribute('crossorigin', 'Anonymous');
						image.onload = () => {
							tag.href = this.getImageDataUrl(image);
							tag.click()
							this.downStopHandle()
						}
					} else {
						this.downStopHandle()
					}

				})
			},
			downStopHandle() {
				let that = this;
				setTimeout(() => {
					that.downLoading = false
				}, 200)
			},
			getImageDataUrl(image: any) {
				const canvas = document.createElement('canvas')
				canvas.width = image.width
				canvas.height = image.height
				const ctx = canvas.getContext('2d')
				ctx.drawImage(image, 0, 0, image.width, image.height);
				const extension = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
				return canvas.toDataURL('image/' + extension, 1);
			},
		}
	});
</script>
<style scoped>
	.qrcode-container {
		width: 100%;

	}

	.qrcode-box {
		text-align: center;
		width: 274px;
		height: 274px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 0 auto;
	}

	.wechatQR {
		margin: 0 auto;
	}
</style>
