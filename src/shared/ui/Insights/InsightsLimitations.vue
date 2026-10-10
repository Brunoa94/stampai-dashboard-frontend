<script setup lang="ts">
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

interface PropsI {
  limitations: string[];
}

defineProps<PropsI>();
</script>

<template>
  <Panel>
    <Heading class="mb-3">Measurement and review limitations</Heading>

    <Paragraph v-if="!limitations.length">
      No review limitations were returned.
    </Paragraph>

    <Paragraph v-for="(note, index) in limitations" :key="index" class="mb-2">
      {{ note }}
    </Paragraph>
  </Panel>
</template>
