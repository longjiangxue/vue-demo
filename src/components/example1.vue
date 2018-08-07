<template>
  <div class="ad">
    <div class="btn-group">
      <el-button type="primary" @click="add()">添加</el-button>
      <el-select v-model="selType">
        <el-option
            v-for="item in selOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="table-content">
      <!--展示列表-->
      <el-table
          :data="table.data"
          v-loading="loading"
          border
          style="width: 100%;"
          maxHeight="650">
        <el-table-column
            prop="weight"
            label="权重"
            :stripe="true">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            :stripe="true">
        </el-table-column>
        <el-table-column
            prop="startTime"
            label="开始时间"
            :stripe="true"
            min-width="160">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.startTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="结束时间"
            :stripe="true"
            min-width="160">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.endTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="imgUrl"
            label="图片"
            :stripe="true"
            width="100">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl">
          </template>
        </el-table-column>
        <el-table-column
            prop="redirectType"
            label="跳转类型"
            :stripe="true">
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="110px"
            type="index">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <div class="page">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          :page-sizes="page.sizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.totalRecordCount">
      </el-pagination>
    </div>

    <!--添加、编辑弹窗-->
    <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.show"
        width="600px">
      <el-form :model="edition" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="edition.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="包名：" prop="packName">
          <!--<el-input v-model="edition.packName" placeholder="请输入标题"></el-input>-->
          <el-select v-model="edition.packName">
            <el-option :label="item.packName" :value="item.packName" v-for="(item, i) in packNames" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重：" prop="weight">
          <el-input v-model.number="edition.weight" placeholder="请输入权重" Number></el-input>
        </el-form-item>
        <el-form-item label="平台：" prop="appType" required>
          <el-radio-group v-model="edition.appType">
            <el-radio label="Android"></el-radio>
            <el-radio label="IOS"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转类型：" prop="redirectType" required>
          <!--<el-radio-group v-model="edition.redirectType">-->
            <!--<el-radio label="H5">H5</el-radio>-->
            <!--<el-radio label="Show">直接显示</el-radio>-->
          <!--</el-radio-group>-->
          <el-select v-model="edition.redirectType">
          <el-option label="跳转地址" value="H5"></el-option>
          <el-option label="直接显示" value="Show"></el-option>
          <el-option label="文件下载" value="Download"></el-option>
          <el-option label="跳转外部浏览器" value="JumpBrower"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="跳转链接：" prop="redirectUrl">
          <el-input v-model="edition.redirectUrl" placeholder="请输入跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
              v-model="edition.startTime"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
              v-model.number="edition.endTime"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
         <!-- <upload :url.sync="edition.imgUrl"></upload>-->
          <el-input v-model="edition.imgUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!--二次确定弹窗-->
    <el-dialog
        :title="tip.title"
        :visible.sync="tip.show"
        width="30%">
      <span>{{tip.desc}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tip.show = false">取 消</el-button>
        <el-button type="primary" @click="tip.cb()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { Message } from 'element-ui';
  // import upload from '@/components/common/upload';
  import API from '@/api/index';

  export default {
    name: 'dialogAd',
    data() {
      return {
        table: {
          th: [],
          data: [],
        },
        loading: true,
        dialog: {
          title: '',
          show: false,
        },

        selOptions: [
          {
            label: 'IOS',
            value: 'IOS',
          }, {
            label: 'Android',
            value: 'Android',
          },
        ],
        selType: 'IOS',

        defaultData: {
          title: '',
          weight: 1,
          appType: 'Android',
          redirectType: 'H5',
          redirectUrl: '',
          startTime: '',
          endTime: '',
          imgUrl: '',
          bannerType: 'Ad',
          packName: '',
        },
        edition: {},

        page: {
          pageNo: 1, // 当前页
          pageSize: 10, // 每页展示数
          sizes: [10, 20, 30, 50, 100], // 每页展示数选择列表
          totalRecordCount: 0,
        },
        tip: {
          show: false,
          cb: () => {},
        },
        packNames: [],
      };
    },
    watch: {
      selType() {
        this.loading = true;
        this.getData();
      },
    },
    computed: {
      ...mapState([
        'clone',
        'dateFormat',
      ]),
      rules() {
        return {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' },
          ],
          weight: [
            { required: true, message: '权重不能为空' },
            { type: 'number', message: '权重必须为数字值' },
          ],
          redirectUrl: [
            { required: this.edition.redirectType !== 'Show', message: '类型不为"直接显示"时，跳转链接不能为空', trigger: 'blur' },
          ],
        };
      },
    },
    mounted() {
      this.edition = this.clone(this.defaultData);
      this.getData();
      this.getPackNameSelect();
    },
    methods: {
      getData() {
        const params = new FormData();
        params.append('bannerType', this.edition.bannerType);
        params.append('appType', this.selType);
        params.append('pageNo', this.page.pageNo);
        params.append('pageSize', this.page.pageSize);
        this.loading = false;
        /* API.post('getBanner', params).then((res) => {
          this.loading = false;
          if (res.errCode === 200) {
            this.table.data = res.obj.record;
            this.page.totalRecordCount = res.obj.totalRecordCount;
          } else {
            Message({
              type: 'error',
              message: res.errMsg,
            });
          }
        }); */
      },
      getPackNameSelect() {
        const params = new FormData();
        /* API.post('getPackNameSelect', params).then((res) => {
          if (res.errCode === 200) {
            this.packNames = res.obj;
          }
        }); */
      },
      add() {
        this.dialog.title = '添加';
        this.edition = this.clone(this.defaultData);
        this.dialog.show = true;
      },
      edit(row) {
        this.dialog.title = '编辑';
        this.edition = this.clone(row);
        this.dialog.show = true;
      },
      submit() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (this.edition.bannerId) {
              // 有bannerId，则为编辑
              const params = new FormData();
              params.append('title', this.edition.title);
              params.append('weight', this.edition.weight);
              params.append('bannerType', this.edition.bannerType);
              params.append('redirectType', this.edition.redirectType);
              params.append('imgUrl', this.edition.imgUrl);
              params.append('redirectUrl', this.edition.redirectUrl);
              params.append('startTime', this.edition.startTime.getTime ? this.edition.startTime.getTime() : this.edition.startTime);
              params.append('endTime', this.edition.endTime.getTime ? this.edition.endTime.getTime() : this.edition.endTime);
              params.append('appType', this.selType);
              params.append('packName', this.edition.packName);
              params.append('bannerId', this.edition.bannerId);

              API.post('updateBanner', params).then((res) => {
                if (res.errCode === 200) {
                  Message({
                    type: 'success',
                    message: '更新成功',
                  });
                  this.dialog.show = false;

                  // 在列表中更新
                  this.table.data.map((item, index) => {
                    if (item.bannerId === this.edition.bannerId) {
                      this.table.data.splice(index, 1, this.edition);
                      return true;
                    }
                    return false;
                  });
                } else {
                  Message({
                    type: 'error',
                    message: res.errMsg,
                  });
                }
              });
            } else {
              // 没有bannerId，则为添加
              const params = new FormData();
              params.append('title', this.edition.title);
              params.append('weight', this.edition.weight);
              params.append('bannerType', this.edition.bannerType);
              params.append('redirectType', this.edition.redirectType);
              params.append('imgUrl', this.edition.imgUrl);
              params.append('redirectUrl', this.edition.redirectUrl);
              params.append('startTime', this.edition.startTime.getTime());
              params.append('endTime', this.edition.endTime.getTime());
              params.append('packName', this.edition.packName);
              params.append('appType', this.selType);

              API.post('addBanner', params).then((res) => {
                if (res.errCode === 200) {
                  Message({
                    type: 'success',
                    message: '添加成功',
                  });
                  this.dialog.show = false;

                  // 添加到列表中
                  this.edition.bannerId = res.obj;
                  const item = this.clone(this.edition);
                  item.appType = this.selType;
                  this.table.data.unshift(item);
                } else {
                  Message({
                    type: 'error',
                    message: res.errMsg,
                  });
                }
              });
            }
          } else {
            Message({
              type: 'error',
              message: 'error submit!!',
            });
          }
        });
      },
      del(row) {
        // 无法返回index有点智障
        this.tip = {
          show: true,
          title: '提示',
          desc: `确定删除${row.title}吗？`,
          cb: () => {
            const params = new FormData();
            params.append('bannerId', row.bannerId);
            API.post('deleteBanner', params).then((res) => {
              this.tip.show = false;
              if (res.errCode === 200) {
                this.table.data.map((item, index) => {
                  if (item.bannerId === row.bannerId) {
                    this.table.data.splice(index, 1);
                    return true;
                  }
                  return false;
                });
              } else {
                Message({
                  type: 'error',
                  message: res.errMsg,
                });
              }
            });
          },
        };
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.page.pageNo = val;
        this.getData();
      },
    },
    components: {
      // upload,
    },
  };
</script>

<style scoped lang="scss">
  .table-content {
    flex: 1;
    /*max-height: calc(100% - 112px);*/
  }

  .btn-group {
    text-align: left;
    padding: 10px 0;
  }
</style>
