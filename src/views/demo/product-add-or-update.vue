<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item label="产品介绍" prop="content">
        <el-input v-model="dataForm.content" placeholder="产品介绍"></el-input>
      </el-form-item>
    </el-form>
    <vxe-toolbar perfect>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus" status="perfect" @click="insertEvent(-1)">新增</vxe-button>
        <vxe-button icon="fa fa-trash-o" status="perfect" @click="removeEvent">删除</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table border show-overflow ref="xTable" class="my_table_insert" max-height="400" :data="tableData" :edit-config="{ trigger: 'click', mode: 'cell', icon: 'fa fa-pencil' }">
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column field="paramName" title="参数名" sortable :edit-render="{ name: 'input', defaultValue: '' }"></vxe-column>
      <vxe-column field="paramValue" title="参数值" :edit-render="{ name: 'input' }"></vxe-column>
    </vxe-table>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
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
      tableData: [],
      dataForm: {
        id: "",
        name: "",
        content: "",
        subList: []
      }
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        content: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        updater: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        updateDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
        this.tableData = [];
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    async insertEvent(row: number) {
      let record = {
        num: "1"
      };
      let { row: newRow } = await this.$refs.xTable.insertAt(record, row);
      await this.$refs.xTable.setActiveCell(newRow, "paramName");
    },
    removeEvent() {
      const selectRecords = this.$refs.xTable.getCheckboxRecords();
      if (selectRecords.length) {
        this.$refs.xTable.removeCheckboxRow();
      } else {
        this.$message.error("请至少选择一条数据");
      }
    },
    // 获取信息
    getInfo() {
      baseService.get(`/demo/product/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
        this.tableData = res.data.subList;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.dataForm.subList = this.$refs.xTable.getTableData().tableData;
        (!this.dataForm.id ? baseService.post : baseService.put)("/demo/product/", this.dataForm).then((res) => {
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
