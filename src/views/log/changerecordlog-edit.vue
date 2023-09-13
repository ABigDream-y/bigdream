<template>
  <div class="edit-card--file">
  <div class="aui-card-header">
    <el-button @click="goBack()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
    <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
  </div>
  <div class="edit-card__body">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="id" prop="id">
        <el-input v-model="dataForm.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="学籍异动操作" prop="operation">
        <el-input v-model="dataForm.operation" placeholder="学籍异动操作"></el-input>
      </el-form-item>
      <el-form-item label="用户代理" prop="userAgent">
        <el-input v-model="dataForm.userAgent" placeholder="用户代理"></el-input>
      </el-form-item>
      <el-form-item label="操作IP" prop="ip">
        <el-input v-model="dataForm.ip" placeholder="操作IP"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="creatorName">
        <el-input v-model="dataForm.creatorName" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="创建者" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
	const store = useStore();
    return reactive({
		store,
		loading:false,
      visible: false,
      dataForm: {
        id: "",
        operation: "",
        userAgent: "",
        ip: "",
        creatorName: "",
        creator: "",
        createDate: "",
      }
    });
  },
  computed: {
    dataRule() {
      return {
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
	  this.loading = false;
	  let id = this.$route.query.id || '';
	  if(id && id != '0') {
	  	this.dataForm.id = id;
	  }
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/log/changerecordlog/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
		this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/log/changerecordlog", this.dataForm).then((res) => {
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
              this.goBack()
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
	updateClosedTabs(closedTabs: any[], isTransform = true) {
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