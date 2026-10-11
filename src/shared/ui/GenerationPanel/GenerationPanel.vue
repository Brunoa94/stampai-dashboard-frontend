<script setup lang="ts">
import { ref } from "vue";
import { ChevronUp } from "@lucide/vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";

interface PropsI {
  id: string;
  title: string;
  pending: boolean;
}

const props = defineProps<PropsI>();

const expanded = defineModel<boolean>("expanded", { required: true });

const container = ref<HTMLElement>();

function focusInput(): void {
  container.value
    ?.querySelector<HTMLInputElement>("input")
    ?.focus({ preventScroll: true });
}

function focusTrigger(): void {
  document
    .getElementById(`${props.id}-trigger`)
    ?.focus({ preventScroll: true });
}
</script>

<template>
  <Transition
    name="generation-expand"
    @after-enter="focusInput"
    @after-leave="focusTrigger"
  >
    <div v-if="expanded" :id="id" class="generation-reveal">
      <div class="min-h-0 overflow-hidden">
        <Panel>
          <div ref="container">
            <div class="mb-5 flex items-center justify-between gap-3">
              <Heading as="h2" variant="card">{{ title }}</Heading>

              <Button
                variant="ghost"
                :disabled="pending"
                :aria-controls="id"
                :aria-expanded="true"
                aria-label="Collapse generation options"
                @click="expanded = false"
              >
                <ChevronUp :size="16" aria-hidden="true" />
                Collapse
              </Button>
            </div>

            <slot />
          </div>
        </Panel>
      </div>
    </div>
  </Transition>
</template>
