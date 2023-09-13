<template>
	<editor api-key="wem3vxcrufyxbecsk5c7ffa8w6358pq3cnqqdoxho5cek6bj" :tinymceScriptSrc="tinymceScriptSrc"
		v-model="value" :init="options"></editor>
</template>

<script lang="ts">
	import {
		defineComponent,
		ref,
		watch
	} from "vue";
	import Editor from "@tinymce/tinymce-vue";
	import {
		getToken
	} from "@/utils/cache";
	import app from "@/constants/app";
	// import { getLocaleLang } from "@/i18n";

	export default defineComponent({
		name: "Tinymce",
		components: {
			editor: Editor
		},
		emits: ["update:modelValue"],
		props: {
			modelValue: String,
			init: Object,
			showToolbar:{
				type:Boolean,
				default:true
			},
			// menubar: false, //最顶部文字信息
			menubar:{
				type:Boolean,
				default:true
			},
			//字数统计是否显示，默认显示
			wordcount:{
				type:Boolean,
				default:true
			},
			//是否显示底部状态栏 默认显示
			statusbar:{
				type:Boolean,
				default:true
			}
		},
		setup(props, {
			emit
		}) {
			const value = ref("");
			// const lang = getLocaleLang();
			const options = {
				height: 500,
				language: "zh-Hans",
				branding: false,
				statusbar:props.statusbar,
				convert_urls: false,
				menubar:props.menubar ?'file edit insert view format table tools':false,
				// menubar: 'file edit insert view format table tools', // （1级菜单）最上方的菜单 help 帮助
				images_upload_url: `${app.api}/sys/oss/tinymce/upload?token=${getToken()}`,
				plugins: [
					`advlist anchor autolink autosave code codesample directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars ${props.wordcount ?'wordcount':''}`
				],
				style_formats: [{
					title: '首行缩进',
					block: 'p',
					styles: {
						'text-indent': '2em'
					}
				}, {
					title: 'Headings',
					items: [{
						title: 'Heading 1',
						format: 'h1'
					}, {
						title: 'Heading 2',
						format: 'h2'
					}, {
						title: 'Heading 3',
						format: 'h3'
					}, {
						title: 'Heading 4',
						format: 'h4'
					}, {
						title: 'Heading 5',
						format: 'h5'
					}, {
						title: 'Heading 6',
						format: 'h6'
					}]
				}, {
					title: 'Inline',
					items: [{
							title: 'Bold',
							format: 'bold'
						},
						{
							title: 'Italic',
							format: 'italic'
						},
						{
							title: 'Underline',
							format: 'underline'
						},
						{
							title: 'Strikethrough',
							format: 'strikethrough'
						},
						{
							title: 'Superscript',
							format: 'superscript'
						},
						{
							title: 'Subscript',
							format: 'subscript'
						},
						{
							title: 'Code',
							format: 'code'
						}
					]
				}, {
					title: 'Blocks',
					items: [{
							title: 'Paragraph',
							format: 'p'
						},
						{
							title: 'Blockquote',
							format: 'blockquote'
						},
						{
							title: 'Div',
							format: 'div'
						},
						{
							title: 'Pre',
							format: 'pre'
						}
					]
				}, {
					title: 'Align',
					items: [{
						title: 'Left',
						format: 'alignleft'
					}, {
						title: 'Center',
						format: 'aligncenter'
					}, {
						title: 'Right',
						format: 'alignright'
					}, {
						title: 'Justify',
						format: 'alignjustify'
					}]
				}],
				// paste_data_images: true, // 设置为“true”将允许粘贴图像，而将其设置为“false”将不允许粘贴图像
				// file_picker_types: 'file media',
				toolbar: !props.showToolbar ?'':"code searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote removeformat subscript superscript codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen",
				...props.init
			};
			const tinymceScriptSrc = window.location.origin + '/tinymce_5.4.2/tinymce/js/tinymce/tinymce.min.js';
			watch(
				() => value.value,
				(vl) => {
					// console.log('value----vl',vl);
					emit("update:modelValue", vl);
				}
			);
			watch(
				() => props.modelValue,
				(vl) => {
					// console.log('modelValue0----vl',vl);
					if(vl && vl.indexOf('<p>') == -1) {
						value.value = "<p>" + vl + "</p>"
					}else {
						value.value = vl || "";
					}
					
				}
			);
			return {
				props,
				options,
				value,
				tinymceScriptSrc
			};
		},
		created(){
			this.value = this.modelValue || "";
		}
	});
</script>
