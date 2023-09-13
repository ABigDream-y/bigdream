<template>
  <div class="edit-card--file">
  <div class="aui-card-header">
    <el-button @click="goBack()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
    <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
  </div>
  <div class="edit-card__body">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="学院" prop="institute">
        <el-input v-model="dataForm.institute" placeholder="学院"></el-input>
      </el-form-item>
      <el-form-item label="学院编号" prop="instituteNo">
        <el-input v-model="dataForm.instituteNo" placeholder="学院编号"></el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD" v-model="dataForm.startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD" v-model="dataForm.endDate"></el-date-picker>
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
        institute: "",
        instituteNo: "",
        startDate: "",
        endDate: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: "",
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
      baseService.get("/plan/plansettinginstitute/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/plan/plansettinginstitute", this.dataForm).then((res) => {
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