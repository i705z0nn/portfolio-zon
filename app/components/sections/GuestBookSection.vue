<script setup lang="ts">
import { Send, MessageCircle, Reply, ChevronUp } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { GuestMessage } from '~/composables/useChat'

const { t } = useI18n()

const { messages, connected, error, connect, disconnect, sendMessage } = useChat()

const form = reactive({
  name: '',
  content: '',
})

const replyingTo = ref<GuestMessage | null>(null)
const chatContainer = ref<HTMLElement | null>(null)
const showScrollBtn = ref(false)

function handleSubmit() {
  if (!form.name.trim() || !form.content.trim()) return
  sendMessage(form.name.trim(), form.content.trim(), replyingTo.value?.id)
  form.content = ''
  replyingTo.value = null
}

function handleReply(msg: GuestMessage) {
  replyingTo.value = msg
}

function cancelReply() {
  replyingTo.value = null
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function onScroll() {
  if (!chatContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value
  showScrollBtn.value = scrollHeight - scrollTop - clientHeight > 100
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

// Auto-scroll when new messages arrive
watch(
  () => messages.value.length,
  () => {
    nextTick(scrollToBottom)
  },
)

// Connect on mount, disconnect on unmount
onMounted(() => {
  connect()
  // Restore saved name
  const saved = localStorage.getItem('guestbook_name')
  if (saved) form.name = saved
})

onUnmounted(() => {
  disconnect()
})

// Save name to localStorage
watch(
  () => form.name,
  (name) => {
    if (name.trim()) localStorage.setItem('guestbook_name', name.trim())
  },
)
</script>

<template>
  <section id="guestbook" class="py-16 sm:py-24">
    <div class="container mx-auto px-4 max-w-4xl">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText :text="t('guestbookTitle')" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-8 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText :text="t('guestbookSubtitle')" :speed="40" />
      </p>

      <Card class="border-primary/20 overflow-hidden">
        <!-- Header bar -->
        <div class="flex items-center justify-between border-b border-primary/10 bg-muted/20 px-4 py-3">
          <div class="flex items-center gap-2">
            <MessageCircle class="h-4 w-4 text-primary" />
            <span class="text-sm font-retro text-primary">{{ t('guestbookLiveChat') }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="relative flex h-2 w-2">
                <span
                  :class="[
                    'absolute inline-flex h-full w-full rounded-full opacity-75',
                    connected ? 'animate-ping bg-emerald-400' : 'bg-red-400',
                  ]"
                />
                <span
                  :class="['relative inline-flex h-2 w-2 rounded-full', connected ? 'bg-emerald-500' : 'bg-red-500']"
                />
              </span>
              <span class="text-xs text-muted-foreground">
                {{ connected ? t('guestbookConnected') : t('guestbookConnecting') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Messages area -->
        <div
          ref="chatContainer"
          class="relative h-100 overflow-y-auto p-4 space-y-3 scroll-smooth"
          @scroll="onScroll"
        >
          <!-- Empty state -->
          <div v-if="messages.length === 0 && connected" class="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle class="h-12 w-12 mb-3 opacity-30" />
            <p class="text-sm">{{ t('guestbookEmpty') }}</p>
          </div>

          <!-- Loading state -->
          <div v-if="!connected" class="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div class="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p class="text-sm">{{ t('guestbookConnecting') }}</p>
          </div>

          <!-- Message bubbles -->
          <template v-for="msg in messages" :key="msg.id">
            <div :class="['group flex gap-3', msg.isAdmin ? 'flex-row-reverse' : '']">
              <!-- Avatar -->
              <div
                :class="[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase',
                  msg.isAdmin
                    ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                    : 'bg-muted text-muted-foreground ring-1 ring-border',
                ]"
              >
                {{ msg.isAdmin ? '★' : msg.name.charAt(0) }}
              </div>

              <!-- Bubble -->
              <div :class="['max-w-[75%] space-y-1', msg.isAdmin ? 'items-end' : '']">
                <div class="flex items-center gap-2" :class="msg.isAdmin ? 'flex-row-reverse' : ''">
                  <span :class="['text-xs font-semibold', msg.isAdmin ? 'text-primary' : 'text-foreground']">
                    {{ msg.isAdmin ? '✦ Admin' : msg.name }}
                  </span>
                  <span class="text-[10px] text-muted-foreground">
                    {{ formatDate(msg.createdAt) }} {{ formatTime(msg.createdAt) }}
                  </span>
                </div>

                <div
                  :class="[
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    msg.isAdmin
                      ? 'bg-primary/15 text-foreground rounded-tr-sm'
                      : 'bg-muted/50 text-foreground rounded-tl-sm border border-border/50',
                  ]"
                >
                  <!-- Show what this is replying to -->
                  <div v-if="msg.replyToId" class="mb-1.5 rounded-md bg-background/50 border-l-2 border-primary/30 px-2 py-1 text-xs text-muted-foreground">
                    {{ t('guestbookReplyTo') }}
                  </div>
                  {{ msg.content }}
                </div>

                <!-- Reply button -->
                <button
                  class="text-[10px] text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                  @click="handleReply(msg)"
                >
                  <Reply class="h-3 w-3" />
                  {{ t('guestbookReply') }}
                </button>

                <!-- Replies nested under this message -->
                <div v-if="msg.replies?.length" class="mt-2 space-y-2 pl-4 border-l-2 border-primary/10">
                  <div v-for="reply in msg.replies" :key="reply.id" class="flex gap-2">
                    <div
                      :class="[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase',
                        reply.isAdmin
                          ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                          : 'bg-muted text-muted-foreground ring-1 ring-border',
                      ]"
                    >
                      {{ reply.isAdmin ? '★' : reply.name.charAt(0) }}
                    </div>
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-1.5">
                        <span :class="['text-[10px] font-semibold', reply.isAdmin ? 'text-primary' : 'text-foreground']">
                          {{ reply.isAdmin ? '✦ Admin' : reply.name }}
                        </span>
                        <span class="text-[9px] text-muted-foreground">{{ formatTime(reply.createdAt) }}</span>
                      </div>
                      <div
                        :class="[
                          'rounded-xl px-3 py-1.5 text-xs leading-relaxed',
                          reply.isAdmin
                            ? 'bg-primary/10 text-foreground'
                            : 'bg-muted/30 text-foreground border border-border/30',
                        ]"
                      >
                        {{ reply.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Scroll to bottom button -->
          <Transition
            enter-active-class="transition duration-200"
            leave-active-class="transition duration-150"
            enter-from-class="opacity-0 translate-y-2"
            leave-to-class="opacity-0 translate-y-2"
          >
            <button
              v-if="showScrollBtn"
              class="sticky bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary/90 text-primary-foreground p-2 shadow-lg hover:bg-primary transition-colors"
              @click="scrollToBottom"
            >
              <ChevronUp class="h-4 w-4 rotate-180" />
            </button>
          </Transition>
        </div>

        <!-- Error message -->
        <div v-if="error" class="px-4 py-2 text-xs text-red-400 bg-red-500/10 border-t border-red-500/20">
          {{ error }}
        </div>

        <!-- Reply indicator -->
        <div v-if="replyingTo" class="flex items-center gap-2 px-4 py-2 bg-primary/5 border-t border-primary/10">
          <Reply class="h-3.5 w-3.5 text-primary" />
          <span class="text-xs text-muted-foreground flex-1 truncate">
            {{ t('guestbookReplyingTo') }} <strong class="text-foreground">{{ replyingTo.name }}</strong>: {{ replyingTo.content }}
          </span>
          <button class="text-xs text-muted-foreground hover:text-foreground" @click="cancelReply">✕</button>
        </div>

        <!-- Input area -->
        <CardContent class="border-t border-primary/10 p-4">
          <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
            <div class="flex gap-3">
              <Input
                v-model="form.name"
                :placeholder="t('guestbookYourName')"
                class="max-w-35 text-sm"
                maxlength="50"
                required
              />
              <div class="relative flex-1">
                <Input
                  v-model="form.content"
                  :placeholder="t('guestbookTypeMessage')"
                  class="pr-12 text-sm"
                  maxlength="500"
                  required
                  @keydown.enter.exact.prevent="handleSubmit"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  class="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                  :disabled="!connected || !form.name.trim() || !form.content.trim()"
                >
                  <Send class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p class="text-[10px] text-muted-foreground">
              {{ form.content.length }}/500 · {{ t('guestbookPublicNote') }}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
