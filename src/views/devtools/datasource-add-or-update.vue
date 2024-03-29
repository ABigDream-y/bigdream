<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="连接名" prop="connName">
        <el-input v-model="dataForm.connName" placeholder="连接名"></el-input>
      </el-form-item>
      <el-form-item prop="dbType" label="数据库类型">
        <el-select v-model="dataForm.dbType" clearable placeholder="数据库类型" class="w-percent-100">
          <el-option value="MySQL" label="MySQL"></el-option>
          <el-option value="Oracle" label="Oracle"></el-option>
          <el-option value="SQLServer" label="SQLServer"></el-option>
          <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库URL" prop="connUrl">
        <el-input v-model="dataForm.connUrl" placeholder="数据库URL"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" size="small">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        dbType: "",
        connName: "",
        connUrl: "",
        username: "",
        password: "",
        status: 0
      }
    });
  },
  computed: {
    dataRule() {
      return {
        dbType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        connName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        connUrl: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        username: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        password: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/devtools/datasource/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/devtools/datasource", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>
