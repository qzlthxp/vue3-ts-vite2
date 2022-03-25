#### **vue查漏补缺**

**v-bind动态参数**

```vue
<!-- v-bind也可以是绑定动态参数 -->
<a v-bind:[attributeName]="url">...</a>

<!-- 
这里的 attributeName 会被作为一个js表达式动态求值，求得的值会被作为最终的参数来使用。例如当前组件实例有一个data的属性 attributeName，其值为 href，那么我们也可以成功进行动态绑定
等价于 v-bind:href
v-on同理 v-on:[eventName]  eventName: 'focus'
-->

<!-- 对动态参数表达式约定 -->

<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
解决方法就是变更为计算属性或者没有空格或引号

<!-- 避免使用大写字符来命名key，因为浏览器会把属性名称全部强制转换成小写 -->
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```

**计算属性和方法的区别**

计算属性有缓存，方法没有。只有当计算属性的响应式依赖发生改变时才会重新计算，否则直接返回已经缓存的值。

```js
computed: {
	timeNow() {
		return Date.now()
	}
}
```

虽然`timeNow`是计算属性，但是视图上它不会变化，因为它没有响应式依赖。

计算属性的**setter**

默认情况我们只需使用getter就可以了，但无法避免有些需求是需要使用setter的

```
computed: {
	name: {
		getter() {
			return this.firstName + ' ' + this.lastName
		},
		setter(value) {
			const names = value.split(' ')
			this.firstName = names[0]
			this.lastName = names[names.length - 1]
		}
	}
}
```

**emits解决与原生事件重名问题**

```
// 子组件
<template>
	<button @click="$emit('click')">
		emit something
	</button>
</template>

// 父组件
<template>
	<my-button @click="getEmit" />
</template>

<script>
	methods: {
		getEmit() {
			console.log('click!')
		}
	}
</script>

// 最后为打印两次click! 因为我们emit事件的名称与原生click重复，浏览器无法判断。解决方法：使用emits选项
emits: ['click'] //与setup、props同级
// script setup
import { defineEmits } from 'vue'
const eimt = defineEmits(['click'])
```

**Prop类型**

我们可以为每个prop指定任意类型，结合vue3和ts

**传递静态或者动态的prop**

我们在向子组件传递prop的时候，可以传递一个静态的值，这时候并不需要添加 : 

```
<blog-post title="My journey with Vue"></blog-post>
```

动态赋值

```
<!-- 动态赋予一个变量的值 -->
<blog-post :title="post.title"></blog-post>

<!-- 动态赋予一个复杂表达式的值 -->
<blog-post :title="post.title + ' by ' + post.author.name"></blog-post>
```

传递一个数字

```
<!-- 即便 `42` 是静态的，我们仍需通过 `v-bind` 来告诉 Vue     -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。             -->
<blog-post :likes="42"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post :likes="post.likes"></blog-post>
```

传入一个布尔值

```
<!-- 包含该 prop 没有值的情况在内，都意味着 `true`。          -->
<!-- 如果没有在 props 中把 is-published 的类型设置为 Boolean，
则这里的值为空字符串，而不是“true”。 -->
<blog-post is-published></blog-post>

<!-- 即便 `false` 是静态的，我们仍需通过 `v-bind` 来告诉 Vue  -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。             -->
<blog-post :is-published="false"></blog-post>

<!-- 用一个变量进行动态赋值。                                -->
<blog-post :is-published="post.isPublished"></blog-post>
```

传递一个数组

```html
<!-- 即便数组是静态的，我们仍需通过 `v-bind` 来告诉 Vue        -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。             -->
<blog-post :comment-ids="[234, 266, 273]"></blog-post>

<!-- 用一个变量进行动态赋值。                                -->
<blog-post :comment-ids="post.commentIds"></blog-post>
```

传递一个对象

```html
<!-- 即便对象是静态的，我们仍需通过 `v-bind` 来告诉 Vue        -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。             -->
<blog-post
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- 用一个变量进行动态赋值。                                 -->
<blog-post :author="post.author"></blog-post>
```

传入一个对象的所有 property

```html
<blog-post v-bind="post"></blog-post>

<!-- 等价于 -->

<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

**动态组件**

vue内置component组件，通过绑定is属性实现组件切换

```vue
<template>
<button v-for="item in tabs" @click="currentTab = item">{{item}}</button>
	<component :is=“currentComponent”></component>
</template>

<script>
	import TabA from './TabA.vue'
  import TabB from './TabA.vue'
  import Tabc from './TabA.vue'
  components: {
    'tab-a': TabA,
    'tab-b': TabB,
    'tab-c': TabC
  },
  data() {
    return {
      currentTab: 'a'
    }
  },
  computed: {
    currentComponent() {
      return 'tab-' + currentTab.toLowerCase()
    }
  }
  
</script>
```

这样一个简易的动态组件就完成了，通过点击按钮来切换组件。

但是如果我们的组件内部也比较复杂，并不是只有一段话里面也有内容，我们在切换组件之后，上一次显示的组件，在重新被选择之后会进行重新渲染。

如果希望保留状态，可以使用`<keep-alive></keep-alive>`来保留组件的状态

```html
<keep-alive>
	<component :is=“currentComponent”></component>
</keep-alive>
```

**异步组件 defineAsyncComponent 暂时不谈**

**组件强制更新**

$forceUpdate 方法迫使组件实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

**v-once**

主要作用：如果有一个组件内部包含许多静态内容，可以在根元素添加`v-once`确保只会渲染一次然后进行缓存

```js
app.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```

 但是不要过度使用，除非明显感觉到渲染速度很慢

**过渡**

主要是 `<transition></transition>`组件，方式class或者使用动画生命周期钩子



# Composition API

**setup**

新的 `setup` 选项在组件创建**之前**执行，一旦 `props` 被解析，就将作为组合式 API 的入口。

在`setup`中，避免使用this，因为根本找不到组件实例。setup调用发生在data、computed、methods被解析之前，所以它们无法在setup中被获取。

setup接收两个参数：setup(props, ctx)。我们还可以这么写setup(props, { emit }) 需要emit的时候直接结构出来。为什么props不能结构？

因为props是响应式的，结构就消除了prop的响应式，解决方案使用toRefs

```
import { toRefs } from 'vue'

setup(props) {
	const { user } = toRefs(props) 
}
```

如果 `title` 是可选的 prop，则传入的 `props` 中可能没有 `title` 。在这种情况下，`toRefs` 将不会为 `title` 创建一个 ref 。你需要使用 `toRef` 替代它：

```js
// MyBook.vue
import { toRef } from 'vue'
setup(props) {
  const title = toRef(props, 'title')
  console.log(title.value)
}
```

传递给 `setup` 函数的第二个参数是 `context`。`context` 是一个普通 JavaScript 对象，暴露了其它可能在 `setup` 中有用的值：

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attribute (非响应式对象，等同于 $attrs)
    console.log(context.attrs)

    // 插槽 (非响应式对象，等同于 $slots)
    console.log(context.slots)

    // 触发事件 (方法，等同于 $emit)
    console.log(context.emit)

    // 暴露公共 property (函数)
    console.log(context.expose)
  }
}
```

`context` 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 `context` 使用 ES6 解构。

`attrs` 和 `slots` 是有状态的对象，它们总是会随组件本身的更新而更新。这意味着你应该避免对它们进行解构，并始终以 `attrs.x` 或 `slots.x` 的方式引用 property。请注意，与 `props` 不同，`attrs` 和 `slots` 的 property 是**非**响应式的。如果你打算根据 `attrs` 或 `slots` 的更改应用副作用，那么应该在 `onBeforeUpdate` 生命周期钩子中执行此操作。

**ref**

vue3提供了一个函数用于创建响应式变量。这个函数接收一个参数作为这个变量的初始值。我们可以把任意类型的值作为初始值，但如果是一个对象那么更建议使用`reactive`。获取变量的值使用 `[propertyName].value`的形式

```vue
import { ref } from 'vue'

let counter = ref(0)
```

当我们使用ts的时候也可以给ref传递一个泛型

```
import { ref } from 'vue'

interface Book {
	name: string
	publishDate: string
	price: number
}

const books = ref<Book[]>([])
```

**新的生命周期钩子**

- onBeforeMounted
- onMounted
- onBeforeUpdate
- onUpdated
- onBeforeUnmount
- onUnmounted
- onActivated
- onDeactivated

**v3中的 watch**

侦听器数据源可以是返回值的 getter 函数，也可以直接是 `ref`

```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

侦听器还可以使用数组同时侦听多个源：

```js
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

尽管如此，如果你在同一个函数里同时改变这些被侦听的来源，侦听器仍只会执行一次：

```js
setup() {
  const firstName = ref('')
  const lastName = ref('')

  watch([firstName, lastName], (newValues, prevValues) => {
    console.log(newValues, prevValues)
  })

  const changeValues = () => {
    firstName.value = 'John'
    lastName.value = 'Smith'
    // 打印 ["John", "Smith"] ["", ""]
  }

  return { changeValues }
}
```

通过更改设置 `flush: 'sync'`，我们可以为每个更改都强制触发侦听器，尽管这通常是不推荐的。或者，可以用 nextTick 等待侦听器在下一步改变之前运行。例如：

```js
  watch(
    [firstName, lastName], 
    (newValues, prevValues) => {
    	console.log(newValues, prevValues)
  	},
    { flush: true }
  )


const changeValues = async () => {
  firstName.value = 'John' // 打印 ["John", ""] ["", ""]
  await nextTick()
  lastName.value = 'Smith' // 打印 ["John", "Smith"] ["John", ""]
}
```

尝试检查深度嵌套对象或数组中的 property 变化时，仍然需要 `deep` 选项设置为 true。

```js
const state = reactive({ 
  id: 1,
  attributes: { 
    name: '',
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log('not deep', state.attributes.name, prevState.attributes.name)
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log('deep', state.attributes.name, prevState.attributes.name)
  },
  { deep: true }
)

state.attributes.name = 'Alex' // 日志: "deep" "Alex" "Alex"
```

**vue3的 computed**

```
let counter = ref(0)

let doubleCounter = computed(() => counter * 2)
```

**模板引用**

```
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

			onMounted(() => {
			// DOM 元素将在初始渲染后分配给 ref
				console.log(root.value)// <div>This is a root element</div>
			})

      return {
        root
      }
    }
  }
</script>
```

**`v-for` 中的用法**

```html
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // 确保在每次更新之前重置ref
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```

**侦听模板引用**

侦听模板引用的变更可以替代前面例子中演示使用的生命周期钩子。

但与生命周期钩子的一个关键区别是，`watch()` 和 `watchEffect()` 在 DOM 挂载或更新*之前*运行副作用，所以当侦听器运行时，模板引用还未被更新。

因此，使用模板引用的侦听器应该用 `flush: 'post'` 选项来定义，这将在 DOM 更新*后*运行副作用，确保模板引用与 DOM 保持同步，并引用正确的元素。

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        console.log(root.value) // => <div>This is a root element</div>
      }, 
      {
        flush: 'post'
      })

      return {
        root
      }
    }
  }
</script>
```

**自定义指令钩子函数**

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- `created`：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加在普通的 `v-on` 事件监听器调用前的事件监听器中时，这很有用。
- `beforeMount`：当指令第一次绑定到元素并且在挂载父组件之前调用。
- `mounted`：在绑定元素的父组件被挂载前调用。
- `beforeUpdate`：在更新包含组件的 VNode 之前调用。

提示

我们会在[稍后](https://v3.cn.vuejs.org/guide/render-function.html#虚拟-dom-树)讨论渲染函数时介绍更多 VNodes 的细节。

- `updated`：在包含组件的 VNode **及其子组件的 VNode** 更新后调用。
- `beforeUnmount`：在卸载绑定元素的父组件之前调用
- `unmounted`：当指令与元素解除绑定且父组件已卸载时，只调用一次。

接下来我们来看一下在[自定义指令 API](https://v3.cn.vuejs.org/api/application-api.html#directive) 钩子函数的参数 (即 `el`、`binding`、`vnode` 和 `prevVnode`)



## 深入响应性原理

一个直观的例子，在excel中有三个表格单元，前两个表格单元输入随机数字，第三个表格单元输入公式求前两个单元的和。此时我们随意修改前两个表格单元的数字，第三个表格便会自动更新为新的和。

在js中

```js
let num1 = 3
let num2 = 4
let sum = num1 + num2

console.log(sum) // 7

num2 = 5
console.log(sum) // 8
```

我们更新一个值，sum并不会随之修改。

让js也能实现响应性的基本思想

1. 当一个值被读取时进行追踪，如`num1 + num2`会同时读取`num1`和`num2`
2. 当某个值改变时进行检测，例如，当我们对`num2`重新赋值
3. 重新运行代码来读取原始值，例如再次运行`sum = num1 + num2`来更新`sum`的值。

## Provide/Inject

使用场景：有一个嵌套很深的组件，叶子节点需要根节点的数据。解决方案$attrs一层层传先去，累不累？react有useContext，vue 提供了provide和inject。顾名思义provide提供数据，需要数据的组件通过inject拿到数据。

```js
import { provide, inject } from 'vue'
// 父组件
setup() {
	provide: {
		'user-info': { name: 'a' }
	}
}

// 子组件
setup() {
	const userInfo = inject('user-info')
}
```

上面就是最简单的用法，但数据并不是响应式的，也就是后续userInfo改变的化，子组件并不会更新数据。

现在需要解决的问题就是让父组件提供的数据变成响应式

```js
const userInfo = ref({})
provide('user-info', userInfo.value)

// 或者

provide('user-info', computed(() => {...userInfo.value, role: 'student'}))
```

规范：当使用响应式 provide / inject 值时，**建议尽可能将对响应式 property 的所有修改限制在定义 provide 的组件内部**。

或者再提供一个方法给子组件，子组件调用这个方法去修改值。

再加一层保护，我们提供的value可以变为只读的，这样更加安全

















