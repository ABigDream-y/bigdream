<template>
	<div class="rr-login">
		<div class="rr-login-title">
			<div class="rr-login-top">
				<!-- <img class="login-logo" src="@/assets/images/logo.png" /> -->
				<!-- <h1 class="title">教务系统管理后台</h1> -->
			</div>
		</div>
		<div class="rr-login-card">

			<div class="rr-login-wrap">
				<!-- <div class="rr-login-left hidden-sm-and-down">
					<p class="rr-login-left-title">{{ $t("ui.app.productName") }}</p>
				</div> -->

				<div class="rr-login-right">
					<div class="rr-login-right-main">
						<!-- <h4 style="margin-top:20px;" class="rr-login-right-main-title">
							{{ $t("ui.login.loginBtn") }}
						</h4> -->
						<div class="login-top">
							<img src="@/assets/images/logo2.png">
							<p class="login-title">统一身份认证</p>
						</div>
						<div class="login-tabs">
							<div @click="tabClickHandle(1)" class="tabs-item" :class="current == 1 ?'active':''">扫码登录
							</div>
							<div @click="tabClickHandle(0)" class="tabs-item " :class="current == 0 ?'active':''">账号登录
							</div>
						</div>

						<!-- 账号密码登录 -->
						<div v-if="current == 0">
							<el-form ref="elm" label-width="80px" :status-icon="true" :model="login" :rules="formRule"
								@keyup.enter="onLogin">
								<el-form-item label-width="0" prop="username">
									<el-input size="large" v-model="login.username"
										:placeholder="$t('ui.login.userNamePlaceholder')" prefix-icon="user"
										autocomplete="off"></el-input>
								</el-form-item>
								<el-form-item label-width="0" prop="password">
									<el-input size="large" :placeholder="$t('ui.login.passwordPlaceholder')"
										v-model="login.password" prefix-icon="lock" autocomplete="off"
										show-password></el-input>
								</el-form-item>
								<el-form-item label-width="0" prop="captcha">
									<el-space class="rr-login-right-main-code">
										<el-input size="large" v-model="login.captcha"
											:placeholder="$t('ui.login.captchaPlaceholder')"
											prefix-icon="first-aid-kit"></el-input>
										<img style="vertical-align: middle; height: 40px; cursor: pointer;min-width:150px;margin-right:0;"
											:src="captchaUrl" @click="onRefreshCode" alt="加载失败,点击重新加载" />
									</el-space>
								</el-form-item>
								<el-form-item label-width="0">
									<el-button type="primary" size="small" :disabled="loading" @click="onLogin"
										class="rr-login-right-main-btn" style="margin-top:10px;">
										{{ $t("ui.login.loginBtn") }}
									</el-button>
								</el-form-item>
								<!-- <el-form-item label-width="0">
								<a style="width:100%;"
									href="https://ids.xmu.edu.cn/authserver/login?service=https://xlcp.xmu.edu.cn/callback"><img
										style="width: 100%;" src="@/assets/images/xmu.png" /></a>
							</el-form-item> -->
							</el-form>

							<div class="help">
								<a href="#/help" target="_blank">在线帮助</a>
							</div>
							<div class="help" style="margin-top:5px;">
								学生校友账号禁用可通过忘记密码进行重置<br />
								首次登录请点击忘记密码进行重置;更多请点在线帮助
							</div>
						</div>

						<!-- 扫码登录 -->
						<div v-if="current == 1" class="login-scan">
							<div class="scan-qrcode">开发中...</div>
							<p class="scan-title">企业微信扫码登录</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="login-footer">
			<p>
				Copyright © 2023 教务管理系统 All Rights Reserved. | 技术支持：厦门谷点教育科技有限公司
			</p>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		defineComponent,
		reactive
	} from "vue";
	import {
		CacheToken
	} from "@/constants/cacheKey";
	import Lang from "@/components/base/lang/index";
	import baseService from "@/service/baseService";
	import {
		setCache
	} from "@/utils/cache";
	import {
		ElMessage
	} from "element-plus";
	import {
		getUuid
	} from "@/utils/utils";
	import app from "@/constants/app";
	import SvgIcon from "@/components/base/svg-icon/index";

	export default defineComponent({
		components: {
			Lang,
			SvgIcon
		},
		setup() {
			return reactive({
				current: 0,
				login: {
					username: "",
					password: "",
					captcha: "",
					uuid: ""
				},
				captchaUrl: "",
				loading: false,
				year: new Date().getFullYear()
			});
		},
		created() {
			//清理数据
			this.$store.dispatch({
				type: "logout"
			});

			let query = this.$route.query;
			if (query && query.ticket) {
				const ticket = query.ticket as string;
				this.checkLogin(ticket);
			}

			this.getCaptchaUrl();
		},
		computed: {
			formRule() {
				return {
					username: [{
						required: true,
						message: this.$t("ui.login.rules.userName"),
						trigger: "blur"
					}],
					password: [{
						required: true,
						message: this.$t("ui.login.rules.password"),
						trigger: "blur"
					}],
					captcha: [{
						required: true,
						message: this.$t("ui.login.rules.captcha"),
						trigger: "blur"
					}]
				};
			}
		},
		methods: {
			tabClickHandle(index : number) {
				this.current = index;
			},
			checkLogin(ticket : string) {
				baseService.get("/checkLogin", {
					ticket: ticket,
					service: 'https://xlcp.xmu.edu.cn/callback'
				})
					.then((res) => {
						// console.log('checkLogin', res)
						this.loading = false;
						if (res.code === 0) {
							setCache(CacheToken, res.data, true);
							ElMessage.success(this.$t("ui.login.loginOk"));
							this.$router.push("/");
						} else {
							ElMessage.error(res.msg);
							this.onRefreshCode();
						}
					})
					.catch(() => {
						this.loading = false;
					});
			},
			clickHandle() {
				this.$message.warning("开发中")
			},
			onLogin() {
				this.$refs.elm.validate((valid : boolean) => {
					if (valid) {
						this.loading = true;
						baseService
							.post("/login", this.login)
							.then((res) => {
								this.loading = false;
								if (res.code === 0) {
									setCache(CacheToken, res.data, true);
									ElMessage.success(this.$t("ui.login.loginOk"));
									this.$router.push("/");
								} else {
									ElMessage.error(res.msg);
									this.onRefreshCode();
								}
							})
							.catch(() => {
								this.loading = false;
							});
					}
				});
			},
			getCaptchaUrl() {
				this.login.uuid = getUuid();
				this.captchaUrl = `${app.api}/captcha?uuid=${this.login.uuid}`;
			},
			onRefreshCode() {
				this.getCaptchaUrl();
			}
		}
	});
</script>

<style lang="less" scoped>
	@import url("@/assets/theme/base.less");

	.rr-login {
		width: 100vw;
		height: 100vh;
		background: #019ec4;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// background-image: url('@/assets/images/login_bg.jpg');
		background-image: url('@/assets/images/login_bg.png');
		background-size: cover;
		// background-position-x: center;
		background-position-y: center;

		.rr-login-title {
			position: absolute;
			left: 30px;
			top: 30px;

			.rr-login-top {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.login-logo {
				width: 80px;
				margin-right: 10px;
			}

			.title {
				margin: 0;
				color: #000;
				letter-spacing: 5px;
				font-size: 40px;
			}
		}

		.rr-login-card {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			// padding: 0 200px;
			padding: 0 150px;
		}

		.rr-login-wrap {
			width: auto;
			margin: 0;
			box-shadow: none;
		}

		.rr-login-right {
			width: 100% !important;
			background: rgba(0, 0, 0, 0.5);
			box-shadow: none;

			:deep(.el-input__inner) {
				height: 48px;
				line-height: 48px;
			}


		}

		.rr-login-right {
			min-height: 520px;
			padding: 0 40px 10px;

			.login-top {
				display: flex;
				align-items: center;
				justify-content: center;

				img {
					max-width: none;
					max-height: none;
					border-radius: 0;
					width: calc(100% - 160px);
				}

				.login-title {
					font-weight: 600;
					font-size: 20px;
					color: #fff;
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-left: 10px;
				}
			}

			.login-tabs {
				width: 100%;
				display: flex;
				align-items: center;
				margin: 10px 0px 20px;

				.tabs-item {
					width: 50%;
					z-index: 2;
					text-align: center;
					cursor: pointer;
					line-height: 20px;
					padding: 6px 0;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					overflow-wrap: break-word;
					display: inline-block;
					color: #fff;
					cursor: pointer;
				}

				.active {
					font-weight: bold;
					border-bottom: 1px solid #fff;

				}
			}

			.help {
				color: #fff;

				a {
					color: #fff;
					text-decoration: none;
				}
			}

			.login-scan {

				// display:flex

				.scan-qrcode {
					margin: 30px auto;
					width: 240px;
					height: 240px;
					background-color: rgba(255, 255, 255, 0.9);
					color: gray;
					font-size: 20px;
					text-align: center;
					line-height: 240px;
				}

				.scan-title {
					color: #ffffff;
					text-align: center;
					font-size: 16px;
					letter-spacing: 0;
					line-height: 20px;
					font-weight: bold;
					max-width: 100%;
				}
			}
		}

		.rr-login-right-main {
			width: 85%;
		}

		@media only screen and (max-width: 992px) {
			.rr-login-title {
				position: initial;
				width: 100%;
				text-align: center;

				.title {
					padding-bottom: 40px;
				}
			}

			.rr-login-card {
				width: 100%;
				display: block;
				padding: 0;
			}

			.rr-login-wrap {

				margin: 0;
			}

			.rr-login-wrap {
				width: 96% !important;
				margin: 0 auto;
			}

			.rr-login-right {
				width: 100% !important;
				padding:30px 0;
				min-height: auto;
			}
		}

		&-wrap {
			margin: 0 auto;
			width: 1000px;
			box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
			animation-duration: 1s;
			animation-fill-mode: both;
			border-radius: 5px;
			overflow: hidden;
		}

		&-left {
			justify-content: center;
			flex-direction: column;
			background-color: @--color-primary;
			color: #fff;
			float: left;
			width: 50%;

			&-title {
				text-align: center;
				color: #fff;
				font-weight: 300;
				letter-spacing: 2px;
				font-size: 32px;
			}
		}

		&-right {
			border-left: none;
			color: #fff;
			background-color: #fff;
			width: 50%;
			float: left;

			&-main {
				margin: 0 auto;
				width: 65%;

				&-title {
					color: #333;
					margin-bottom: 40px;
					font-weight: 500;
					font-size: 24px;
					text-align: center;
					letter-spacing: 4px;
				}

				&-lang .iconfont {
					font-size: 20px;
					color: #606266;
					font-weight: 800;
					width: 20px;
					height: 20px;
				}

				.el-input__inner {
					border-width: 0;
					border-radius: 0;
					border-bottom: 1px solid #dcdfe6;
				}

				&-code {
					width: 100%;

					.el-space__item:first-child {
						flex: 1;
					}
				}

				&-btn {
					width: 100%;
					height: 45px;
					font-size: 18px !important;
					letter-spacing: 2px;
					font-weight: 300 !important;
					cursor: pointer;
					margin-top: 30px;
					font-family: neo, sans-serif;
					transition: 0.25s;
				}
			}
		}

		.login-footer {
			text-align: center;
			position: absolute;
			bottom: 0;
			padding: 20px;
			color: rgba(255, 255, 255, 0.6);

			p {
				margin: 10px 0;
			}

			a {
				padding: 0 5px;
				color: rgba(255, 255, 255, 0.6);

				&:focus,
				&:hover {
					color: #fff;
				}
			}
		}

		&-left,
		&-right {
			position: relative;
			min-height: 500px;
			align-items: center;
			display: flex;
		}

		@keyframes animate-down {

			0%,
			60%,
			75%,
			90%,
			to {
				animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			}

			0% {
				opacity: 0;
				transform: translate3d(0, -3000px, 0);
			}

			60% {
				opacity: 1;
				transform: translate3d(0, 25px, 0);
			}

			75% {
				transform: translate3d(0, -10px, 0);
			}

			90% {
				transform: translate3d(0, 5px, 0);
			}

			to {
				transform: none;
			}
		}

		.animate-down {
			animation-name: animate-down;
		}
	}
</style>

<style scoped>
	:deep(.rr-login-right-main-code .el-space__item:nth-of-type(2)) {
		margin-right: 0 !important;
	}
</style>