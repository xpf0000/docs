<script setup>
  /**
   * @doc true
   * @fileDoc true
   * @author xupengfei
   * @name APP.vue
   * @type vue template
   * @desc project main vue template
   */
  import { reactive, ref, computed } from 'vue'
  import request from './core/Request.js'

  /**
   * @doc true
   * @name data
   * @desc vue template data
   * @type data
   * @param docs all docs, get by api
   * @param references all file's references, get by api
   * @param activeNames left el-collapse's active name
   * @param centerActive center el-collapse's active name
   * @param searchLeft left search key, search by @name and file src
   * @param leftId left choose doc's id
   * @param centerId center choose doc's id
   * @param centerDoc center current doc
   * @param endDoc right current doc
   */
  const docs = reactive({})
  const references = reactive({})
  const activeNames = ref(['1'])
  const centerActive = ref(['dependencies'])
  const searchLeft = ref('')
  const leftId = ref('')
  const centerId = ref('')
  const centerDoc = ref({})
  const endDoc = ref({})
  request({
    url: 'docs',
    method: 'post',
    data: {
      src: import.meta.env.VITE_DOC_SRC
    }
  }).then((res) => {
    console.log('res: ', res)
    Object.assign(docs, res.data.docs)
    Object.assign(references, res.data.references)
    console.log('docs: ', docs)
    console.log('references: ', references)
    for (let type in docs) {
      if (docs[type].length > 0) {
        leftChoose(docs[type][0])
        activeNames.value = [type]
        break
      }
    }
  })

  /**
   * @doc true
   * @type methods
   * @name typeLength
   * @desc return left top group's docs length, filter by search word
   * @param value [] left top group's docs
   * @returns {number|*} left top group's docs length, filter by search word
   */
  const typeLength = (value) => {
    if (!searchLeft.value) {
      return value.length
    }
    let count = 0
    value.forEach((v) => {
      if (v.name.includes(searchLeft.value) || v.file.includes(searchLeft.value)) {
        count += 1
      }
    })
    return count
  }

  /**
   * @doc true
   * @type methods
   * @name checkLeftShow
   * @desc filter left top group's docs
   * @param item doc in left top group's docs
   * @returns boolean show or hide of item doc in left top group's docs
   */
  const checkLeftShow = (item) => {
    return (
      !searchLeft.value ||
      item.name.includes(searchLeft.value) ||
      item.file.includes(searchLeft.value)
    )
  }

  /**
   * @doc true
   * @type methods
   * @name leftChoose
   * @desc choose of item doc in left top group's docs
   * @param item doc in left top group's docs
   */
  const leftChoose = (item) => {
    leftId.value = item.id
    centerDoc.value = reactive(item)
    centerId.value = ''
    endDoc.value = reactive({})
    if (centerDoc.value.docs) {
      for (let key in centerDoc.value.docs) {
        if (centerDoc.value.docs[key].length > 0) {
          let doc = centerDoc.value.docs[key][0]
          centerId.value = doc.id
          endDoc.value = reactive(doc)
          break
        }
      }
      const keys = Object.keys(centerDoc.value.docs)
      centerActive.value = ['dependencies', ...keys]
    }
  }

  /**
   * @doc true
   * @type methods
   * @name centerChoose
   * @desc choose of item in center current doc
   * @param item item in center current doc
   */
  const centerChoose = (item) => {
    centerId.value = item.id
    endDoc.value = reactive(item)
  }
  const cacheSet = new Set()
  const getReferences = (file) => {
    const arr = []
    if (cacheSet.has(file)) {
      return arr
    }
    cacheSet.add(file)
    const refer = references[file]
    if (refer) {
      refer.forEach((r) => {
        const obj = {
          label: r,
          children: getReferences(r)
        }
        arr.push(obj)
      })
    }
    return arr
  }

  /**
   * @doc true
   * @type computed
   * @name centerReferences
   * @desc file's references of center current doc
   * @returns [] file's references of center current doc used in el-tree
   */
  const centerReferences = computed(() => {
    const file = centerDoc.value.file
    cacheSet.clear()
    return getReferences(file)
  })

  /**
   * @doc true
   * @type computed
   * @name endParams
   * @desc right doc's params split
   * @returns [] right doc's params
   */
  const endParams = computed(() => {
    const param = endDoc.value.param || []
    console.log('param: ', param)
    const arr = []
    for (let p of param) {
      const parr = p.split(' ')
      const key = parr.shift()
      const value = parr.join(' ')
      arr.push({
        name: key,
        desc: value
      })
    }
    console.log('endParams: ', endParams)
    return arr
  })

  const findLeft = (data) => {
    console.log('findLeft: ', data)
    for (let type in docs) {
      for (let doc of docs[type]) {
        if (doc.file === data.label) {
          leftChoose(doc)
          activeNames.value = [type]
          break
        }
      }
    }
  }
</script>

<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="7" :md="6" :lg="6" :xl="6">
      <el-card class="box-card">
        <template #header>
          <el-input
            v-model="searchLeft"
            placeholder="input search key"
            prefix-icon="el-icon-search"
          />
        </template>
        <el-collapse v-model="activeNames">
          <template v-for="(value, type) in docs" :key="type">
            <el-collapse-item :title="type + '(' + typeLength(value) + ')'" :name="type">
              <template v-for="(item, index) in value" :key="index">
                <a
                  v-if="checkLeftShow(item)"
                  :class="{ link: true, active: leftId === item.id }"
                  href="javascript:void(0);"
                  @click="leftChoose(item)"
                >
                  <p class="link-text"> {{ item.name }} </p>
                </a>
              </template>
            </el-collapse-item>
          </template>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
      <el-descriptions class="margin-top" :title="centerDoc.name" :column="1" size="medium" border>
        <el-descriptions-item>
          <template #label> author </template>
          {{ centerDoc.author }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> desc </template>
          <pre>{{ centerDoc.desc }}</pre>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> file src </template>
          {{ centerDoc.file }}
        </el-descriptions-item>
      </el-descriptions>
      <el-card class="box-card" style="margin-top: 30px" shadow="never">
        <el-collapse v-model="centerActive">
          <el-collapse-item title="dependencies" name="dependencies">
            <el-tree :data="centerReferences" :expand-on-click-node="false">
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span @click="findLeft(data)">{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </el-collapse-item>
          <template v-for="(doc, type) in centerDoc.docs" :key="type">
            <el-collapse-item
              v-if="doc.length > 0"
              :title="
                type === 'default'
                  ? 'defult group(' + doc.length + ')'
                  : type + '(' + doc.length + ')'
              "
              :name="type"
            >
              <template v-for="(item, index) in doc" :key="index">
                <a
                  :class="{ link: true, active: centerId === item.id }"
                  href="javascript:void(0);"
                  @click="centerChoose(item)"
                >
                  <p class="link-text"> {{ item.name }} </p>
                </a>
              </template>
            </el-collapse-item>
          </template>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col v-if="endDoc.id" :xs="24" :sm="9" :md="10" :lg="10" :xl="10">
      <el-descriptions class="margin-top" :title="endDoc.name" :column="1" size="medium" border>
        <el-descriptions-item v-if="endDoc.author">
          <template #label> author </template>
          <pre>{{ endDoc.author }}</pre>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> desc </template>
          <pre>{{ endDoc.desc }}</pre>
        </el-descriptions-item>
        <el-descriptions-item v-if="endDoc.param">
          <template #label> params </template>
          <el-table :data="endParams">
            <el-table-column prop="name" label="name" width="180" />
            <el-table-column prop="desc" label="desc" />
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item v-if="endDoc.returns">
          <template #label> returns </template>
          <pre>{{ endDoc.returns }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
  </el-row>
</template>

<style lang="scss">
  :root {
    --text-color: var(--el-text-color-primary);
    --text-color-light: var(--el-text-color-regular);
    --text-color-lighter: var(--el-text-color-secondary);
    --brand-color: var(--el-color-primary);
    --brand-color-light: var(--el-color-primary-light-1);
    --bg-brand-color: var(--el-color-primary-light-9);
    --bg-color: var(--el-color-white);
    --bg-color-soft: #fafafa;
    --bg-color-mute: #f2f2f2;
    --border-color: var(--el-border-color-base);
    --border-color-light: var(--el-border-color-lighter);
    --font-family: Inter, Roboto, Oxygen, Fira Sans, Helvetica Neue, sans-serif;
    --font-family-mono: 'JetBrains Mono', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
    --success-color: var(--el-color-success);
    --warning-color: var(--el-color-warning);
    --danger-color: var(--el-color-danger);
    --header-height: 55px;
    --nav-height: 55px;
    --sidebar-width-md: 18rem;
    --sidebar-width-sm: 16rem;
    --sidebar-width-xs: 20rem;
    --content-min-width: 16rem;
    --content-max-width: 48rem;
    --nav-z-index: 20;
    --sub-nav-z-index: 10;
    --sidebar-z-index: 40;
    --overlay-z-index: 30;
    --code-bg-color: var(--el-background-color-base);
    --code-text-color: var(--text-color);
    --code-font-family: var(--font-family-mono);
    --docsearch-primary-color: var(--brand-color);
    --docsearch-searchbox-background: var(--el-background-color-base);
  }

  *,
  :before,
  :after {
    box-sizing: border-box;
    word-break: break-all;
  }

  a {
    text-decoration: inherit;
    color: var(--brand-color);
  }

  a,
  area,
  button,
  [role='button'],
  input,
  label,
  select,
  summary,
  textarea {
    touch-action: manipulation;
  }
  a {
    background-color: transparent;
  }

  pre {
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 30px;
  }

  .link {
    display: block;
    padding: 0.625rem 2rem 0.625rem 1.5rem;
    line-height: 1.5;
    font-size: 0.9rem;
    margin: 0 8px;
    border-radius: 8px;
  }

  .link.active {
    background-color: var(--bg-brand-color);
  }

  .link-text {
    line-height: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color-light);
    transition: color 0.5s;
    text-align: left;
  }

  .link .link-text {
    margin: 0;
  }

  .link:hover .link-text {
    color: var(--brand-color);
    transition: color 0.25s;
  }

  .link.active .link-text {
    font-weight: 600;
    color: var(--brand-color);
    transition: color 0.25s;
  }
</style>
