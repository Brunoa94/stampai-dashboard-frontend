<script setup lang="ts">
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import LimitationNote from "@/shared/ui/LimitationNote/LimitationNote.vue";

interface PropsI {
  limitations: string[];
}

defineProps<PropsI>();

defineSlots<{ actions?(props: { note: string }): unknown }>();
</script>

<template>
  <Panel>
    <Heading class="mb-3">Measurement and review limitations</Heading>

    <Paragraph v-if="!limitations.length">
      No review limitations were returned.
    </Paragraph>

    <LimitationNote
      v-for="(note, index) in limitations"
      :key="index"
      class="mb-4"
    >
      {{ note }}

      <template v-if="$slots.actions" #actions>
        <slot name="actions" :note="note" />
      </template>
    </LimitationNote>
  </Panel>
</template>
