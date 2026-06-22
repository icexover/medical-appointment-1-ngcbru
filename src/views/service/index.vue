<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import NavBar from '@/components/NavBar.vue'

interface Message {
  id: number
  type: 'user' | 'agent'
  text: string
  time: string
  options?: string[]
}

const inputText = ref('')
const listRef = ref<HTMLDivElement | null>(null)
const typing = ref(false)

const messages = ref<Message[]>([
  {
    id: 1,
    type: 'agent',
    text: '您好！我是智慧医院在线客服小助手 🤖\n请问有什么可以帮您？您可以直接咨询或选择下方快捷问题：',
    time: formatTime(),
    options: [
      '如何预约挂号？',
      '预约后可以取消吗？',
      '报告多久能出来？',
      '忘记就诊时间怎么办？',
      '如何联系具体科室？',
    ],
  },
])

function formatTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const faq: Record<string, string> = {
  '如何预约挂号？': '您可以通过以下方式预约：\n1️⃣ 首页选择科室→医生→排班时段\n2️⃣ 点击底部"预约"Tab直接选择\n3️⃣ 搜索医生姓名快速找到\n预约成功后请及时支付，30分钟未支付订单自动取消。',
  '预约后可以取消吗？': '可以的！就诊前2小时可免费取消，超时取消收取20%手续费。\n操作路径：我的→我的订单→找到对应订单→点击取消预约。',
  '报告多久能出来？': '不同项目出具时间不同：\n📋 常规检验（血/尿）：4-6小时\n🩻 CT/MRI影像：24小时内\n🔬 病理检查：3-5个工作日\n报告出具后会第一时间推送消息提醒您。',
  '忘记就诊时间怎么办？': '您可以：\n1️⃣ 我的→我的订单 查看预约详情\n2️⃣ 就诊前1天20:00和当天07:00系统会自动推送提醒\n3️⃣ 如已错过，可联系科室咨询改约：010-XXXXXXXX',
  '如何联系具体科室？': '各科室咨询电话：\n📞 总机：010-XXXXXXXX\n❤️ 心内科：转8101\n🫁 呼吸科：转8102\n👶 儿科：转8103\n🏥 服务台：转0\n工作时间：07:30 - 17:30',
}

const greeting = ['您好', '你好', 'hi', 'hello', '在吗', '有人吗']

function getAutoReply(text: string): { text: string; options?: string[] } {
  if (greeting.some(g => text.toLowerCase().includes(g))) {
    return {
      text: '您好呀！很高兴为您服务 😊\n我可以帮您解答挂号、就诊、报告等问题，请直接提问或点击下方快捷问题：',
      options: Object.keys(faq),
    }
  }
  if (faq[text]) {
    return { text: faq[text] }
  }
  if (text.includes('预约') || text.includes('挂号')) {
    return { text: faq['如何预约挂号？'] }
  }
  if (text.includes('取消')) {
    return { text: faq['预约后可以取消吗？'] }
  }
  if (text.includes('报告')) {
    return { text: faq['报告多久能出来？'] }
  }
  if (text.includes('电话') || text.includes('联系') || text.includes('科室')) {
    return { text: faq['如何联系具体科室？'] }
  }
  return {
    text: '抱歉，我暂时无法理解您的问题 😅\n您可以尝试以下方式：\n• 点击下方快捷问题\n• 拨打人工客服：400-XXX-XXXX\n• 工作时间转人工服务',
    options: Object.keys(faq),
  }
}

function pushId() {
  return messages.value.length > 0 ? messages.value[messages.value.length - 1].id + 1 : 1
}

async function scrollBottom() {
  await nextTick()
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
}

async function send(text?: string) {
  const content = (text || inputText.value).trim()
  if (!content) return

  messages.value.push({
    id: pushId(),
    type: 'user',
    text: content,
    time: formatTime(),
  })
  inputText.value = ''
  scrollBottom()

  typing.value = true
  await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
  typing.value = false

  const reply = getAutoReply(content)
  messages.value.push({
    id: pushId(),
    type: 'agent',
    text: reply.text,
    time: formatTime(),
    options: reply.options,
  })
  scrollBottom()
}

function tapOption(opt: string) {
  send(opt)
}

function transfer() {
  ElMessage.success('正在为您转接人工客服，请稍候...')
  setTimeout(() => {
    messages.value.push({
      id: pushId(),
      type: 'agent',
      text: '👨‍💼 您好！我是客服专员小李，工号8001，请问有什么可以帮您？',
      time: formatTime(),
    })
    scrollBottom()
  }, 1500)
}

onMounted(scrollBottom)
</script>

<template>
  <div class="page">
    <NavBar title="在线客服">
      <template #right>
        <button class="transfer-btn" @click="transfer">转人工</button>
      </template>
    </NavBar>

    <div class="chat-list" ref="listRef">
      <div class="date-line">
        <span>今天 {{ new Date().toLocaleDateString('zh-CN') }}</span>
      </div>

      <div
        v-for="m in messages"
        :key="m.id"
        class="msg-row"
        :class="{ mine: m.type === 'user' }"
      >
        <div v-if="m.type === 'agent'" class="avatar">🤖</div>
        <div class="msg-body">
          <div v-if="m.type === 'agent'" class="name">小助手</div>
          <div class="bubble" :class="m.type">
            <span v-for="(line, i) in m.text.split('\n')" :key="i" class="line">{{ line }}</span>
          </div>
          <div v-if="m.options && m.options.length" class="options">
            <div
              v-for="opt in m.options"
              :key="opt"
              class="opt-item"
              @click="tapOption(opt)"
            >
              {{ opt }}
            </div>
          </div>
          <div class="time">{{ m.time }}</div>
        </div>
        <div v-if="m.type === 'user'" class="avatar mine">😊</div>
      </div>

      <div v-if="typing" class="msg-row">
        <div class="avatar">🤖</div>
        <div class="typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div class="input-bar">
      <input
        v-model="inputText"
        type="text"
        placeholder="请输入您的问题..."
        class="input"
        @keyup.enter="send()"
      />
      <button class="send-btn" @click="send()" :disabled="!inputText.trim()">
        发送
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 70px;
}
.transfer-btn {
  background: #eff6ff;
  color: #2c7be5;
  border: none;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.chat-list {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}
.date-line {
  text-align: center;
  margin: 4px 0 16px;
  span {
    display: inline-block;
    padding: 3px 12px;
    font-size: 11px;
    color: #fff;
    background: rgba(0,0,0,0.15);
    border-radius: 10px;
  }
}
.msg-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
  &.mine {
    flex-direction: row-reverse;
    .msg-body { align-items: flex-end; }
  }
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  &.mine {
    background: linear-gradient(135deg, #2c7be5, #4d91eb);
  }
}
.msg-body {
  max-width: 76%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  .name {
    font-size: 11px;
    color: #9ca3af;
    padding: 0 4px;
  }
}
.bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  &.agent {
    background: #fff;
    color: #1f2937;
    border-top-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  &.user {
    background: linear-gradient(135deg, #2c7be5, #4d91eb);
    color: #fff;
    border-top-right-radius: 4px;
  }
  .line {
    display: block;
  }
}
.time {
  font-size: 10px;
  color: #9ca3af;
  padding: 0 4px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
  width: 100%;
  .opt-item {
    padding: 9px 12px;
    background: #fff;
    border: 1px solid #dbeafe;
    color: #2c7be5;
    font-size: 13px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
    &:active {
      background: #eff6ff;
      transform: scale(0.98);
    }
  }
}
.typing-bubble {
  display: flex;
  gap: 4px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 14px;
  border-top-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9ca3af;
    animation: typing 1.2s infinite ease-in-out;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}
.input-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  display: flex;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #e5e7eb;
  @media (min-width: 768px) { max-width: 768px; }
  .input {
    flex: 1;
    padding: 11px 14px;
    background: #f3f4f6;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
  }
  .send-btn {
    padding: 0 18px;
    background: #2c7be5;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
}
</style>
